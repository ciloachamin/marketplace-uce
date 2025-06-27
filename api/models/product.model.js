import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    shopName: {
      type: String,
      required: false,
    },
    approvedForSale: {
      type: Boolean,
      default: false,
    },
    campus: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
productSchema.index(
  {
    name: 'text',
    category: 'text',
    brand: 'text',
    description: 'text',
  },
  {
    weights: {
      name: 5,
      category: 4,
      brand: 3,
      description: 2,
    },
    default_language: 'none', // Desactiva stemming
    min: 2      
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;