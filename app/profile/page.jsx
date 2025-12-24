"use client";

import { useState } from "react";
import { FiCpu } from "react-icons/fi";
import Login from "../auth/login/page";
import Register from "../auth/register/page";

export default function ProfilePage() {
    const [selectedAuth, setSelectedAuth] = useState("login");

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
                        <Login setSelectedAuth={setSelectedAuth}/>
                    )}
                    {selectedAuth === "register" && (
                        <Register setSelectedAuth={setSelectedAuth}/>
                    )}
                </div>
            </div>
        </section>
    );
}
