import Review from '../models/review.model.js';
import { errorHandler } from '../utils/error.js';
import Product from '../models/product.model.js';

export const createReview = async (req, res, next) => {
  try {
    const { productRef, rating, review, name} = req.body;
    const product = await Product.findById(productRef);
    if (!product) {
      return next(errorHandler(404, 'Product not found!'));
    }
    const existingReview = await Review.findOne({ productRef});
    if (existingReview) {
      return next(errorHandler(400, '¡Ya has reseñado este producto!'));
    }
    const newReview = new Review({
      productRef,
      name,
      rating,
      review
    });
    const savedReview = await newReview.save();
    await updateProductRating(productRef);

    res.status(201).json(savedReview);
  } catch (error) {
    next(error);
  }
};

export const getProductReviews = async (req, res, next) => {
  try {
    console.log('params',req.params);
    
    const reviews = await Review.find({ productRef: req.params.productId })
      .sort({ createdAt: -1 });
      console.log('rewiews',reviews);
      
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return next(errorHandler(404, 'Review not found!'));
    }
    
    if (review.userId.toString() !== req.user.id) {
      return next(errorHandler(403, 'You can only update your own reviews!'));
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.reviewId,
      {
        rating: req.body.rating,
        review: req.body.review
      },
      { new: true }
    );
    await updateProductRating(review.productRef);

    res.status(200).json(updatedReview);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return next(errorHandler(404, 'Review not found!'));
    }
    
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(errorHandler(403, 'You can only delete your own reviews!'));
    }

    const productRef = review.productRef;
    await Review.findByIdAndDelete(req.params.reviewId);
    await updateProductRating(productRef);

    res.status(200).json('Review has been deleted!');
  } catch (error) {
    next(error);
  }
};

async function updateProductRating(productRef) {
  const reviews = await Review.find({ productRef });
  
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    await Product.findByIdAndUpdate(productRef, {
      rating: averageRating
    });
  }
}