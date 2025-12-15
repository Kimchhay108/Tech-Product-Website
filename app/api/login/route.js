// app/api/login/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const { tel, password } = await req.json();

  // example test users
  const users = [
    { tel: "111", password: "111", role: "admin" },
    { tel: "222", password: "222", role: "staff" },
    { tel: "333", password: "333", role: "user" },
  ];

  const user = users.find(u => u.tel === tel && u.password === password);

  if (user) {
    return NextResponse.json({ success: true, user });
  } else {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }
}
