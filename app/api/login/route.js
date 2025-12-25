import { NextResponse } from "next/server";
import { userStore } from "@/lib/memoryStore"; // shared with register

export async function POST(req) {
  const { phone, password } = await req.json();

  if (!phone || !password) {
    return NextResponse.json(
      { success: false, message: "Phone and password required" },
      { status: 400 }
    );
  }

  const user = userStore[phone];

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  if (user.password !== password) {
    return NextResponse.json(
      { success: false, message: "Incorrect password" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Login successful",
    user: { phone, firstName: user.firstName, lastName: user.lastName, role: user.role },
  });
}
