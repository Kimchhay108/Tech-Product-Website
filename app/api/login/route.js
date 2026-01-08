import { NextResponse } from "next/server";
import { userStore } from "@/lib/memoryStore";
import { db, auth as firebaseAuth } from "@/lib/firebaseConfig";
import { adminAuth } from "@/lib/firebaseAdmin";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

async function findUserByIdentifier(identifier) {
  try {
    // 1) Try Firestore users collection (phone or email)
    const usersRef = collection(db, "users");

    // phone lookup
    let snap = await getDocs(query(usersRef, where("phone", "==", identifier), limit(1)));
    if (!snap.empty) {
      const doc = snap.docs[0];
      return { source: "firestore", id: doc.id, ...doc.data() };
    }

    // email lookup (exact match)
    snap = await getDocs(query(usersRef, where("email", "==", identifier), limit(1)));
    if (!snap.empty) {
      const doc = snap.docs[0];
      return { source: "firestore", id: doc.id, ...doc.data() };
    }

    // Debug: Log all users in Firestore to check what's there
    console.log("🔎 No user found with identifier:", identifier);
    console.log("📋 All users in Firestore:");
    const allUsers = await getDocs(usersRef);
    allUsers.forEach((doc) => {
      console.log("  - Email:", doc.data().email, "| Phone:", doc.data().phone, "| UID:", doc.id);
    });
  } catch (error) {
    console.error("Firestore query error:", error);
    // If Firestore fails, continue to memory store fallback
  }

  // 2) Fallback to in-memory store (legacy phone-only)
  const memoryUser = userStore[identifier];
  if (memoryUser) {
    return { source: "memory", ...memoryUser };
  }

  return null;
}

export async function POST(req) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: "Email/phone and password required" },
        { status: 400 }
      );
    }

    console.log("🔍 Login attempt with identifier:", identifier);

    // First, handle email-based login with verification enforcement
    if (identifier.includes("@")) {
      try {
        // Fetch user record from Firestore first to determine role/active status
        const usersRef = collection(db, "users");
        const snap = await getDocs(query(usersRef, where("email", "==", identifier), limit(1)));
        const hasUserDoc = !snap.empty;
        const userDoc = hasUserDoc ? snap.docs[0] : null;
        const userData = hasUserDoc ? userDoc.data() : null;

        // Block deactivated accounts (if record exists)
        if (userData && userData.active === false) {
          return NextResponse.json(
            { success: false, message: "Account is deactivated. Contact admin." },
            { status: 403 }
          );
        }

        // Enforce verification for regular users (admins/staff can bypass)
        const role = (userData && userData.role) ? userData.role : "user";

        // Prefer Admin SDK to check verification status without signing in
        if (role === "user" && adminAuth) {
          try {
            const userRecord = await adminAuth.getUserByEmail(identifier);
            if (!userRecord.emailVerified) {
              return NextResponse.json(
                { success: false, message: "Please verify your email before logging in. Check your inbox for the verification link." },
                { status: 403 }
              );
            }
          } catch (adminErr) {
            // If user not found in Admin or admin not configured, continue to password check
            console.log("ℹ️ Admin check skipped:", adminErr?.message || "admin not configured");
          }
        }

        // Proceed with password authentication
        console.log("🔐 Attempting Firebase Auth login for email:", identifier);
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, identifier, password);
        const firebaseUser = userCredential.user;

        // Fallback verification check if Admin SDK not available
        if (role === "user" && adminAuth == null && !firebaseUser.emailVerified) {
          return NextResponse.json(
            { success: false, message: "Please verify your email before logging in. Check your inbox for the verification link." },
            { status: 403 }
          );
        }

        console.log("✅ Firebase Auth successful for:", firebaseUser.email);

        if (hasUserDoc) {
          const responseUser = {
            uid: userDoc.id,
            phone: userData.phone || "",
            email: userData.email,
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            fullName: `${userData.firstName || ""} ${userData.lastName || ""}`,
            gender: userData.gender || "",
            password: password,
            role: userData.role || "user",
            createdAt: userData.createdAt,
            active: userData.active !== false,
          };

          return NextResponse.json({
            success: true,
            message: "Login successful",
            user: responseUser,
          });
        }

        // User exists in Firebase but not in Firestore, return minimal profile
        const responseUser = {
          uid: firebaseUser.uid,
          phone: "",
          email: firebaseUser.email,
          firstName: "",
          lastName: "",
          fullName: "",
          gender: "",
          password: password,
          role: "user",
        };

        return NextResponse.json({
          success: true,
          message: "Login successful",
          user: responseUser,
        });
      } catch (firebaseError) {
        console.log("❌ Firebase Auth failed:", firebaseError.code, firebaseError.message);
        // Provide clearer message for common scenarios
        const message =
          firebaseError.code === "auth/user-not-found"
            ? "Account not found. If you just registered, please verify your email first."
            : firebaseError.code === "auth/wrong-password"
            ? "Incorrect email or password"
            : "Login failed";
        return NextResponse.json({ success: false, message }, { status: 401 });
      }
    }

    // Fallback for phone number login (memory store only)
    const memoryUser = userStore[identifier];
    if (memoryUser && memoryUser.password === password) {
      const responseUser = {
        uid: memoryUser.uid || identifier,
        phone: memoryUser.phone || identifier,
        email: memoryUser.email || "",
        firstName: memoryUser.firstName || "",
        lastName: memoryUser.lastName || "",
        fullName: `${memoryUser.firstName || ""} ${memoryUser.lastName || ""}`,
        gender: memoryUser.gender || "",
        password: password,
        role: memoryUser.role || "user",
      };

      console.log("✅ Login successful via memory store for:", identifier);
      return NextResponse.json({
        success: true,
        message: "Login successful",
        user: responseUser,
      });
    }

    return NextResponse.json(
      { success: false, message: "User not found or incorrect password" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed: " + error.message },
      { status: 500 }
    );
  }
}
