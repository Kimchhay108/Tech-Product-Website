import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    await connectDB();

    // Mongo totals
    const [totalProducts, totalOrders, incomeAgg] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, sum: { $sum: "$totalAmount" } } },
      ]),
    ]);

    const totalIncome = incomeAgg?.[0]?.sum || 0;

    // Staff count from Firestore (role == staff)
    let totalStaff = 0;
    if (adminDb) {
      const snapshot = await adminDb
        .collection("users")
        .where("role", "==", "staff")
        .get();
      totalStaff = snapshot.size;
    }

    // Chart data for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const ordersChart = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          income: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build last 30 days skeleton with zeros
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }

    // Map aggregation to keyed object for quick lookup
    const aggMap = ordersChart.reduce((acc, cur) => {
      acc[cur._id] = { orders: cur.orders, income: cur.income };
      return acc;
    }, {});

    // Normalize to array of objects with date (fill zeros when missing)
    const normalized = days.map((date) => ({
      date,
      orders: aggMap[date]?.orders || 0,
      income: aggMap[date]?.income || 0,
    }));

    return NextResponse.json({
      success: true,
      totalStaff,
      totalProducts,
      totalOrders,
      totalIncome,
      ordersChart: normalized,
      incomeChart: normalized, // reuse same aggregation
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load admin stats" },
      { status: 500 }
    );
  }
}
