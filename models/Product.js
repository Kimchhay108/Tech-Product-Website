
// models/Product.js
import mongoose, { Schema } from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    productName: { type: String }, // alias for name
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    colors: { type: [String], required: true },
    memory: { type: String },
    description: { type: String },
    images: { type: [String] },
    newArrival: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    specialOffer: { type: Boolean, default: false },
    createdBy: { type: String }, // User/Staff UID
    staffName: { type: String }, // Name of staff who created it
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
