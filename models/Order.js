import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  name: String,
  price: Number,
  quantity: Number,
  image: String,
  color: String,
  memory: String,
});

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    shippingAddress: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      zipCode: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
