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
    const [ordersData, setOrdersData] = useState([]);
    const [incomeData, setIncomeData] = useState([]);

    // Dynamic sample data for last 30 days
    const generateSampleData = () => {
        const today = new Date();
        const data = [];
        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            data.push({
                date: d.toISOString().split("T")[0], // yyyy-mm-dd
                orders: Math.floor(Math.random() * 20) + 5,
                income: Math.floor(Math.random() * 500) + 100,
            });
        }
        return data;
    };

    const sampleData = generateSampleData();

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

    // Update totals and chart data when period changes
    useEffect(() => {
        // 1. Filter data by period
        const filtered = filterDataByPeriod(sampleData, period);

        // 2. Calculate totals
        setTotalOrders(filtered.reduce((sum, d) => sum + d.orders, 0));
        setTotalIncome(filtered.reduce((sum, d) => sum + d.income, 0));

        // 3. Prepare chart data
        const orderChartData = filtered.map((d) => ({
            date: d.date,
            value: d.orders,
        }));
        const incomeChartData = filtered.map((d) => ({
            date: d.date,
            value: d.income,
        }));

        // 4. Aggregate chart data by period
        setOrdersData(aggregateData(orderChartData, period));
        setIncomeData(aggregateData(incomeChartData, period));
    }, [period]);

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

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
                    <p className="text-2xl font-bold">5</p>
                </div>
                <div className="bg-white shadow rounded p-4">
                    <h3 className="text-gray-500 text-sm">Total Products</h3>
                    <p className="text-2xl font-bold">50</p>
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
