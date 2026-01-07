"use client";

import {
    FiChevronRight,
    FiUser,
    FiShield,
    FiShoppingBag,
    FiLogOut,
} from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { getAuth, logout, login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { auth as firebaseAuth } from "@/lib/firebaseConfig";
import {
    updateEmail,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    onAuthStateChanged,
} from "firebase/auth";

export default function UserProfile() {
    const [selectedFeature, setSelectedFeature] = useState("profile");
    const [auth, setAuth] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState("");
    
    // Edit mode states
    const [isEditMode, setIsEditMode] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [updateError, setUpdateError] = useState("");
    const [updateSuccess, setUpdateSuccess] = useState("");

    const router = useRouter();

    useEffect(() => {
        const loadAuth = () => {
            const authData = getAuth();
            setAuth(authData);
            setIsLoading(false);

            if (!authData?.user) {
                router.replace("/profile");
                return;
            }

            // Load edit form fields from auth (prioritize localStorage over Firebase)
            setFirstName(authData.user.firstName || "");
            setLastName(authData.user.lastName || "");
            setEmail(authData.user.email || firebaseAuth.currentUser?.email || "");
            setGender(authData.user.gender || "");
            setDateOfBirth(authData.user.dateOfBirth || "");
            setUpdateError("");
            setUpdateSuccess("");
        };

        loadAuth();

        // React when Firebase auth state changes
        const unsubscribeAuth = onAuthStateChanged(firebaseAuth, () => {
            loadAuth();
        });

        // Listen for storage changes
        const handleStorageChange = () => {
            loadAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('cart-reload', handleStorageChange);

        return () => {
            unsubscribeAuth();
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('cart-reload', handleStorageChange);
        };
    }, [router]);

    useEffect(() => {
        const shouldFetch = selectedFeature === "myOrder" && auth?.user?.uid;
        if (!shouldFetch) return;

        const fetchOrders = async () => {
            setOrdersLoading(true);
            setOrdersError("");
            try {
                const res = await fetch(`/api/orders?userId=${auth.user.uid}`);
                const data = await res.json();
                if (!data.success) {
                    setOrdersError(data.message || "Failed to load orders");
                    setOrders([]);
                } else {
                    setOrders(data.orders || []);
                }
            } catch (error) {
                setOrdersError("Failed to load orders");
                setOrders([]);
            } finally {
                setOrdersLoading(false);
            }
        };

        fetchOrders();
    }, [selectedFeature, auth]);

    const handleLogout = () => {
        logout();
        window.dispatchEvent(new Event("cart-reload"));
        window.dispatchEvent(new Event("storage"));
        router.replace("/profile");
    };

    const handleEditClick = () => {
        setIsEditMode(true);
        // Reset password fields when entering edit mode
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        // Restore original values
        const authData = getAuth();
        const fbEmail = firebaseAuth.currentUser?.email;
        setFirstName(authData?.user?.firstName || "");
        setLastName(authData?.user?.lastName || "");
        setEmail(fbEmail || authData?.user?.email || "");
        setGender(authData?.user?.gender || "");
        setDateOfBirth(authData?.user?.dateOfBirth || "");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setUpdateError("");
        setUpdateSuccess("");
    };

    const handleSaveProfile = async () => {
        if (!firstName || !lastName || !gender) {
            setUpdateError("First name, last name, and gender are required");
            return;
        }

        setEditLoading(true);
        setUpdateError("");
        setUpdateSuccess("");

        try {
            const user = firebaseAuth.currentUser;
            
            // Check if email changed
            if (email !== auth.user.email) {
                if (!currentPassword) {
                    setUpdateError("Current password is required to change email");
                    setEditLoading(false);
                    return;
                }

                const credential = EmailAuthProvider.credential(auth.user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
                await updateEmail(user, email);
                console.log("✅ Email updated in Firebase");
            }

            // Check if password change requested
            if (newPassword) {
                if (!currentPassword) {
                    setUpdateError("Current password is required to change password");
                    setEditLoading(false);
                    return;
                }

                if (newPassword !== confirmPassword) {
                    setUpdateError("New passwords don't match");
                    setEditLoading(false);
                    return;
                }

                if (newPassword.length < 6) {
                    setUpdateError("Password must be at least 6 characters");
                    setEditLoading(false);
                    return;
                }

                const credential = EmailAuthProvider.credential(auth.user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
                console.log("✅ Password updated in Firebase");
            }

            // Update user info in Firestore
            const response = await fetch("/api/save-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uid: auth.user.uid,
                    phone: auth.user.phone || "",
                    firstName,
                    lastName,
                    gender: gender,
                    email,
                    dateOfBirth,
                    password: newPassword || auth.user.password,
                    role: auth.user.role,
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                // Update localStorage
                const updatedUser = {
                    ...auth.user,
                    firstName,
                    lastName,
                    fullName: `${firstName} ${lastName}`,
                    email,
                    gender,
                    dateOfBirth,
                };
                login(updatedUser);
                setAuth({ ...auth, user: updatedUser });

                setUpdateSuccess("Profile updated successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setTimeout(() => setUpdateSuccess(""), 3000);
            } else {
                setUpdateError("Failed to update profile: " + data.message);
            }
        } catch (error) {
            console.error("Update error:", error);
            setUpdateError("Failed to update profile: " + error.message);
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <section className="min-h-screen container mx-auto px-3 sm:px-4">
            <div className="w-full my-2 flex flex-col md:flex-row gap-4 md:gap-6 p-3">
                {/* Left Sidebar */}
                <div className="w-full md:w-1/4 h-full flex flex-col border border-gray-100 rounded-lg p-3 md:p-0 md:border-0">
                    {/* Sidebar Header */}
                    <h1 className="text-lg mb-3 font-semibold">Me</h1>

                    {/* Menu Items */}
                    <ul className="flex-1 md:ml-4 flex md:flex-col gap-2 md:gap-0 md:space-y-2 mb-2 overflow-x-auto md:overflow-visible">
                        <li
                            onClick={() => setSelectedFeature("profile")}
                            className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer whitespace-nowrap ${
                                selectedFeature === "profile"
                                    ? "font-semibold"
                                    : "hover:bg-[#f9f9f9]"
                            }`}
                        >
                            Profile
                            <FiChevronRight
                                className={`transition-all ${
                                    selectedFeature === "profile"
                                        ? "font-bold text-xl"
                                        : "text-[#2F5755]"
                                }`}
                            />
                        </li>
                        <li
                            onClick={() => setSelectedFeature("myOrder")}
                            className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer whitespace-nowrap ${
                                selectedFeature === "myOrder"
                                    ? "font-semibold"
                                    : "hover:bg-[#f9f9f9]"
                            }`}
                        >
                            My Orders
                            <FiChevronRight
                                className={`transition-all ${
                                    selectedFeature === "myOrder"
                                        ? "font-bold text-xl"
                                        : "text-[#2F5755]"
                                }`}
                            />
                        </li>
                    </ul>

                    {/* Logout Button at Bottom */}
                    <div className="mt-auto pt-2 border-t">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 md:px-2 py-1 rounded hover:text-red-600 font-medium transition-colors cursor-pointer whitespace-nowrap"
                        >
                            <FiLogOut size={15}/>
                            <span>Log out</span>
                        </button>
                    </div>
                </div>

                {/* Right content (My Profile)*/}
                {selectedFeature === "profile" && (
                    <div className="w-full">
                        <div className="flex justify-center items-center mb-5">
                            <p className="text-xl text-center font-medium flex items-center gap-2 ">
                                Profile <FiUser size={25} />
                            </p>
                        </div>

                        <div className="md:w-1/2 mx-auto mb-5">
                            <div className="w-full">
                                {/* Success Message */}
                                {updateSuccess && (
                                    <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                                        {updateSuccess}
                                    </div>
                                )}

                                {/* Error Message */}
                                {updateError && (
                                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                                        {updateError}
                                    </div>
                                )}

                                {/* Gender */}
                                <div className="flex items-center gap-5 mb-3">
                                    <p className="font-medium">
                                        Gender (Required)
                                    </p>
                                    <label className="flex items-center gap-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            checked={gender === "male"}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="accent-black"
                                        />
                                        Male
                                    </label>

                                    <label className="flex items-center gap-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            checked={gender === "female"}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="accent-black"
                                        />
                                        Female
                                    </label>
                                </div>
                                
                                {/* Name */}
                                <div className=" flex flex-col md:flex-row gap-4 mb-2">
                                    <div className="w-full">
                                        <label className="block mb-1 font-medium">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full px-2 py-2 border border-[#A0A0A0] rounded focus:outline-none focus:border-black hover:border-black"
                                            placeholder="Enter first name"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="block mb-1 font-medium">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full px-2 py-2 border border-[#A0A0A0] rounded focus:outline-none focus:border-black hover:border-black"
                                            placeholder="Enter Last name"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="mb-2">
                                    <label className="block mb-1 font-medium">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#A0A0A0] rounded focus:outline-none focus:border-black hover:border-black"
                                        placeholder="Enter your email"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Changing email requires current password</p>
                                </div>

                                {/* Date of birth */}
                                <div className="mb-5">
                                    <label className="block mb-1 font-medium">
                                        Date of birth
                                    </label>
                                    <input
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#A0A0A0] rounded focus:outline-none focus:border-black hover:border-black"
                                        placeholder="Enter your Date of birth"
                                    />
                                </div>

                                {/* Update profile btn */}
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={editLoading}
                                    className="w-full py-2 bg-black text-white rounded font-semibold mb-4 cursor-pointer disabled:bg-gray-400"
                                >
                                    {editLoading ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center items-center mb-5">
                            <p className="text-lg text-center font-medium flex items-center gap-2 ">
                                Change Password <FiShield size={20} />
                            </p>
                        </div>

                        <div className="md:w-1/2 mx-auto">
                            <div className="w-full">
                                {/* Old Password */}
                                <div className="mb-2">
                                    <label className="block mb-1 font-medium">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#A0A0A0] rounded focus:outline-none focus:border-black hover:border-black"
                                        placeholder="Enter your current password"
                                    />
                                </div>

                                {/* New Password */}
                                <div className="mb-2">
                                    <label className="block mb-1 font-medium">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#A0A0A0] rounded focus:outline-none focus:border-black hover:border-black"
                                        placeholder="Enter your new password"
                                    />
                                </div>

                                {/* Confirm New Password */}
                                <div className="mb-5">
                                    <label className="block mb-1 font-medium">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#A0A0A0] rounded focus:outline-none focus:border-black hover:border-black"
                                        placeholder="Confirm your new password"
                                    />
                                </div>

                                {/* Confirm Change btn */}
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={editLoading}
                                    className="w-full py-2 bg-black text-white rounded font-semibold mb-4 cursor-pointer disabled:bg-gray-400"
                                >
                                    {editLoading ? "Updating..." : "Confirm Change"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Right content (My Order)*/}
                {selectedFeature === "myOrder" && (
                    <div className="w-full">
                        <div className="flex justify-center items-center mb-5">
                            <p className="text-lg text-center font-medium flex items-center gap-2 ">
                                Order History <FiShoppingBag size={20} />
                            </p>
                        </div>

                        <div className="w-full md:w-3/4 mx-auto">
                            {ordersLoading && (
                                <p className="text-center text-gray-600">Loading orders...</p>
                            )}

                            {!ordersLoading && ordersError && (
                                <p className="text-center text-red-600">{ordersError}</p>
                            )}

                            {!ordersLoading && !ordersError && orders.length === 0 && (
                                <p className="text-center text-gray-600">No orders yet.</p>
                            )}

                            {!ordersLoading && !ordersError && orders.length > 0 && (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order._id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                                                <div className="space-y-1 break-words">
                                                    <p className="text-sm text-gray-500">Order ID</p>
                                                    <p className="font-semibold break-all">{order._id}</p>
                                                </div>
                                                <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                                                    <span className="px-2 py-1 rounded bg-gray-100 capitalize">{order.status}</span>
                                                    <span className="px-2 py-1 rounded bg-gray-100">${order.totalAmount?.toFixed(2) || "0.00"}</span>
                                                    <span className="px-2 py-1 rounded bg-gray-100">{new Date(order.createdAt).toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                {order.items?.map((item, index) => (
                                                    <div key={`${order._id}-${index}`} className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 text-sm border-b pb-2 last:border-b-0">
                                                        <span className="font-medium break-words">{item.name}</span>
                                                        <span className="text-gray-700">x{item.quantity}</span>
                                                        <span className="text-gray-700">${(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
