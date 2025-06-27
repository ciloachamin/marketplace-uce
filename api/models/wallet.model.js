import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    redeemedPoints: {
      type: Number,
      default: 0
    },
    availablePoints: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

walletSchema.index({ user: 1, business: 1 }, { unique: true });

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet;