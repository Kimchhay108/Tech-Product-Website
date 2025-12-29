'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OverviewChart from "@components/OverviewChart";
import { getAuth } from "@/lib/auth";

export default function StaffOverview() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalItemsSold: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    if (!auth || auth.user.role !== "staff") {
      router.replace("/profile");
      return;
    }

    // Sample orders data (replace with real API later)
    const sampleOrders = [
      { date: "2025-12-20", quantity: 3 },
      { date: "2025-12-21", quantity: 5 },
      { date: "2025-12-22", quantity: 2 },
      { date: "2025-12-23", quantity: 4 },
    ];

    const totalOrders = sampleOrders.length;
    const totalItems = sampleOrders.reduce((sum, o) => sum + o.quantity, 0);
    setStats({ totalOrders, totalItemsSold: totalItems });

    setChartData(sampleOrders.map(o => ({
      date: o.date,
      value: o.quantity
    })));
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
