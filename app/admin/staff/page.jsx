"use client";

import { useState } from "react";

export default function AdminStaff() {
    const [staffs, setStaffs] = useState([
        {
            id: 1,
            name: "Kimhab",
            position: "Seller",
            date: "16 Oct 2024",
            active: true,
        },
        {
            id: 2,
            name: "Anna Smith",
            position: "Supervisor",
            date: "23 Dec 2023",
            active: false,
        },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: "",
        position: "",
        date: "",
    });

    // Toggle active / inactive
    const toggleStatus = (id) => {
        setStaffs((prev) =>
            prev.map((staff) =>
                staff.id === id ? { ...staff, active: !staff.active } : staff
            )
        );
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

    // Delete staff
    const deleteStaff = (id) => {
        if (confirm("Are you sure you want to delete this staff?")) {
            setStaffs((prev) => prev.filter((staff) => staff.id !== id));
        }
    };

    // Add staff
    const addStaff = () => {
        if (!form.name || !form.position || !form.date) {
            alert("Please fill all fields");
            return;
        }

        setStaffs((prev) => [
            ...prev,
            {
                id: Date.now(),
                name: form.name,
                position: form.position,
                date: formatDate(form.date),
                active: true,
            },
        ]);

        setForm({ name: "", position: "", date: "" });
        setShowForm(false);
    };

    return (
        <div className="p-2 space-y-6">
            {/* Header */}
            <div className=" mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        Manage Categories
                    </h1>
                    <p className="text-gray-500">
                        Activate, Deactivate ,Add ,Remove Staffs here
                    </p>
                </div>
            </div>
            <div>
                <button
                    onClick={() => setShowForm(true)}
                    className="py-2 px-6 rounded bg-[#2E2E2E] text-white hover:bg-[#4A4A4A]"
                >
                    + Add Staff
                </button>
            </div>

            {/* Add Staff Form */}
            {showForm && (
                <div className="bg-white p-4 rounded shadow mb-6">
                    <h2 className="font-semibold mb-3">Add New Staff</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Name"
                            className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Position"
                            className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                            value={form.position}
                            onChange={(e) =>
                                setForm({ ...form, position: e.target.value })
                            }
                        />
                        <input
                            type="date"
                            placeholder="Start date"
                            className="rounded border-gray-500 border px-3 py-2 w-full focus:outline-none focus:border-black"
                            value={form.date}
                            onChange={(e) =>
                                setForm({ ...form, date: e.target.value })
                            }
                        />
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={addStaff}
                            className="py-2 px-6 rounded bg-[#2E2E2E] text-white hover:bg-[#4A4A4A]"
                        >
                            Save
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
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-sm text-left">Name</th>
                            <th className="px-4 py-3 text-sm text-left">Position</th>
                            <th className="px-4 py-3 text-sm text-left">Start Date</th>
                            <th className="px-4 py-3 text-sm text-left">Status</th>
                            <th className="px-4 py-3 text-sm text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {staffs.map((staff) => (
                            <tr key={staff.id} className="border-t">
                                <td className="px-4 py-3">{staff.name}</td>
                                <td className="px-4 py-3">{staff.position}</td>
                                <td className="px-4 py-3">{staff.date}</td>

                                <td className="px-4 py-3">
                                    {staff.active ? (
                                        <span className=" px-2 py-1 rounded bg-green-100 text-green-700">
                                            Active
                                        </span>
                                    ) : (
                                        <span className=" px-2 py-1 rounded bg-red-100 text-red-700">
                                            Inactive
                                        </span>
                                    )}
                                </td>

                                <td className="px-4 py-3 text-right space-x-2">
                                    <button
                                        onClick={() => toggleStatus(staff.id)}
                                        className={`py-2 px-4 rounded ${
                                            staff.active
                                                ? "bg-gray-300 "
                                                : "bg-[#2E2E2E] text-white"
                                        }`}
                                    >
                                        {staff.active
                                            ? "Deactivate"
                                            : "Activate"}
                                    </button>

                                    <button
                                        onClick={() => deleteStaff(staff.id)}
                                        className="py-2 px-6 rounded bg-red-800 text-white"
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
                                    No staff found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
