"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginApi } from "../services/loginApi";
import { useState } from "react";
import { login, logout } from "@/lib/auth";
import {
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

export default function Login({ setSelectedAuth, setAuth }) {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [errorField, setErrorField] = useState(""); // "identifier" | "password"
    const [loading, setLoading] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetLoading, setResetLoading] = useState(false);

    const handleLogin = async () => {
        setError("");

        if (!identifier) {
            setError("Please enter your email or phone");
            setErrorField("identifier");
            return;
        }

        if (!password) {
            setError("Please enter your password");
            setErrorField("password");
            return;
        }

        setLoading(true);
        try {
            // Clear any existing Firebase session first
            await signOut(auth);

            const response = await loginApi(identifier, password);

            if (response.success) {
                // Clear any existing user data first
                logout();

                // Try to sign in with Firebase if identifier is an email
                if (identifier.includes("@")) {
                    try {
                        const userCredential = await signInWithEmailAndPassword(
                            auth,
                            identifier,
                            password
                        );
                        const user = userCredential.user;

                        // Check if email is verified - but skip for staff/admin accounts (created by admin)
                        if (
                            !user.emailVerified &&
                            response.user.role === "user"
                        ) {
                            setError(
                                "Please verify your email before logging in. Check your inbox for the verification link."
                            );
                            setLoading(false);
                            await signOut(auth);
                            return;
                        }
                    } catch (firebaseError) {
                        if (firebaseError.code === "auth/wrong-password") {
                            setError("Incorrect password");
                            setErrorField("password");
                        } else if (
                            firebaseError.code === "auth/user-not-found"
                        ) {
                            setError("Email not found");
                            setErrorField("identifier");
                        } else {
                            setError("Login failed");
                            setErrorField("identifier");
                        }

                        setLoading(false);
                        return;
                    }
                }

                // Set new user data
                login(response.user);
                setAuth({ user: response.user, isLoggedIn: true });

                // Trigger cart reload with custom event
                window.dispatchEvent(new Event("cart-reload"));
                window.dispatchEvent(new Event("storage"));

                if (response.user.role === "admin") {
                    router.push("/admin");
                } else if (response.user.role === "staff") {
                    router.push("/staff");
                } else {
                    router.push("/user");
                }
            } else {
                setError(response.message || "Login failed");
                setErrorField("identifier");
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!resetEmail) {
            alert("Please enter your email");
            return;
        }

        setResetLoading(true);
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            alert("Password reset email sent! Check your inbox.");
            setResetEmail("");
            setShowForgotModal(false);
        } catch (error) {
            alert(error.message || "Failed to send reset email");
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="md:w-1/2 mx-auto">
            <div className="w-full">
                <div className="mb-3">
                    <label className="block mb-1 font-medium">
                        Email or Phone Number
                    </label>

                    <input
                        type="text"
                        className={`w-full px-3 py-2 border rounded ${
                            errorField === "identifier" ? "border-red-500" : ""
                        }`}
                        placeholder="Enter your email or phone"
                        value={identifier}
                        onChange={(e) => {
                            setIdentifier(e.target.value);
                            setError("");
                            setErrorField("");
                        }}
                    />

                    {errorField === "identifier" && (
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Password</label>

                    <input
                        type="password"
                        className={`w-full px-3 py-2 border rounded ${
                            errorField === "password"
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                            setErrorField("");
                        }}
                    />

                    {errorField === "password" && (
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    )}

                    {/* Forgot password button stays here */}
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-2 bg-black text-white rounded font-semibold mb-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    LOGIN
                </button>

                <div className="text-center">
                    <button
                        onClick={() => setSelectedAuth("register")}
                        className="relative font-medium group cursor-pointer"
                    >
                        New to Cyber? Create an account
                        <span
                            className="
                                absolute left-0 -bottom-1 h-[1.5px] bg-black
                                w-0
                                transition-all duration-300 ease-out
                                group-hover:w-full
                            "
                        />
                    </button>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h2 className="text-2xl font-bold mb-2">
                            Reset Password
                        </h2>
                        <p className="text-gray-600 mb-5">
                            Enter your email and we&apos;ll send you a link to
                            reset your password.
                        </p>

                        <div className="mb-4">
                            <label className="block mb-2 font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                placeholder="Enter your email"
                            />
                        </div>

                        <button
                            onClick={handleForgotPassword}
                            disabled={resetLoading}
                            className="w-full py-2 bg-black text-white rounded font-semibold mb-3 cursor-pointer disabled:bg-gray-400"
                        >
                            {resetLoading ? "Sending..." : "Send Reset Email"}
                        </button>

                        <button
                            onClick={() => setShowForgotModal(false)}
                            className="w-full py-2 border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
