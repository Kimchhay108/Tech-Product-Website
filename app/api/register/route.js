import { NextResponse } from "next/server";
import { otpStore, userStore } from "@/lib/memoryStore";

export async function POST(req) {
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

  userStore[phone] = {
    phone,
    password,
    ...rest,
    createdAt: new Date(),
  };

  delete otpStore[phone];

  console.log("✅ User saved:", userStore[phone]);

  return NextResponse.json({
    success: true,
    message: "Registered successfully",
  });
}
