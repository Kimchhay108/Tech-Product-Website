// app/api/categories/route.js
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

export const runtime = "nodejs";

export const GET = async () => {
  try {
    await connectDB();
    const categories = await Category.find().lean();
    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[GET /api/categories] Error:", err);
    return new Response(
      JSON.stringify({ message: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const POST = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return new Response(JSON.stringify({ message: "Name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // optional: generate slug
    const slug =
      body.slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

    const category = await Category.create({ name, description, slug });

    return new Response(JSON.stringify(category), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[POST /api/categories] Error:", err);
    return new Response(
      JSON.stringify({ message: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
