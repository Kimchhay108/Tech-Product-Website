// app/api/upload/route.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { images } = await req.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No images provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const uploadedUrls = [];
    for (const img of images) {
      const res = await cloudinary.uploader.upload(img, { folder: "products" });
      uploadedUrls.push(res.secure_url);
    }

    return new Response(
      JSON.stringify({ success: true, urls: uploadedUrls }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message || "Failed to upload images" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
