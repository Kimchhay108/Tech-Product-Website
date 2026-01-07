"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth";

export default function AdminStaff() {
    const router = useRouter();
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        position: "",
        dateOfBirth: "",
    });

    // Fetch staff list
    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/staff");
            const data = await res.json();

            if (data.success) {
                setStaffs(data.data);
                setError("");
            } else {
                setError(data.error || "Failed to fetch staff");
            }
        } catch (err) {
            setError("Failed to fetch staff");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Add staff
    const handleAddStaff = async () => {
        // 1️⃣ Validate required fields
        if (
            !form.firstName ||
            !form.lastName ||
            !form.email ||
            !form.password ||
            !form.position
        ) {
            alert("Please fill in all required fields");
            return;
        }

        // 2️⃣ Validate password length
        if (form.password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        setFormLoading(true);

        try {
            const auth = getAuth();

            if (!auth || !auth.user) {
                alert("Not logged in. Please log in again.");
                router.replace("/profile");
                return;
            }

            if (auth.user.role !== "admin") {
                alert("Only admin users can create staff accounts.");
                return;
            }

            const res = await fetch("/api/staff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    adminUid: auth.user.uid,
                    adminRole: auth.user.role,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    password: form.password,
                    position: form.position,
                    dateOfBirth: form.dateOfBirth,
                }),
            });

            const data = await res.json();

            if (data.success) {
                alert("Staff account created successfully!");
                setForm({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    position: "",
                    dateOfBirth: "",
                });
                setShowForm(false);
                fetchStaff(); // Refresh list
            } else {
                alert(
                    "Error: " + (data.error || "Failed to create staff account")
                );
            }
        } catch (err) {
            // Only alert, no console output
            alert(
                "Failed to create staff account: " +
                    (err.message || "Unknown error")
            );
        } finally {
            setFormLoading(false);
        }
    };

    // Toggle active / inactive
    const toggleStatus = async (staffUid, currentActive) => {
        try {
            const auth = getAuth();
            const res = await fetch("/api/staff", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    adminUid: auth.user.uid,
                    adminRole: auth.user.role,
                    staffUid,
                    active: !currentActive,
                }),
            });

            const data = await res.json();
            if (data.success) {
                fetchStaff(); // Refresh list
            } else {
                alert("Error: " + data.error);
            }
        } catch (err) {
            alert("Failed to update staff status");
            console.error(err);
        }
    };

    // Delete staff
    const deleteStaff = async (staffUid) => {
        if (
            !confirm(
                "Are you sure you want to delete this staff account? This will permanently remove them from the system and they will no longer be able to log in."
            )
        )
            return;

        try {
            const auth = getAuth();

            // Validate auth exists
            if (!auth || !auth.user) {
                alert("Not logged in. Please log in again.");
                router.replace("/profile");
                return;
            }

            // Validate admin role
            if (auth.user.role !== "admin") {
                alert("Only admin users can delete staff accounts.");
                return;
            }

            const res = await fetch("/api/staff", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    adminUid: auth.user.uid,
                    adminRole: auth.user.role,
                    staffUid,
                }),
            });

            const data = await res.json();
            if (data.success) {
                alert("Staff account deleted successfully!");
                fetchStaff(); // Refresh list
            } else {
                console.error("❌ Staff deletion failed:", data);
                alert(
                    "Error: " + (data.error || "Failed to delete staff account")
                );
            }
        } catch (err) {
            console.error("❌ Staff deletion exception:", err);
            alert("Failed to delete staff account: " + err.message);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Staff Management
                </h1>
                <p className="text-gray-600">
                    Manage your team members and their access levels
                </p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-red-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Button */}
            {!showForm && (
                <div className="mb-6">
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center px-4 py-2.5 bg-[#2E2E2E] hover:bg-[#4A4A4A] text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        Add New Staff Member
                    </button>
                </div>
            )}

            {/* Add Staff Form */}
            {showForm && (
                <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#2E2E2E] to-[#3E3E3E] px-6 py-4">
                        <h2 className="text-xl font-semibold text-white">
                            Create New Staff Account
                        </h2>
                        <p className="text-gray-300 text-sm mt-1">
                            Fill in the details to add a new team member
                        </p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter first name"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all"
                                    value={form.firstName}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            firstName: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter last name"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all"
                                    value={form.lastName}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            lastName: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="example@company.com"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Minimum 6 characters"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            password: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Position */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Position{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Store Manager, Sales Associate"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all"
                                    value={form.position}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            position: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all"
                                    value={form.dateOfBirth}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            dateOfBirth: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="mt-6 flex gap-3 pt-5 border-t border-gray-200">
                            <button
                                onClick={handleAddStaff}
                                disabled={formLoading}
                                className="inline-flex items-center px-6 py-2.5 bg-[#2E2E2E] hover:bg-[#4A4A4A] text-white font-medium rounded-lg shadow-sm transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {formLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Create Account
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setForm({
                                        firstName: "",
                                        lastName: "",
                                        email: "",
                                        password: "",
                                        position: "",
                                        dateOfBirth: "",
                                    });
                                }}
                                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Staff Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Team Members
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {staffs.length} staff member
                        {staffs.length !== 1 ? "s" : ""} registered
                    </p>
                </div>

                {loading ? (
                    <div className="px-6 py-12 text-center">
                        <svg
                            className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <p className="text-gray-500">Loading team members...</p>
                    </div>
                ) : staffs.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                        <p className="text-gray-900 font-medium mb-1">
                            No staff members yet
                        </p>
                        <p className="text-gray-500 text-sm mb-4">
                            Get started by creating your first staff account
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center px-4 py-2 bg-[#2E2E2E] hover:bg-[#4A4A4A] text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            Add First Staff Member
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Staff Member
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Position
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {staffs.map((staff) => (
                                    <tr
                                        key={staff.uid}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-[#2E2E2E] to-[#3E3E3E] flex items-center justify-center text-white font-semibold">
                                                    {staff.firstName?.[0]}
                                                    {staff.lastName?.[0]}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {staff.firstName}{" "}
                                                        {staff.lastName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">
                                                {staff.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {staff.position}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {staff.active ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <svg
                                                        className="mr-1 h-2 w-2 text-green-500"
                                                        fill="currentColor"
                                                        viewBox="0 0 8 8"
                                                    >
                                                        <circle
                                                            cx="4"
                                                            cy="4"
                                                            r="3"
                                                        />
                                                    </svg>
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    <svg
                                                        className="mr-1 h-2 w-2 text-red-500"
                                                        fill="currentColor"
                                                        viewBox="0 0 8 8"
                                                    >
                                                        <circle
                                                            cx="4"
                                                            cy="4"
                                                            r="3"
                                                        />
                                                    </svg>
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button
                                                onClick={() =>
                                                    toggleStatus(
                                                        staff.uid,
                                                        staff.active
                                                    )
                                                }
                                                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                                    staff.active
                                                        ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                                }`}
                                            >
                                                {staff.active ? (
                                                    <>
                                                        <svg
                                                            className="w-4 h-4 mr-1"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                                            />
                                                        </svg>
                                                        Deactivate
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg
                                                            className="w-4 h-4 mr-1"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                        Activate
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() =>
                                                    deleteStaff(staff.uid)
                                                }
                                                className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors duration-200"
                                            >
                                                <svg
                                                    className="w-4 h-4 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
