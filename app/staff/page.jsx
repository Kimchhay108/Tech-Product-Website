'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth";

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
    const approved = allOrders.filter((o) => o.status === "approved").length;
    const rejected = allOrders.filter((o) => o.status === "rejected").length;
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
        body: JSON.stringify({ orderId, status: "rejected", rejectionReason: reason }),
      });

      if (response.ok) {
        setOrders(
          orders.map((o) =>
            o._id === orderId ? { ...o, status: "rejected", rejectionReason: reason } : o
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
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage and process customer orders</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.pendingOrders}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats.approvedOrders}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-green-600"
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
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Rejected</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {stats.rejectedOrders}
                </p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2 2l2 2m-2-2l-2-2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Revenue</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow">
          {/* Filter Buttons */}
          <div className="border-b px-6 py-4">
            <div className="flex gap-3">
              {[
                { key: "pending", label: "Pending", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
                { key: "approved", label: "Approved", color: "bg-green-50 text-green-700 border-green-200" },
                { key: "rejected", label: "Rejected", color: "bg-red-50 text-red-700 border-red-200" },
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => handleFilterChange(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === key
                      ? color
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
              <div className="text-center py-8">
                <p className="text-gray-500">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No {filter} orders found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          Order #{order._id?.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.items?.length || 0} items • Total: ${order.totalAmount?.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                          View Details
                        </button>

                        {order.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApproveOrder(order._id)}
                              disabled={actionLoading}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                            >
                              {actionLoading ? "Processing..." : "Approve"}
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt("Enter rejection reason:");
                                if (reason) handleRejectOrder(order._id, reason);
                              }}
                              disabled={actionLoading}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                              {actionLoading ? "Processing..." : "Reject"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {order.status === "rejected" && order.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        <strong>Rejection Reason:</strong> {order.rejectionReason}
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
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  Order #{selectedOrder._id?.slice(-8).toUpperCase()}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Order Date</p>
                      <p className="font-medium">
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className="font-medium capitalize">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            selectedOrder.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : selectedOrder.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedOrder.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm border-b pb-2">
                        <span className="text-gray-700">{item.name || "Item"}</span>
                        <span className="font-medium">
                          ${(item.price * item.quantity).toLocaleString()} (x{item.quantity})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                  {selectedOrder.shippingAddress ? (
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>{selectedOrder.shippingAddress.fullName || "Name not provided"}</p>
                      <p>{selectedOrder.shippingAddress.phone || "Phone not provided"}</p>
                      <p>{selectedOrder.shippingAddress.address || "Address not provided"}</p>
                      <p>
                        {[
                          selectedOrder.shippingAddress.city,
                          selectedOrder.shippingAddress.country,
                        ].filter(Boolean).join(", ") || "City/Country not provided"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">Not provided</p>
                  )}
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${selectedOrder.totalAmount?.toLocaleString()}
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
