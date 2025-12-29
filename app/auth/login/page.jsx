"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginApi } from "../services/loginApi";
import { useState } from "react";
import { login } from "@/lib/auth";

export default function Login({ setSelectedAuth }) {
    const router = useRouter();
    const [tel, setTel] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!tel || !password) {
            alert("Please enter phone number and password");
            return;
        }

        try {
            const response = await loginApi(tel, password);

            if (response.success) {
               
                login(response.user);

                if (response.user.role === "admin") {
                    router.push("/admin");
                } else if (response.user.role === "staff") {
                    router.push("/staff");
                } else {
                    router.push("/user");
                }
            }
        } catch (err) {
            console.error(err);
            alert(err.message || "Login failed");
        }
    };

    return (
        <div className="md:w-1/2 mx-auto">
            <div className="w-full">
                <div className="mb-3">
                    <label className="block mb-1 font-medium">
                        Mobile Number
                    </label>
                    <input
                        type="tel"
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Enter your number"
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full py-2 bg-black text-white rounded font-semibold mb-4 cursor-pointer"
                >
                    LOGIN
                </button>

                <div className="text-center">
                    <button
                        onClick={() => setSelectedAuth("register")}
                        className="hover:underline"
                    >
                        New to Cyber? Create an account
                    </button>
                </div>
            </div>
        </div>
    );
}
