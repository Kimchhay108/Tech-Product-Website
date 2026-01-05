import { NextResponse } from "next/server";
import { otpStore, userStore } from "@/lib/memoryStore";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const { phone, otp, password, ...rest } = await req.json();

    const record = otpStore[phone];

    if (!record) {
      return NextResponse.json(
        { success: false, message: "OTP not found" },
        { status: 400 }
      );
    }

    if (record.expiresAt < Date.now()) {
      delete otpStore[phone];
      return NextResponse.json(
        { success: false, message: "OTP expired" },
        { status: 400 }
      );
    }

    if (record.otp != otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Prepare user data
    const userData = {
      phone,
      password,
      ...rest,
      role: rest.role || "user",
      createdAt: serverTimestamp(),
    };

    // Save to Firestore
    const usersRef = collection(db, "users");
    const docRef = await addDoc(usersRef, userData);

    // Also save to memory store as fallback
    userStore[phone] = {
      ...userData,
      uid: docRef.id,
      createdAt: new Date(),
    };

    delete otpStore[phone];

    console.log("✅ User saved to Firestore with ID:", docRef.id);

    return NextResponse.json({
      success: true,
      message: "Registered successfully",
      uid: docRef.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
