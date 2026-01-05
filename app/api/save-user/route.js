import { NextResponse } from "next/server";
import { userStore } from "@/lib/memoryStore";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, setDoc, doc, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const { uid, phone, password, firstName, lastName, gender, email, role = "user" } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    console.log("🔄 Saving user data for UID:", uid);
    console.log("📧 Email:", email);
    console.log("🔑 Password being saved:", password ? "YES (length: " + password.length + ")" : "NO");

    const userData = {
      phone: phone || "",
      firstName: firstName || "",
      lastName: lastName || "",
      gender: gender || "",
      email,
      role,
      createdAt: serverTimestamp(),
    };

    // Always include password if provided (never null)
    if (password) {
      userData.password = password;
      console.log("✅ Password field will be set to:", password);
    } else {
      console.log("⚠️ No password provided, keeping existing password");
    }

    // Save to Firestore
    const usersRef = collection(db, "users");
    let firestoreUid = uid;

    if (uid) {
      // If uid provided, use it as document ID
      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, userData, { merge: true });
      firestoreUid = uid;
      console.log("✅ Updated existing user in Firestore with ID:", uid);
    } else {
      // Otherwise, auto-generate ID
      const docRef = await addDoc(usersRef, userData);
      firestoreUid = docRef.id;
      console.log("✅ Created new user in Firestore with ID:", firestoreUid);
    }

    // Also save to memory store as fallback
    userStore[email] = {
      uid: firestoreUid,
      ...userData,
      createdAt: new Date(),
    };

    console.log("✅ User saved to memory store");
    console.log("✅ Final user data saved:", userData);

    return NextResponse.json({ 
      success: true, 
      message: "User saved", 
      user: { uid: firestoreUid, ...userData } 
    });
  } catch (error) {
    console.error("Save user error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save user. " + error.message },
      { status: 500 }
    );
  }
}