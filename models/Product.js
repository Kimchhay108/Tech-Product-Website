
// models/Product.js
import mongoose, { Schema } from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    colors: { type: [String], required: true },
    memory: { type: String },
    description: { type: String },
    images: { type: [String] },
    newArrival: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    specialOffer: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
