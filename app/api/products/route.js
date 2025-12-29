import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb"; // ✔ named import

connectDB();

export async function GET(req) {
  try {
    const products = await Product.find({});
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch products", { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const product = await Product.create(body);
    return new Response(JSON.stringify(product), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to add product", { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await Product.findByIdAndDelete(id);
    return new Response("Deleted", { status: 200 });
  } catch (err) {
    return new Response("Failed to delete product", { status: 500 });
  }
}
    