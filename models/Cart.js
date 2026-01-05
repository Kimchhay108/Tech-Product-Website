import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  cartItemId: {
    type: String,
    required: true,
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    default: 1,
  },
  image: String,
});

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
