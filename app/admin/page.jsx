"use client";
import { useEffect, useState } from "react";
import OverviewChart from "./OverviewChart";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStaff: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalIncome: 0,
  });

  const [ordersData, setOrdersData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);

  useEffect(() => {
    // TODO: Replace with API calls
    setStats({
      totalStaff: 5,
      totalOrders: 120,
      totalProducts: 50,
      totalIncome: 1500,
    });

    const sampleData = [
      { date: "2025-12-10", orders: 10, income: 200 },
      { date: "2025-12-11", orders: 15, income: 300 },
      { date: "2025-12-12", orders: 20, income: 450 },
      { date: "2025-12-13", orders: 25, income: 500 },
    ];

    setOrdersData(sampleData.map(d => ({ date: d.date, value: d.orders })));
    setIncomeData(sampleData.map(d => ({ date: d.date, value: d.income })));
  }, []);

  return (
    <div className="p-3 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-gray-500">Total Staff</h3>
          <p className="text-2xl font-bold">{stats.totalStaff}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-gray-500">Total Income</h3>
          <p className="text-2xl font-bold">${stats.totalIncome}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <OverviewChart data={ordersData} title="Orders Over Time" />
        <OverviewChart data={incomeData} title="Income Over Time" color="#3b82f6" />
      </div>

      {/* Staff section */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-gray-700 font-semibold mb-2">Staff Dashboard</h3>
        <p>List recent staff members or activity here...</p>
      </div>
    </div>
  );
}
