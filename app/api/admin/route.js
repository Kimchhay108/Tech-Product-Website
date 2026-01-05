import { db, auth } from "@/lib/firebaseConfig";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";

// GET check if admin exists
export async function GET(req) {
  try {
    const adminQuery = query(
      collection(db, "users"),
      where("role", "==", "admin")
    );
    const adminSnapshot = await getDocs(adminQuery);

    if (adminSnapshot.empty) {
      return Response.json({ success: true, adminExists: false });
    }

    const adminData = adminSnapshot.docs[0].data();
    return Response.json({
      success: true,
      adminExists: true,
      admin: {
        uid: adminSnapshot.docs[0].id,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        email: adminData.email,
      },
    });
  } catch (error) {
    console.error("❌ Error checking admin:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create admin (only if no admin exists)
export async function POST(req) {
  try {
    const { firstName, lastName, email, password, dateOfBirth } =
      await req.json();

    // Check if admin already exists
    const adminQuery = query(
      collection(db, "users"),
      where("role", "==", "admin")
    );
    const adminSnapshot = await getDocs(adminQuery);

    if (!adminSnapshot.empty) {
      return Response.json(
        {
          success: false,
          error: "Admin account already exists. Only 1 admin allowed.",
        },
        { status: 400 }
      );
    }

    // Validate inputs
    if (!firstName || !lastName || !email || !password) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields: firstName, lastName, email, password",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Create Firebase Auth user using Admin SDK
    if (!adminAuth) {
      console.error("❌ Firebase Admin SDK not initialized");
      return Response.json(
        { 
          success: false, 
          error: "Firebase Admin SDK not configured. Please set up service account credentials.",
          instructions: "1. Go to Firebase Console settings/serviceaccounts/adminsdk 2. Generate new private key 3. Save as service-account-key.json 4. Add GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json to .env.local 5. Restart dev server"
        },
        { status: 500 }
      );
    }

    try {
      const userRecord = await adminAuth.createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
      });
      const userId = userRecord.uid;

      console.log("✅ Firebase admin user created:", userId);

      // Save admin profile to Firestore using Admin SDK
      const userRef = adminDb.collection("users").doc(userId);
      await userRef.set({
        uid: userId,
        firstName,
        lastName,
        email,
        dateOfBirth: dateOfBirth || null,
        role: "admin",
        createdAt: new Date(),
        active: true,
      });
    } catch (firebaseError) {
      console.error("❌ Firebase error:", firebaseError.message);
      throw firebaseError;
    }

    return Response.json(
      {
        success: true,
        message: "Admin account created successfully",
        data: {
          uid: userId,
          email,
          firstName,
          lastName,
          role: "admin",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating admin:", error);

    let errorMessage = error.message;
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email already in use";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email format";
    }

    return Response.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
