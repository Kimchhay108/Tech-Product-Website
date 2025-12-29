"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth"; // <-- your auth helper
import { FiCpu } from "react-icons/fi";
import Login from "../auth/login/page";
import Register from "../auth/register/page";

export default function ProfilePage() {
    const [selectedAuth, setSelectedAuth] = useState("login");
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();

        if (auth?.user?.role === "admin") {
            router.replace("/admin");
        } else if (auth?.user?.role === "staff") {
            router.replace("/staff");
        } else if (auth?.user?.role === "user") {
            router.replace("/user");
        }
        // If no auth, stay on profile page (login/register)
    }, [router]);

    return (
        <section className="md:min-h-screen container mx-auto">
            <div className="w-full my-2 flex p-3">
                <div className="w-full">
                    {/* Header */}
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
                            Welcome to cyber <FiCpu size={20} />
                        </p>

                        <div className="flex gap-5 mb-5">
                            <button
                                onClick={() => setSelectedAuth("login")}
                                className={
                                    selectedAuth === "login"
                                        ? "border-b-2 font-bold"
                                        : ""
                                }
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setSelectedAuth("register")}
                                className={
                                    selectedAuth === "register"
                                        ? "border-b-2 font-bold"
                                        : ""
                                }
                            >
                                Register
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {selectedAuth === "login" && (
                        <Login setSelectedAuth={setSelectedAuth} />
                    )}
                    {selectedAuth === "register" && (
                        <Register setSelectedAuth={setSelectedAuth} />
                    )}
                </div>
            </div>
        </section>
    );
}
