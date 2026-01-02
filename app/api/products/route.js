export const runtime = "nodejs";

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category"; // needed for category filter

// ================== GET ==================
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    let query = {};

    // Filter by category slug
    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      const categoryDoc = await Category.findOne({ slug: categorySlug });
      if (categoryDoc) query.category = categoryDoc._id;
    }

    // Filter by flags
    if (searchParams.get("newArrival") === "true") query.newArrival = true;
    if (searchParams.get("bestSeller") === "true") query.bestSeller = true;
    if (searchParams.get("specialOffer") === "true") query.specialOffer = true;

    const products = await Product.find(query)
      .populate("category", "name slug")
      .lean(); // plain JS object for frontend

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error("[GET /api/products] Error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// ================== POST ==================
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });

    const {
      name,
      category, // ObjectId string
      price,
      colors,
      memory = "",
      description = "",
      images = [],
      newArrival = false,
      bestSeller = false,
      specialOffer = false,
    } = body;

    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { message: "name, category, and price are required" },
        { status: 400 }
      );
    }

    let categoryId;
    try {
      categoryId = new mongoose.Types.ObjectId(String(category));
    } catch {
      return NextResponse.json({ message: "Invalid category id" }, { status: 400 });
    }

    const colorsArray = Array.isArray(colors)
      ? colors
      : String(colors).split(",").map(c => c.trim()).filter(Boolean);

    if (!colorsArray.length) {
      return NextResponse.json({ message: "colors cannot be empty" }, { status: 400 });
    }

    const doc = await Product.create({
      name: name.trim(),
      category: categoryId,
      price: Number(price),
      colors: colorsArray,
      memory: String(memory),
      description: String(description),
      images: Array.isArray(images) ? images : [],
      newArrival: Boolean(newArrival),
      bestSeller: Boolean(bestSeller),
      specialOffer: Boolean(specialOffer),
    });

    await doc.populate({ path: "category", select: "name slug _id" });

    // 🔹 Convert to plain object so flags are always included
    const docObj = doc.toObject({ getters: true, versionKey: false });

    console.log("Created product:", docObj); // check in terminal

    return NextResponse.json(docObj, { status: 201 });
  } catch (err) {
    console.error("[POST /api/products] Error:", err);
    return NextResponse.json(
      { message: err?.message || "Failed to add product" },
      { status: 500 }
    );
  }
}

// ================== DELETE ==================
export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: "Product not found" }, { status: 404 });

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("[DELETE /api/products] Error:", err);
    return NextResponse.json(
      { message: err?.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
