"use client";

import { useEffect, useState } from "react";
import OverviewChart from "./OverviewChart"; // Your chart component
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth";


export default function AdminDashboard() {
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();

        if (!auth) {
            router.replace("/profile");
            return;
        }

        if (auth.user.role !== "admin") {
            router.replace("/");
        }
    }, [router]);

    const periods = ["Today", "This Week", "This Month", "This Year"];
    const [period, setPeriod] = useState("Today");

    // Stats
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalStaff, setTotalStaff] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);

    // Chart data
    const [rawOrdersData, setRawOrdersData] = useState([]); // {date,value}
    const [rawIncomeData, setRawIncomeData] = useState([]);
    const [ordersData, setOrdersData] = useState([]);
    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filter data by period
    const filterDataByPeriod = (data, period) => {
        const now = new Date();
        return data.filter((d) => {
            const date = new Date(d.date);
            switch (period) {
                case "Today":
                    return (
                        date.getDate() === now.getDate() &&
                        date.getMonth() === now.getMonth() &&
                        date.getFullYear() === now.getFullYear()
                    );
                case "This Week":
                    const firstDayOfWeek = new Date(
                        now.setDate(now.getDate() - now.getDay())
                    );
                    const lastDayOfWeek = new Date(firstDayOfWeek);
                    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
                    return date >= firstDayOfWeek && date <= lastDayOfWeek;
                case "This Month":
                    return (
                        date.getMonth() === now.getMonth() &&
                        date.getFullYear() === now.getFullYear()
                    );
                case "This Year":
                    return date.getFullYear() === now.getFullYear();
                default:
                    return true;
            }
        });
    };

    //Chart

    const aggregateData = (data, period) => {
        const aggregated = {};

        data.forEach((d) => {
            const date = new Date(d.date);
            let key = "";

            switch (period) {
                case "Today":
                    key = date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                    break;
                case "This Week":
                    key = date.toLocaleDateString("en-US", {
                        weekday: "short",
                    }); // Mon, Tue...
                    break;
                case "This Month":
                    key = `Week ${Math.ceil(date.getDate() / 7)}`;
                    break;
                case "This Year":
                    key = date.toLocaleDateString("en-US", { month: "short" }); // Jan, Feb...
                    break;
                case "Multi-Year":
                    key = date.getFullYear();
                    break;
                default:
                    key = d.date;
            }

            if (!aggregated[key]) aggregated[key] = 0;
            aggregated[key] += d.value;
        });

        // Convert to array, round values for Orders
        return Object.entries(aggregated).map(([key, value]) => ({
            date: key,
            value:
                period === "This Week" ||
                period === "This Month" ||
                period === "Multi-Year"
                    ? Math.round(value)
                    : value, // Orders integer
        }));
    };

    // Load stats from API
    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch("/api/admin/stats");
                const data = await res.json();

                if (!data.success) {
                    throw new Error(data.message || "Failed to load stats");
                }

                setTotalOrders(data.totalOrders || 0);
                setTotalIncome(data.totalIncome || 0);
                setTotalStaff(data.totalStaff || 0);
                setTotalProducts(data.totalProducts || 0);

                // Normalize chart data to {date, value}
                setRawOrdersData(
                    (data.ordersChart || []).map((d) => ({
                        date: d.date,
                        value: d.orders,
                    }))
                );
                setRawIncomeData(
                    (data.incomeChart || []).map((d) => ({
                        date: d.date,
                        value: d.income,
                    }))
                );
            } catch (err) {
                console.error(err);
                setError(err.message || "Failed to load stats");
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    // Update chart data when period or raw data changes
    useEffect(() => {
        const filteredOrders = filterDataByPeriod(rawOrdersData, period);
        const filteredIncome = filterDataByPeriod(rawIncomeData, period);

        setOrdersData(aggregateData(filteredOrders, period));
        setIncomeData(aggregateData(filteredIncome, period));
    }, [period, rawOrdersData, rawIncomeData]);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                <p className="text-gray-600">
                    Track your business performance and key metrics
                </p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Period Selector */}
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">Time Period</label>
                <div className="flex flex-wrap gap-2">
                    {periods.map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                period === p
                                    ? "bg-[#2E2E2E] text-white shadow-sm"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Total Staff</p>
                            <p className="text-3xl font-bold text-gray-900">{totalStaff}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
                            <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
                            <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Total Income</p>
                            <p className="text-3xl font-bold text-gray-900">${totalIncome.toFixed(2)}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            {loading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <svg className="animate-spin h-8 w-8 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500">Loading charts...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <OverviewChart data={ordersData} title="Total Orders" color="#2E2E2E" />
                    <OverviewChart
                        data={incomeData}
                        title="Total Income"
                        color="#10b981"
                    />
                </div>
            )}
        </div>
    );
}
