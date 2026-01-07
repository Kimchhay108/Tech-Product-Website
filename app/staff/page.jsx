"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth";
import {
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiDollarSign,
    FiEye,
    FiCheck,
    FiX,
    FiChevronRight,
    FiInbox,
} from "react-icons/fi";

export default function StaffDashboard() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [stats, setStats] = useState({
        pendingOrders: 0,
        approvedOrders: 0,
        rejectedOrders: 0,
        totalRevenue: 0,
    });
    const [filter, setFilter] = useState("pending");
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        if (!auth || auth.user.role !== "staff") {
            router.replace("/profile");
            return;
        }

        fetchOrders();
    }, [router]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/orders");
            const data = await response.json();

            if (data.success && data.orders) {
                setOrders(data.orders);
                calculateStats(data.orders);
                filterOrdersByStatus(data.orders, "pending");
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (allOrders) => {
        const pending = allOrders.filter((o) => o.status === "pending").length;
        const approved = allOrders.filter(
            (o) => o.status === "approved"
        ).length;
        const rejected = allOrders.filter(
            (o) => o.status === "rejected"
        ).length;
        const revenue = allOrders
            .filter((o) => o.status === "approved")
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        setStats({
            pendingOrders: pending,
            approvedOrders: approved,
            rejectedOrders: rejected,
            totalRevenue: revenue,
        });
    };

    const filterOrdersByStatus = (allOrders, status) => {
        const filtered = allOrders.filter((o) => o.status === status);
        setFilteredOrders(filtered);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        filterOrdersByStatus(orders, newFilter);
    };

    const handleApproveOrder = async (orderId) => {
        setActionLoading(true);
        try {
            const response = await fetch("/api/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status: "approved" }),
            });

            if (response.ok) {
                setOrders(
                    orders.map((o) =>
                        o._id === orderId ? { ...o, status: "approved" } : o
                    )
                );
                calculateStats(
                    orders.map((o) =>
                        o._id === orderId ? { ...o, status: "approved" } : o
                    )
                );
                filterOrdersByStatus(
                    orders.map((o) =>
                        o._id === orderId ? { ...o, status: "approved" } : o
                    ),
                    filter
                );
                setSelectedOrder(null);
                alert("Order approved successfully!");
            }
        } catch (error) {
            console.error("Failed to approve order:", error);
            alert("Failed to approve order");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectOrder = async (orderId, reason = "") => {
        setActionLoading(true);
        try {
            const response = await fetch("/api/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId,
                    status: "rejected",
                    rejectionReason: reason,
                }),
            });

            if (response.ok) {
                setOrders(
                    orders.map((o) =>
                        o._id === orderId
                            ? {
                                  ...o,
                                  status: "rejected",
                                  rejectionReason: reason,
                              }
                            : o
                    )
                );
                calculateStats(
                    orders.map((o) =>
                        o._id === orderId ? { ...o, status: "rejected" } : o
                    )
                );
                filterOrdersByStatus(
                    orders.map((o) =>
                        o._id === orderId ? { ...o, status: "rejected" } : o
                    ),
                    filter
                );
                setSelectedOrder(null);
                alert("Order rejected successfully!");
            }
        } catch (error) {
            console.error("Failed to reject order:", error);
            alert("Failed to reject order");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div>
                <div className="px-6 py-6">
                    <h1 className="text-4xl font-bold">Staff Dashboard</h1>
                    <p className=" mt-2 text-lg">
                        Process and manage customer orders
                    </p>
                </div>
            </div>

            <div className="px-6 py-6 space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Pending Orders Card */}
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-gray-600 text-sm font-medium">
                                    Pending Orders
                                </p>
                                <p className="text-4xl font-bold text-gray-900 mt-2">
                                    {stats.pendingOrders}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Awaiting review
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-4">
                                <FiClock className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                    </div>

                    {/* Approved Orders Card */}
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-gray-600 text-sm font-medium">
                                    Approved Orders
                                </p>
                                <p className="text-4xl font-bold text-emerald-600 mt-2">
                                    {stats.approvedOrders}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Successfully processed
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl p-4">
                                <FiCheckCircle className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    {/* Rejected Orders Card */}
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-gray-600 text-sm font-medium">
                                    Rejected Orders
                                </p>
                                <p className="text-4xl font-bold text-red-600 mt-2">
                                    {stats.rejectedOrders}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Declined orders
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-4">
                                <FiXCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    {/* Revenue Card */}
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-gray-600 text-sm font-medium">
                                    Revenue
                                </p>
                                <p className="text-4xl font-bold text-[#2E2E2E] mt-2">
                                    ${stats.totalRevenue.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Approved orders
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-[#2E2E2E] to-gray-700 rounded-xl p-4">
                                <FiDollarSign className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Filter Buttons */}
                    <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                        <div className="flex flex-wrap gap-2">
                            {[
                                {
                                    key: "pending",
                                    label: "Pending",
                                    color: "bg-amber-50 text-amber-700 border-amber-200",
                                },
                                {
                                    key: "approved",
                                    label: "Approved",
                                    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
                                },
                                {
                                    key: "rejected",
                                    label: "Rejected",
                                    color: "bg-red-50 text-red-700 border-red-200",
                                },
                            ].map(({ key, label, color }) => (
                                <button
                                    key={key}
                                    onClick={() => handleFilterChange(key)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                        filter === key
                                            ? `${color} border`
                                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-16">
                                <div className="inline-block">
                                    <div className="w-10 h-10 border-4 border-gray-200 border-t-[#2E2E2E] rounded-full animate-spin"></div>
                                </div>
                                <p className="text-gray-500 mt-4 font-medium">
                                    Loading orders...
                                </p>
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-4xl mb-2 flex justify-center items-center">
                                    <FiInbox />
                                </div>
                                <p className="text-gray-500 font-medium">
                                    No {filter} orders found
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Orders will appear here when available
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredOrders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="border border-gray-200 rounded-lg hover:shadow-md transition-all p-4 bg-gradient-to-r from-white to-gray-50/50"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-[#2E2E2E] flex-shrink-0"></div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        Order #
                                                        {order._id
                                                            ?.slice(-8)
                                                            .toUpperCase()}
                                                    </h3>
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                                                            order.status ===
                                                            "pending"
                                                                ? "bg-amber-100 text-amber-700"
                                                                : order.status ===
                                                                  "approved"
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                    >
                                                        {order.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            order.status.slice(
                                                                1
                                                            )}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-2">
                                                    {order.items?.length || 0}{" "}
                                                    items • $
                                                    {order.totalAmount?.toLocaleString()}{" "}
                                                    •{" "}
                                                    {new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString()}
                                                </p>
                                                {order.shippingAddress
                                                    ?.fullName && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        <span className="font-medium">
                                                            Customer:
                                                        </span>{" "}
                                                        {
                                                            order
                                                                .shippingAddress
                                                                .fullName
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex gap-2 flex-wrap md:flex-nowrap">
                                                <button
                                                    onClick={() =>
                                                        setSelectedOrder(order)
                                                    }
                                                    className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
                                                >
                                                    <FiEye size={16} />
                                                    <span>Details</span>
                                                </button>

                                                {order.status === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleApproveOrder(
                                                                    order._id
                                                                )
                                                            }
                                                            disabled={
                                                                actionLoading
                                                            }
                                                            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <FiCheck
                                                                size={16}
                                                            />
                                                            <span>
                                                                {actionLoading
                                                                    ? "..."
                                                                    : "Approve"}
                                                            </span>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const reason =
                                                                    prompt(
                                                                        "Enter rejection reason:"
                                                                    );
                                                                if (reason)
                                                                    handleRejectOrder(
                                                                        order._id,
                                                                        reason
                                                                    );
                                                            }}
                                                            disabled={
                                                                actionLoading
                                                            }
                                                            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <FiX size={16} />
                                                            <span>
                                                                {actionLoading
                                                                    ? "..."
                                                                    : "Reject"}
                                                            </span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {order.status === "rejected" &&
                                            order.rejectionReason && (
                                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                                    <strong className="block mb-1">
                                                        Rejection Reason:
                                                    </strong>
                                                    <p>
                                                        {order.rejectionReason}
                                                    </p>
                                                </div>
                                            )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200">
                            <div className="sticky top-0 bg-gradient-to-r from-[#2E2E2E] to-[#1a1a1a] text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                                <h2 className="text-xl font-bold">
                                    Order #
                                    {selectedOrder._id?.slice(-8).toUpperCase()}
                                </h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-300 hover:text-white text-xl font-semibold transition"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Order Info */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-[#2E2E2E] rounded-full"></div>
                                        Order Information
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                        <div>
                                            <p className="text-gray-600 text-sm">
                                                Order Date
                                            </p>
                                            <p className="font-semibold text-gray-900 mt-1">
                                                {new Date(
                                                    selectedOrder.createdAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm">
                                                Status
                                            </p>
                                            <span
                                                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                                    selectedOrder.status ===
                                                    "pending"
                                                        ? "bg-amber-100 text-amber-700"
                                                        : selectedOrder.status ===
                                                          "approved"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {selectedOrder.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    selectedOrder.status.slice(
                                                        1
                                                    )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-[#2E2E2E] rounded-full"></div>
                                        Order Items
                                    </h3>
                                    <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                                        {selectedOrder.items?.map(
                                            (item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                                                >
                                                    <div>
                                                        <p className="text-gray-900 font-medium">
                                                            {item.name ||
                                                                "Item"}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <span className="font-semibold text-gray-900">
                                                        $
                                                        {(
                                                            item.price *
                                                            item.quantity
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Shipping */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-[#2E2E2E] rounded-full"></div>
                                        Shipping Address
                                    </h3>
                                    {selectedOrder.shippingAddress ? (
                                        <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg space-y-2">
                                            <p className="font-semibold text-gray-900">
                                                {selectedOrder.shippingAddress
                                                    .fullName ||
                                                    "Name not provided"}
                                            </p>
                                            <p className="text-gray-600">
                                                {selectedOrder.shippingAddress
                                                    .phone ||
                                                    "Phone not provided"}
                                            </p>
                                            <p className="text-gray-600">
                                                {selectedOrder.shippingAddress
                                                    .address ||
                                                    "Address not provided"}
                                            </p>
                                            <p className="text-gray-600">
                                                {[
                                                    selectedOrder
                                                        .shippingAddress.city,
                                                    selectedOrder
                                                        .shippingAddress
                                                        .country,
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ") ||
                                                    "City/Country not provided"}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                                            Not provided
                                        </p>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="border-t pt-4 bg-gradient-to-r from-[#2E2E2E]/5 to-gray-100/50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900 text-lg">
                                            Total Amount
                                        </span>
                                        <span className="text-3xl font-bold text-[#2E2E2E]">
                                            $
                                            {selectedOrder.totalAmount?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
