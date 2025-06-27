import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    productRef: {
      type:String,
      required: true,
    },
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    review: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

reviewSchema.index(
  { review: 'text' },
  {
    weights: {
      review: 1
    }
  }
);

reviewSchema.index({ productRef: 1});

const Review = mongoose.model('Review', reviewSchema);

export default Review;