import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";

// GET user's cart
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );
    }

    await connectDB();

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = await Cart.create({ userId, items: [] });
    }

    return NextResponse.json({
      success: true,
      cart: cart.items,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get cart" },
      { status: 500 }
    );
  }
}

// POST - Save/Update user's cart
export async function POST(req) {
  try {
    const { userId, items } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );
    }

    await connectDB();

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { items },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Cart saved",
      cart: cart.items,
    });
  } catch (error) {
    console.error("Save cart error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save cart" },
      { status: 500 }
    );
  }
}

// DELETE - Clear user's cart
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );
    }

    await connectDB();

    await Cart.findOneAndUpdate(
      { userId },
      { items: [] },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
