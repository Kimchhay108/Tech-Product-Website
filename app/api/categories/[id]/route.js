import Category from "@/models/Category";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

connectDB();

export async function DELETE(req, context) {
  // context.params is now a Promise
  const params = await context.params; 
  const id = params?.id;

  console.log("DELETE category ID:", id);

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ message: "Invalid category id" }), { status: 400 });
  }

  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) {
    return new Response(JSON.stringify({ message: "Category not found" }), { status: 404 });
  }

  return new Response(
    JSON.stringify({ message: "Category deleted successfully", category: deleted }),
    { status: 200 }
  );
}


export async function PUT(req, context) {
  const params = await context.params;
  const id = params?.id;

  const body = await req.json();

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ message: "Invalid category id" }), { status: 400 });
  }

  const updated = await Category.findByIdAndUpdate(id, body, { new: true });
  if (!updated) {
    return new Response(JSON.stringify({ message: "Category not found" }), { status: 404 });
  }

  return new Response(JSON.stringify(updated), { status: 200 });
}
