"use client";

import { useState } from "react";
import Link from "next/link";
import { registerApi } from "../services/registerApi";

export default function Register( {setSelectedAuth} ) {
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [otpInput, setOtpInput] = useState("");

    const [gender, setGender] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = () => {
        if (!phone) {
            alert("Phone number is required");
            return;
        }
        setShowOtpModal(true);
    };

    const handleConfirmOtp = () => {
        setShowOtpModal(false);
        setShowPasswordModal(true);
    };

    const handleCreateAccount = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const userData = { gender, firstName, lastName, phone, email, password };
            const response = await registerApi(userData);

            if (response.success) {
                setShowPasswordModal(false);
                alert("Account created 🎉 You can now login!");
            }
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <>
            <div className="md:w-1/2 mx-auto">
                <div className="w-full">
                    {/* Gender */}
                    <div className="flex items-center gap-5 mb-3">
                        <p className="font-medium">Gender (Required)</p>
                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                onChange={(e) => setGender(e.target.value)}
                                className="accent-black"
                            /> Male
                        </label>
                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                onChange={(e) => setGender(e.target.value)}
                                className="accent-black"
                            /> Female
                        </label>
                    </div>

                    {/* Name */}
                    <div className="flex flex-col md:flex-row gap-4 mb-2">
                        <div className="w-full">
                            <label className="block mb-1 font-medium">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-2 py-2 border rounded"
                            />
                        </div>
                        <div className="w-full">
                            <label className="block mb-1 font-medium">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-2 py-2 border rounded"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="mb-2">
                        <label className="block mb-1 font-medium">Phone Number (Required)</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-5">
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    <button
                        onClick={handleRegister}
                        className="w-full py-2 bg-black text-white rounded font-semibold mb-4"
                    >
                        REGISTER
                    </button>

                    <div className="text-center">
                        <button
                            onClick={() => setSelectedAuth("login")}
                            className="hover:underline"
                        >
                            Already have an account? Login
                        </button>
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 z-50 flex justify-center items-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowOtpModal(false)} />
                    <div className="relative bg-white p-6 rounded-sm w-80 shadow-xl text-center animate-fadeIn">
                        <h2 className="text-lg font-bold mb-3">Verify Your Number</h2>
                        <p className="text-sm text-gray-600 mb-4">We sent a 6-digit code to your phone</p>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-center text-lg tracking-widest"
                            placeholder="______"
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                        />
                        <button
                            className="w-full py-2 bg-black text-white rounded font-semibold mb-3"
                            onClick={handleConfirmOtp}
                        >
                            Confirm OTP
                        </button>
                        <button
                            onClick={() => setShowOtpModal(false)}
                            className="text-gray-500 text-sm hover:underline"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex justify-center items-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowPasswordModal(false)} />
                    <div className="relative bg-white p-6 rounded-sm w-80 shadow-xl text-center animate-fadeIn">
                        <h2 className="text-lg font-bold mb-4">Create Password</h2>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
                        />
                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded mb-5"
                        />
                        <button
                            className="w-full py-2 bg-black text-white rounded font-semibold mb-3"
                            onClick={handleCreateAccount}
                        >
                            Confirm
                        </button>
                        <button
                            onClick={() => setShowPasswordModal(false)}
                            className="text-gray-500 text-sm hover:underline"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
