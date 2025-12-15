import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { phone, password, firstName, lastName, gender, email } = body;

        // Simple validation
        if (!phone || !password) {
            return NextResponse.json(
                { success: false, message: "Phone and password are required" },
                { status: 400 }
            );
        }

        // TODO: Save user to your database here
        // For testing, we just return the user data
        const newUser = { phone, firstName, lastName, gender, email, role: "user" };

        return NextResponse.json({ success: true, user: newUser });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message || "Registration failed" },
            { status: 500 }
        );
    }
}
