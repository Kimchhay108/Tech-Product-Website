
// app/api/upload/route.js
export const runtime = "nodejs";

import { v2 as cloudinary } from "cloudinary";

const { CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error("[/api/upload] Missing Cloudinary env variables");
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const uploadedUrls = [];

    if (contentType.includes("application/json")) {
      // === JSON with base64 data URLs ===
      const body = await req.json().catch(() => null);
      if (!body || !Array.isArray(body.images) || body.images.length === 0) {
        return new Response(
          JSON.stringify({ success: false, message: "No images provided" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      for (const img of body.images.filter(Boolean)) {
        try {
          const source =
            typeof img === "string" && img.startsWith("data:") ? img : img;
          const result = await cloudinary.uploader.upload(source, {
            folder: "products",
          });
          uploadedUrls.push(result.secure_url);
        } catch (err) {
          console.error("[/api/upload] per-image error (JSON):", err);
          return new Response(
            JSON.stringify({
              success: false,
              message: err?.message || "Image upload failed",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    } else if (contentType.includes("multipart/form-data")) {
      // === FormData with File objects ===
      const formData = await req.formData();
      const files = formData.getAll("files").filter(Boolean);
      if (files.length === 0) {
        return new Response(
          JSON.stringify({ success: false, message: "No files provided" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      for (const file of files) {
        try {
          // Convert File to data URL for Cloudinary
          const arrayBuffer = await file.arrayBuffer();
          const base64File = Buffer.from(arrayBuffer).toString("base64");
          const mime = file.type || "application/octet-stream";
          const dataUrl = `data:${mime};base64,${base64File}`;

          const result = await cloudinary.uploader.upload(dataUrl, {
            folder: "products",
          });
          uploadedUrls.push(result.secure_url);
        } catch (err) {
          console.error("[/api/upload] per-file error (FormData):", err);
          return new Response(
            JSON.stringify({
              success: false,
              message: err?.message || "Image upload failed",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            "Unsupported Content-Type. Use application/json or multipart/form-data.",
        }),
        { status: 415, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, urls: uploadedUrls }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message || "Failed to upload images",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
