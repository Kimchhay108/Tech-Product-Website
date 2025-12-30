
// app/api/products/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

/**
 * GET /api/products
 * Returns all products, populated with category name & slug.
 */
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({})
      .populate("category", "name slug")
      .lean();

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error("[GET /api/products] Error:", err);
    return NextResponse.json(
      {
        message:
          err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Creates a product and returns the created document as JSON.
 * Expects a JSON body with:
 * { name, category (ObjectId string), price, colors (array or comma string), memory?, description?, images? }
 */
export async function POST(req) {
  try {
    await connectDB();

    // Parse JSON safely
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const {
      name,
      category, // ObjectId string
      price,
      colors,
      memory = "",
      description = "",
      images = [],
    } = body;

    // Basic validation (colors required by your schema)
    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { message: "name, category, and price are required" },
        { status: 400 }
      );
    }

    // Convert category to ObjectId
    let categoryId;
    try {
      categoryId = new mongoose.Types.ObjectId(String(category));
    } catch {
      return NextResponse.json(
        { message: "Invalid category id" },
        { status: 400 }
      );
    }

    // Normalize colors into an array of strings
    const colorsArray = Array.isArray(colors)
      ? colors
      : String(colors)
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);

    if (!colorsArray.length) {
      return NextResponse.json(
        { message: "colors cannot be empty" },
        { status: 400 }
      );
    }

    // Create product
    const doc = await Product.create({
      name: String(name).trim(),
      category: categoryId,
      price: Number(price),
      colors: colorsArray,
      memory: String(memory || ""),
      description: String(description || ""),
      images: Array.isArray(images) ? images : [],
    });

    // Optional: populate category for client convenience
    await doc.populate({ path: "category", select: "name slug _id" });

    // ✅ Return JSON so client `res.json()` succeeds
    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    console.error("[POST /api/products] Error:", err);
    return NextResponse.json(
      { message: err?.message || "Failed to add product" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products?id=<ObjectId>
 * Deletes by id (query parameter). Returns 204 No Content on success.
 */
export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Missing id" },
        { status: 400 }
      );
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid id" },
        { status: 400 }
      );
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Client already handles 204 with no body
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("[DELETE /api/products] Error:", err);
    return NextResponse.json(
      { message: err?.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
