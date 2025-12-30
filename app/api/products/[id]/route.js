
// app/api/products/[id]/route.js
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export const runtime = "nodejs";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    // support both ObjectId and slugs (optional)
    const query = mongoose.Types.ObjectId.isValid(id)
      ? Product.findById(id)
      : Product.findOne({ slug: id });

    const product = await query.populate("category", "name slug").lean();

    if (!product) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const categoryLabel = product.category?.name || "Products";

    return new Response(JSON.stringify({ ...product, categoryLabel }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[GET /api/products/:id] Error:", err);
    return new Response(
      JSON.stringify({
        message: err instanceof Error ? err.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(_req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ message: "Invalid id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("[DELETE /api/products/:id] Error:", err);
    return new Response(
      JSON.stringify({
        message: err instanceof Error ? err.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
