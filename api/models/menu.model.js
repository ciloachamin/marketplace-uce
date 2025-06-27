import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  secondPrice: {
    type: Number, // Para opciones como tamaño grande/pequeño
  },
  category: {
    type: String,
    enum: ["entrada", "sopa", "plato_principal", "postre", "bebida", "otros"],
    required: true,
  },
  imageUrl: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const dailyMenuSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  expiresAt: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  items: [menuItemSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
});

const fixedMenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isImageMenu: {
    type: Boolean,
    default: false
  },
  imageUrl:{
    type:String,
  },
  categories: [
    {
      name: {
        type: String,
        required: true,
      },
      items: [menuItemSchema],
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
});

const restaurantMenuSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    dailyMenus: [dailyMenuSchema],
    fixedMenus: [fixedMenuSchema],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Middleware para desactivar menús diarios expirados
restaurantMenuSchema.pre("save", function (next) {
  const now = new Date();
  this.dailyMenus.forEach((menu) => {
    if (menu.expiresAt <= now) {
      menu.isActive = false;
    }
  });
  next();
});

// Índice para búsquedas más eficientes
restaurantMenuSchema.index({ shopId: 1 });
dailyMenuSchema.index({ expiresAt: 1 });

const RestaurantMenu = mongoose.model("RestaurantMenu", restaurantMenuSchema);

export default RestaurantMenu;
