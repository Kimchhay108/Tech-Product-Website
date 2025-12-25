import { NextResponse } from "next/server";
import { otpStore } from "@/lib/memoryStore";

export async function POST(req) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json(
      { message: "Phone is required" },
      { status: 400 }
    );
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[phone] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  console.log("📱 OTP for", phone, "=>", otp);

  return NextResponse.json({
    success: true,
    message: "OTP sent",
  });
}
