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

    // Search by product name (partial word matching)
    const searchTerm = searchParams.get("search");
    if (searchTerm) {
      // Escape special regex characters and create pattern for partial matching
      const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.name = { $regex: escapedTerm, $options: "i" }; // case-insensitive partial search
    }

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

    let productData = {};
    let images = [];

    // Check if request is FormData or JSON
    const contentType = req.headers.get("content-type");

    if (contentType && contentType.includes("multipart/form-data")) {
      // Handle FormData (with file uploads)
      const formData = await req.formData();
      productData = {
        name: formData.get("productName"),
        category: formData.get("selectedCategory"),
        price: formData.get("price"),
        discountPercent: formData.get("discountPercent"),
        colors: formData.get("colors"),
        memory: formData.get("memory") || "",
        description: formData.get("description") || "",
        newArrival: formData.get("newArrival") === "true",
        createdBy: formData.get("createdBy"),
        staffName: formData.get("staffName"),
      };

      // Handle image files
      const imageFiles = formData.getAll("images");
      for (const file of imageFiles) {
        if (file instanceof File) {
          // In a real app, upload to Cloudinary or similar
          images.push(`/uploads/${Date.now()}-${file.name}`);
        }
      }
    } else {
      // Handle JSON
      const body = await req.json().catch(() => null);
      if (!body)
        return NextResponse.json(
          { message: "Invalid request body" },
          { status: 400 }
        );

      productData = {
        name: body.name || body.productName,
        category: body.category || body.selectedCategory,
        price: body.price,
        discountPercent: body.discountPercent,
        colors: body.colors,
        memory: body.memory || "",
        description: body.description || "",
        newArrival: body.newArrival || false,
        createdBy: body.createdBy,
        staffName: body.staffName,
      };
      images = body.images || [];
    }

    // Validate required fields
    if (!productData.name || !productData.category || productData.price === undefined) {
      return NextResponse.json(
        { message: "name, category, and price are required" },
        { status: 400 }
      );
    }

    let categoryId;
    try {
      categoryId = new mongoose.Types.ObjectId(String(productData.category));
    } catch {
      return NextResponse.json(
        { message: "Invalid category id" },
        { status: 400 }
      );
    }

    const colorsArray = Array.isArray(productData.colors)
      ? productData.colors
      : String(productData.colors || "")
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);

    // Validate discountPercent
    let discountPercentNum = Number(productData.discountPercent);
    if (!Number.isFinite(discountPercentNum)) discountPercentNum = 0;
    if (discountPercentNum < 0) discountPercentNum = 0;
    if (discountPercentNum > 100) discountPercentNum = 100;

    if (!colorsArray.length) {
      return NextResponse.json({ message: "colors cannot be empty" }, { status: 400 });
    }

    const doc = await Product.create({
      name: productData.name.trim(),
      productName: productData.name.trim(),
      category: categoryId,
      price: Number(productData.price),
      discountPercent: discountPercentNum,
      colors: colorsArray,
      memory: String(productData.memory),
      description: String(productData.description),
      images: images.length > 0 ? images : [],
      newArrival: Boolean(productData.newArrival),
      createdBy: productData.createdBy,
      staffName: productData.staffName,
    });

    await doc.populate({ path: "category", select: "name slug _id" });

    const docObj = doc.toObject({ getters: true, versionKey: false });

    console.log("Created product:", docObj);

    return NextResponse.json({ success: true, product: docObj }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/products] Error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to add product" },
      { status: 500 }
    );
  }
}

// ================== PUT ==================
export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json().catch(() => null);
    if (!body)
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );

    const { productId, productName, category, description, colors, price, memory, newArrival, bestSeller, specialOffer, images, discountPercent } = body;

    if (!productId || !productName || !category || price === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ message: "Invalid product id" }, { status: 400 });
    }

    let categoryId;
    try {
      categoryId = new mongoose.Types.ObjectId(String(category));
    } catch {
      return NextResponse.json(
        { message: "Invalid category id" },
        { status: 400 }
      );
    }

    const colorsArray = Array.isArray(colors)
      ? colors
      : String(colors || "")
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);

    // Validate discountPercent if provided
    let discountPercentNum;
    if (typeof discountPercent !== 'undefined') {
      const dp = Number(discountPercent);
      if (!Number.isFinite(dp)) {
        return NextResponse.json({ message: "discountPercent must be a number" }, { status: 400 });
      }
      if (dp < 0 || dp > 100) {
        return NextResponse.json({ message: "discountPercent must be between 0 and 100" }, { status: 400 });
      }
      discountPercentNum = dp;
    }

    const updateData = {
      name: productName.trim(),
      productName: productName.trim(),
      category: categoryId,
      price: Number(price),
      // Allow empty colors array when staff did not specify colors during edit
      colors: colorsArray,
      memory: String(memory || ""),
      description: String(description || ""),
      newArrival: Boolean(newArrival),
      ...(typeof bestSeller !== 'undefined' ? { bestSeller: Boolean(bestSeller) } : {}),
      ...(typeof specialOffer !== 'undefined' ? { specialOffer: Boolean(specialOffer) } : {}),
    };

    if (typeof discountPercentNum !== 'undefined') {
      updateData.discountPercent = discountPercentNum;
    }

    // If images is provided in the payload, replace the product images
    if (Object.prototype.hasOwnProperty.call(body, 'images')) {
      const imagesArray = Array.isArray(images)
        ? images.filter(Boolean).map((u) => String(u))
        : [];
      updateData.images = imagesArray;
    }

    const updated = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
    }).populate({ path: "category", select: "name slug _id" });

    if (!updated) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const docObj = updated.toObject({ getters: true, versionKey: false });

    console.log("Updated product:", docObj);

    return NextResponse.json(
      { success: true, product: docObj },
      { status: 200 }
    );
  } catch (err) {
    console.error("[PUT /api/products] Error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to update product" },
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
