"use client";

import { useState, useEffect } from "react";
import { getAuth } from "@/lib/auth";

export default function AdminStaff() {
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

        if (form.password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        setFormLoading(true);
        try {
            const auth = getAuth();
            console.log("📝 Staff creation request data:", { 
                uid: auth.user.uid, 
                role: auth.user.role 
            });
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
                console.log("❌ Staff creation failed:", data);
                alert("Error: " + data.error + "\nDebug: " + JSON.stringify(data.debug));
            }
        } catch (err) {
            alert("Failed to create staff account");
            console.error(err);
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
        if (!confirm("Are you sure you want to delete this staff?")) return;

        try {
            const auth = getAuth();
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
                alert("Staff deleted successfully!");
                fetchStaff(); // Refresh list
            } else {
                alert("Error: " + data.error);
            }
        } catch (err) {
            alert("Failed to delete staff");
            console.error(err);
        }
    };

    return (
        <div className="p-2 space-y-6">
            {/* Header */}
            <div className="mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Manage Staff</h1>
                    <p className="text-gray-500">
                        Create, activate, deactivate, and remove staff accounts
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div>
                <button
                    onClick={() => setShowForm(true)}
                    className="py-2 px-6 rounded bg-[#2E2E2E] text-white hover:bg-[#4A4A4A]"
                >
                    + Create Staff Account
                </button>
            </div>

            {/* Add Staff Form */}
            {showForm && (
                <div className="bg-white p-4 rounded shadow mb-6">
                    <h2 className="font-semibold mb-4 text-lg">Create New Staff Account</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="First Name *"
                            className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                            value={form.firstName}
                            onChange={(e) =>
                                setForm({ ...form, firstName: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Last Name *"
                            className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                            value={form.lastName}
                            onChange={(e) =>
                                setForm({ ...form, lastName: e.target.value })
                            }
                        />
                        <input
                            type="email"
                            placeholder="Email *"
                            className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />
                        <input
                            type="password"
                            placeholder="Password (min 6 chars) *"
                            className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Position (Manager, Cashier, etc) *"
                            className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                            value={form.position}
                            onChange={(e) =>
                                setForm({ ...form, position: e.target.value })
                            }
                        />
                        <input
                            type="date"
                            placeholder="Date of Birth"
                            className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                            value={form.dateOfBirth}
                            onChange={(e) =>
                                setForm({ ...form, dateOfBirth: e.target.value })
                            }
                        />
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={handleAddStaff}
                            disabled={formLoading}
                            className="py-2 px-6 rounded bg-[#2E2E2E] text-white hover:bg-[#4A4A4A] disabled:bg-gray-400"
                        >
                            {formLoading ? "Creating..." : "Create Account"}
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Staff Table */}
            <div className="bg-white rounded shadow overflow-hidden">
                {loading ? (
                    <div className="px-4 py-6 text-center text-gray-500">
                        Loading staff...
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-sm text-left">Name</th>
                                <th className="px-4 py-3 text-sm text-left">Email</th>
                                <th className="px-4 py-3 text-sm text-left">Position</th>
                                <th className="px-4 py-3 text-sm text-left">Status</th>
                                <th className="px-4 py-3 text-sm text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {staffs.map((staff) => (
                                <tr key={staff.uid} className="border-t">
                                    <td className="px-4 py-3">
                                        {staff.firstName} {staff.lastName}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {staff.email}
                                    </td>
                                    <td className="px-4 py-3">{staff.position}</td>

                                    <td className="px-4 py-3">
                                        {staff.active ? (
                                            <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded bg-red-100 text-red-700">
                                                Inactive
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button
                                            onClick={() =>
                                                toggleStatus(staff.uid, staff.active)
                                            }
                                            className={`py-1 px-3 rounded text-sm ${
                                                staff.active
                                                    ? "bg-gray-300 hover:bg-gray-400"
                                                    : "bg-[#2E2E2E] text-white hover:bg-[#4A4A4A]"
                                            }`}
                                        >
                                            {staff.active
                                                ? "Deactivate"
                                                : "Activate"}
                                        </button>

                                        <button
                                            onClick={() => deleteStaff(staff.uid)}
                                            className="py-1 px-3 rounded text-sm bg-red-800 text-white hover:bg-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {staffs.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-6 text-gray-400"
                                    >
                                        No staff found. Create your first staff account above.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
