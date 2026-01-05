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
        <div className="p-4 space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
            )}

            {/* Period Selector */}
            <div className="flex gap-2">
                {periods.map((p) => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-6 py-2 rounded ${
                            period === p
                                ? "bg-[#2E2E2E] text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        {p}
                    </button>
                ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
                <div className="bg-white shadow rounded p-4">
                    <h3 className="text-gray-500 text-sm">Total Staff</h3>
                    <p className="text-2xl font-bold">{totalStaff}</p>
                </div>
                <div className="bg-white shadow rounded p-4">
                    <h3 className="text-gray-500 text-sm">Total Products</h3>
                    <p className="text-2xl font-bold">{totalProducts}</p>
                </div>
                <div className="bg-white shadow rounded p-4">
                    <h3 className="text-gray-500 text-sm">Total Orders</h3>
                    <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
                <div className="bg-white shadow rounded p-4">
                    <h3 className="text-gray-500 text-sm">Total Income</h3>
                    <p className="text-2xl font-bold">${totalIncome}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <OverviewChart data={ordersData} title="Total Orders" />
                <OverviewChart
                    data={incomeData}
                    title="Total Income"
                    color="#3b82f6"
                />
            </div>
        </div>
    );
}
