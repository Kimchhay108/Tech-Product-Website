"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginApi } from "../services/loginApi";
import { useState } from "react";
import { login, logout } from "@/lib/auth";
import { FcGoogle } from "react-icons/fc";
import {
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
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
    const [resetError, setResetError] = useState("");
    const [resetSuccess, setResetSuccess] = useState("");

    const handleLogin = async () => {
        setError("");
        setResetSuccess("");

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

    const handleGoogleLogin = async () => {
        setError("");
        setLoading(true);
        try {
            await signOut(auth);
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: "select_account" });
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;

            const names = (user.displayName || "").trim().split(" ");
            const firstName = names[0] || "";
            const lastName = names.slice(1).join(" ") || "";

            const saveRes = await fetch("/api/save-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    firstName,
                    lastName,
                    role: "user",
                }),
            });

            const result = await saveRes.json();
            if (!result.success) {
                throw new Error(result.message || "Failed to save user");
            }

            const savedUser = result.user;
            login(savedUser);
            setAuth({ user: savedUser, isLoggedIn: true });
            window.dispatchEvent(new Event("cart-reload"));
            window.dispatchEvent(new Event("storage"));

            if (savedUser.role === "admin") {
                router.push("/admin");
            } else if (savedUser.role === "staff") {
                router.push("/staff");
            } else {
                router.push("/user");
            }
        } catch (err) {
            if (err && err.code === "auth/popup-closed-by-user") {
                setError("Google sign-in was closed before completing");
            } else if (err && err.code === "auth/cancelled-popup-request") {
                setError("Popup request cancelled. Try again.");
            } else {
                setError(err.message || "Google sign-in failed");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!resetEmail) {
            setResetError("Please enter your email");
            return;
        }

        setResetLoading(true);
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setResetEmail("");
            setResetError("");
            setShowForgotModal(false);
            setResetSuccess("Password reset email sent. Check your inbox.");
        } catch (error) {
            if (error.code === "auth/user-not-found") {
                setResetError("No account found with this email");
            } else if (error.code === "auth/invalid-email") {
                setResetError("Please enter a valid email");
            } else {
                setResetError("Failed to send reset email");
            }
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="md:w-1/2 mx-auto">
            <div className="w-full">
                {resetSuccess && (
                    <div className="mb-4 p-3 rounded border border-green-500 bg-green-50 text-green-700 text-sm">
                        {resetSuccess}
                    </div>
                )}
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
                    <div className="mt-1">
                        <button
                            onClick={() => {
                                if (identifier && identifier.includes("@")) {
                                    setResetEmail(identifier);
                                }
                                setShowForgotModal(true);
                            }}
                            className="relative text-sm text-gray-700 group"
                        >
                            Forgot password?
                            <span
                                className="
                                    absolute left-0 -bottom-0.5 h-[1.5px] bg-black
                                    w-0
                                    transition-all duration-300 ease-out
                                    group-hover:w-full
                                "
                            />
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-2 bg-black text-white rounded font-semibold mb-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    LOGIN
                </button>
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-2 border border-gray-300 rounded font-semibold mb-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FcGoogle className="text-xl" />
                    Continue with Google
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
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 animate-fadeIn">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 animate-scaleIn">
                        <h2 className="text-2xl text-center font-bold mb-4">
                            Reset Password
                        </h2>
                        <p className="text-gray-600 mb-4">
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
                                onChange={(e) => {
                                    setResetEmail(e.target.value);
                                    setResetError("");
                                }}
                                className={`w-full px-3 py-2 border rounded ${
                                    resetError
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter your email"
                            />

                            {resetError && (
                                <p className="text-red-600 text-sm mt-1">
                                    {resetError}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleForgotPassword}
                            disabled={resetLoading}
                            className="w-full py-2 bg-black text-white rounded font-semibold mb-3 cursor-pointer disabled:opacity-50"
                        >
                            {resetLoading ? "Sent" : "Send Reset Email"}
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
