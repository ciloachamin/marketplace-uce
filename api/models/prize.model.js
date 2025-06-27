import mongoose from "mongoose";

const prizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pointsRequired: {
      type: Number,
      required: true,
      min: 1,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expirationDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Prize = mongoose.model("Prize", prizeSchema);

export default Prize;