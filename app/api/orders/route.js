import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";

// GET - Get all orders (for staff/admin) or user's orders
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    await connectDB();

    let orders;
    if (userId) {
      // Get specific user's orders
      orders = await Order.find({ userId }).sort({ createdAt: -1 });
    } else {
      // Get all orders (for staff/admin dashboard)
      orders = await Order.find().sort({ createdAt: -1 });
    }

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get orders" },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(req) {
  try {
    const { userId, items, totalAmount, shippingAddress } = await req.json();

    if (!userId || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "User ID and items required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Create order
    const order = await Order.create({
      userId,
      items,
      totalAmount,
      shippingAddress,
      status: "pending",
    });

    // Clear user's cart after order
    await Cart.findOneAndUpdate(
      { userId },
      { items: [] }
    );

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}

// PUT - Update order status (for staff/admin)
export async function PUT(req) {
  try {
    const { orderId, status, rejectionReason } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: "Order ID and status required" },
        { status: 400 }
      );
    }

    await connectDB();

    const updateData = { status };
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const order = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE - Delete order or delete all pending orders
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    await connectDB();

    if (orderId) {
      // Delete specific order
      const order = await Order.findByIdAndDelete(orderId);
      if (!order) {
        return NextResponse.json(
          { success: false, message: "Order not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: "Order deleted successfully",
      });
    } else {
      // Delete all pending orders
      const result = await Order.deleteMany({ status: "pending" });
      return NextResponse.json({
        success: true,
        message: `Deleted ${result.deletedCount} pending orders`,
        deletedCount: result.deletedCount,
      });
    }
  } catch (error) {
    console.error("Delete order error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete order" },
      { status: 500 }
    );
  }
}
