'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OverviewChart from "@components/OverviewChart"; // make sure this exists

export default function StaffOverview() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalItemsSold: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Block access if not staff
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "staff") {
      router.push("/login");
      return;
    }

    // Sample orders data (replace this with your API)
    const sampleOrders = [
      { date: "2025-12-20", quantity: 3 },
      { date: "2025-12-21", quantity: 5 },
      { date: "2025-12-22", quantity: 2 },
      { date: "2025-12-23", quantity: 4 },
    ];

    // Calculate totals
    const totalOrders = sampleOrders.length;
    const totalItems = sampleOrders.reduce((sum, o) => sum + o.quantity, 0);
    setStats({ totalOrders, totalItemsSold: totalItems });

    // Prepare chart data
    setChartData(
      sampleOrders.map(o => ({
        date: o.date,
        value: o.quantity
      }))
    );
  }, [router]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Staff Dashboard Overview</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-gray-500">Total Items Sold</h3>
          <p className="text-2xl font-bold">{stats.totalItemsSold}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-gray-700 font-semibold mb-2">Items Sold Over Time</h3>
        <OverviewChart data={chartData} title="Items Sold" color="#3b82f6" />
      </div>
    </div>
  );
}
