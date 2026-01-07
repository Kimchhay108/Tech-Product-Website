export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get("q");

    if (!searchTerm || searchTerm.trim().length < 2) {
      return NextResponse.json(
        { products: [], categories: [] },
        { status: 200 }
      );
    }

    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = { $regex: escapedTerm, $options: "i" };

    // Search products by name (limit to 5)
    const products = await Product.find({ name: searchRegex })
      .select("name images price")
      .limit(5)
      .lean();

    // Search categories by name (limit to 5)
    const categories = await Category.find({ name: searchRegex })
      .select("name slug")
      .limit(5)
      .lean();

    return NextResponse.json(
      { products, categories },
      { status: 200 }
    );
  } catch (err) {
    console.error("[GET /api/search] Error:", err);
    return NextResponse.json(
      { products: [], categories: [], error: err.message },
      { status: 500 }
    );
  }
}
