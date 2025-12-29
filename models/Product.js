import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: { type: String, required: true },
  price: { type: Number, required: true },
  colors: { type: [String], required: true },
  memory: { type: String, default: "" },
  description: { type: String, default: "" },
  images: { type: [String], default: [] }, // new field for photos
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
