"use client";

import { useState } from "react";
import Link from "next/link";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { savePhoneUserApi } from "../services/registerApi";
import { login } from "@/lib/auth";

export default function Register({ setSelectedAuth, setAuth }) {
    const [gender, setGender] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errorField, setErrorField] = useState(""); // field name
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [userForResend, setUserForResend] = useState(null);

    // 🔹 CREATE ACCOUNT
    const handleCreateAccount = async () => {
        setError("");
        setErrorField("");

        if (!gender) {
            setError("Please select your gender");
            setErrorField("gender");
            return;
        }
        if (!firstName) {
            setError("Please enter first name");
            setErrorField("firstName");
            return;
        }
        if (!lastName) {
            setError("Please enter last name");
            setErrorField("lastName");
            return;
        }
        if (!dateOfBirth) {
            setError("Please select your date of birth");
            setErrorField("dateOfBirth");
            return;
        }
        if (!email) {
            setError("Please enter your email");
            setErrorField("email");
            return;
        }
        if (!password) {
            setError("Please enter your password");
            setErrorField("password");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setErrorField("password");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setErrorField("confirmPassword");
            return;
        }

        setLoading(true);
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            console.log("✅ User created:", user.uid);

            // Send verification email
            try {
                await sendEmailVerification(user);
                console.log(
                    "✅ Verification email sent successfully to:",
                    email
                );
            } catch (emailError) {
                console.error(
                    "❌ Failed to send verification email:",
                    emailError
                );
                // Continue anyway, user can resend later
            }

            // Save user profile to database (always as "user" - staff/admin created by admin only)
            await savePhoneUserApi({
                uid: user.uid,
                phone: "",
                firstName,
                lastName,
                dateOfBirth,
                gender,
                email,
                password,
                role: "user", // 🔒 Only admin can create staff accounts via /api/staff
            });

            // Create user object
            const newUser = {
                uid: user.uid,
                fullName: `${firstName} ${lastName}`,
                firstName,
                lastName,
                gender,
                email,
                role: "user",
                emailVerified: false,
            };

            // Do NOT auto-login; require email verification first
            // Show verification modal so user can proceed to login after verifying
            setVerificationEmail(email);
            setUserForResend(user);
            setShowVerificationModal(true);
        } catch (err) {
            setError(err.message || "Registration failed");
            setErrorField("email");
        } finally {
            setLoading(false);
        }
    };

    // Resend verification email
    const handleResendVerification = async () => {
        if (resendCooldown > 0) {
            alert(`Please wait ${resendCooldown} seconds before trying again`);
            return;
        }

        if (!userForResend) {
            alert("Unable to resend. Please try registering again.");
            return;
        }

        setResendLoading(true);
        try {
            await sendEmailVerification(userForResend);
            alert("Verification email sent! Check your inbox.");

            // Set cooldown of 60 seconds
            setResendCooldown(60);
            const interval = setInterval(() => {
                setResendCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            const errorMessage =
                error.code === "auth/too-many-requests"
                    ? "Too many requests. Please wait a few minutes before trying again."
                    : error.message;
            alert("Failed to send verification email: " + errorMessage);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="md:w-1/2 mx-auto">
            <div className="w-full">
                {/* Gender */}
                <div className="flex flex-col gap-2 mb-3">
                    <div className="flex items-center gap-5">
                        <p className="font-medium">Gender (Required)</p>
                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                onChange={(e) => {
                                    setGender(e.target.value);
                                    setError("");
                                    setErrorField("");
                                }}
                                className="accent-black"
                            />{" "}
                            Male
                        </label>
                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                onChange={(e) => {
                                    setGender(e.target.value);
                                    setError("");
                                    setErrorField("");
                                }}
                                className="accent-black"
                            />{" "}
                            Female
                        </label>
                    </div>
                    {errorField === "gender" && (
                        <p className="text-red-600 text-sm">{error}</p>
                    )}
                </div>

                {/* Name */}
                <div className="flex flex-col md:flex-row gap-4 mb-2">
                    {/* First Name */}
                    <div className="w-full">
                        <label className="block mb-1 font-medium">
                            First Name
                        </label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => {
                                setFirstName(e.target.value);
                                setError("");
                                setErrorField("");
                            }}
                            className={`w-full px-2 py-2 border rounded ${
                                errorField === "firstName"
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder="Enter first name"
                        />
                        {errorField === "firstName" && (
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div className="w-full">
                        <label className="block mb-1 font-medium">
                            Last Name
                        </label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => {
                                setLastName(e.target.value);
                                setError("");
                                setErrorField("");
                            }}
                            className={`w-full px-2 py-2 border rounded ${
                                errorField === "lastName"
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder="Enter last name"
                        />
                        {errorField === "lastName" && (
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                        )}
                    </div>
                </div>

                {/* Date of Birth */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">
                        Date of Birth (Required)
                    </label>
                    <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => {
                            setDateOfBirth(e.target.value);
                            setError("");
                            setErrorField("");
                        }}
                        className={`w-full px-2 py-2 border rounded ${
                            errorField === "dateOfBirth"
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                    />
                    {errorField === "dateOfBirth" && (
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">
                        Email (Required)
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                            setErrorField("");
                        }}
                        className={`w-full px-3 py-2 border rounded ${
                            errorField === "email"
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                    />
                    {errorField === "email" && (
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    )}
                </div>

                {/* Password */}
                <div className="mb-3">
                    <label className="block mb-1 font-medium">
                        Password (Required)
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                            setErrorField("");
                        }}
                        className={`w-full px-2 py-2 border rounded ${
                            errorField === "password"
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        placeholder="Enter password (min 6 characters)"
                    />
                    {errorField === "password" && (
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="mb-5">
                    <label className="block mb-1 font-medium">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setError("");
                            setErrorField("");
                        }}
                        className={`w-full px-2 py-2 border rounded ${
                            errorField === "confirmPassword"
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        placeholder="Confirm password"
                    />
                    {errorField === "confirmPassword" && (
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    )}
                </div>

                <button
                    onClick={handleCreateAccount}
                    disabled={loading}
                    className="w-full py-2 bg-black text-white rounded font-semibold mb-4 cursor-pointer disabled:opacity-50"
                >
                    REGISTER
                </button>

                <div className="text-center">
                    <button
                        onClick={() => setSelectedAuth("login")}
                        className="relative font-medium group cursor-pointer"
                    >
                        Already have an account? Get Started!
                            <span
                            className="
                                absolute left-0 -bottom-1 h-px bg-black
                                w-0
                                transition-all duration-300 ease-out
                                group-hover:w-full
                                "
                        />
                    </button>
                </div>
            </div>

            {/* Email Verification Modal */}
            {showVerificationModal && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center">
                        <h2 className="text-2xl font-bold mb-3">
                            Verify Your Email
                        </h2>
                        <p className="text-gray-600 mb-4">
                            We sent a verification link to:
                        </p>
                        <p className="font-semibold text-lg mb-4">
                            {verificationEmail}
                        </p>
                        <p className="text-gray-600 mb-6">
                            Click the link in your email to verify your account
                            and complete registration.
                        </p>

                        <div className="bg-[#F6F6F6] border border-red-500 rounded p-4 mb-6">
                            <p className="text-sm">
                                <strong>Check your spam folder</strong> if you
                                don&apos;t see the email in your inbox.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setShowVerificationModal(false);
                                setSelectedAuth("login");
                            }}
                            className="w-full py-2 bg-black text-white rounded font-semibold cursor-pointer"
                        >
                            Go to Login
                        </button>
                        <p className="text-sm text-gray-500 mt-4">
                            Didn&apos;t get an email?{" "}
                            <button
                                onClick={handleResendVerification}
                                disabled={resendLoading || resendCooldown > 0}
                                className="text-black hover:underline disabled:opacity-50 disabled:no-underline"
                            >
                                {resendLoading
                                    ? "Sent"
                                    : resendCooldown > 0
                                    ? `Resend (${resendCooldown}s)`
                                    : "Resend"}
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
