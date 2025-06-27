import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['restaurant', 'retail', 'service', 'other'],
      default: 'other'
    },
    logo: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    imageDailyMenu : {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    phone: {
      type: String,
      required: true,
    },
    socialMedia: {
      type: Array,
      required: false,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    openingHours: {
      type: String,
      required: true,
    },
    closingHours: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["seller", "shop"], 
      default: "shop",
    },
    owners: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }],
    qrScannerToken: {
      type: String,
      unique: true
    }
  },
  { timestamps: true }
);

// Validación para asegurar al menos 1 dueño
shopSchema.pre('save', function(next) {
  if (this.owners.length === 0) {
    throw new Error('Un negocio debe tener al menos un dueño');
  }
  next();
});


const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
