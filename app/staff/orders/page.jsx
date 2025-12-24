"use client";

import { useState } from "react";

export default function StaffOrders() {
    // Sample orders
    const [orders, setOrders] = useState([
        {
            id: 1,
            customer: "Kimhab",
            product: "Product A",
            quantity: 2,
            total: 50,
            status: "Pending",
            date: "2025-12-23",
        },
        {
            id: 2,
            customer: "Anna Smith",
            product: "Product B",
            quantity: 1,
            total: 30,
            status: "Pending",
            date: "2025-12-22",
        },
    ]);

    // Approve order
    const approveOrder = (id) => {
        setOrders((prev) =>
            prev.map((o) => (o.id === id ? { ...o, status: "Approved" } : o))
        );
    };

    // Reject order
    const rejectOrder = (id) => {
        setOrders((prev) =>
            prev.map((o) => (o.id === id ? { ...o, status: "Rejected" } : o))
        );
    };

    return (
        <div className="p-2 space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Pending Orders</h1>
                <p className="text-gray-500">Approve or Reject orders here</p>
            </div>

            <div className="bg-white shadow rounded overflow-x-auto">
                <table className="w-full ">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-sm text-left">Customer</th>
                            <th className="px-4 py-3 text-sm text-left">Product</th>
                            <th className="px-4 py-3 text-sm text-left">Quantity</th>
                            <th className="px-4 py-3 text-sm text-left">Total ($)</th>
                            <th className="px-4 py-3 text-sm text-left">Date</th>
                            <th className="px-4 py-3 text-sm text-left">Status</th>
                            <th className="px-4 py-3 text-sm text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-t">
                                <td className="px-4 py-3">{order.customer}</td>
                                <td className="px-4 py-3">{order.product}</td>
                                <td className="px-4 py-3">{order.quantity}</td>
                                <td className="px-4 py-3">{order.total}</td>
                                <td className="px-4 py-3">{order.date}</td>
                                <td className="px-4 py-4">
                                    {order.status === "Pending" && (
                                        <span className="text-sm px-3 py-2 rounded bg-yellow-100 text-yellow-700">
                                            {order.status}
                                        </span>
                                    )}
                                    {order.status === "Approved" && (
                                        <span className="text-sm px-3 py-2 rounded bg-green-100 text-green-700">
                                            {order.status}
                                        </span>
                                    )}
                                    {order.status === "Rejected" && (
                                        <span className="text-sm px-3 py-2 rounded bg-red-100 text-red-700">
                                            {order.status}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    {order.status === "Pending" && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    approveOrder(order.id)
                                                }
                                                className="px-4 py-2 rounded-md bg-[#2E2E2E] hover:bg-[#4A4A4A] text-white"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() =>
                                                    rejectOrder(order.id)
                                                }
                                                className="py-2 px-6 rounded-md bg-red-800 text-white"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}

                        {orders.length === 0 && (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-6 text-gray-400"
                                >
                                    No orders found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
