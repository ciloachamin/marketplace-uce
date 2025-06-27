import React, { useState, useEffect } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { CiStar } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { useValidation } from "../hooks/useValidation";
import { reviewSchema } from "../lib/validators/review-schema";
import { createInputClassNameGetter } from "../utils/formUtils";

const Reviews = ({ product }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [reviews, setReviews] = useState([]);
  const [totalReview, setTotalReview] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [ratingDistribution, setRatingDistribution] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Usamos formData en lugar de estados separados
  const [formData, setFormData] = useState({
    rating: 0,
    review: ''
  });

  const { errors, validateForm, validateField } = useValidation(reviewSchema);
  const getInputClassName = createInputClassNameGetter(errors);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    validateField(name, value);
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating
    });
    validateField('rating', rating);
  };

  // Calculate rating distribution
  const calculateRatingDistribution = (reviews) => {
    const distribution = [5, 4, 3, 2, 1].map(rating => {
      const sum = reviews.filter(r => r.rating === rating).length;
      return { rating, sum };
    });
    return distribution;
  };

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/review/product/${product._id}`);
      const data = await response.json();
      
      setReviews(data);
      setTotalReview(data.length);
      
      // Calculate rating distribution
      const distribution = calculateRatingDistribution(data);
      setRatingDistribution(distribution);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };
  
  // Submit review
  const review_submit = async (e) => {
    e.preventDefault();
    
    try {
      // Validar el formulario completo
      if (!validateForm(formData)) return;
      
      const response = await fetch('/api/review/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: currentUser.name,
          review: formData.review,
          rating: formData.rating,
          productRef: product._id
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        fetchReviews();
        // Resetear el formulario
        setFormData({
          rating: 0,
          review: ''
        });
        setErrorMessage(''); // Limpiar mensaje de error
      } else {
        setErrorMessage(data.message || 'Error al enviar la reseña');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      // El error se manejará a través del sistema de validación
    }
  };

  useEffect(() => {
    if (product._id) {
      fetchReviews();
    }
  }, [pageNumber, product._id]);

  // Star Rating Component
  const StarRating = ({ rating, size = "regular", interactive = false, onRatingChange }) => {
    const stars = [];
    const starSizes = {
      small: 16,
      regular: 20,
      large: 24
    };
    
    const fontSize = starSizes[size] || starSizes.regular;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className="inline-block"
          onClick={interactive ? () => onRatingChange(i) : undefined}
          style={interactive ? { cursor: 'pointer' } : {}}
        >
          {i <= rating ? (
            <AiFillStar size={fontSize} className="text-amber-400" />
          ) : (
            <CiStar size={fontSize} className="text-amber-400" />
          )}
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };
  
  // Pagination Component
  const Pagination = ({ pageNumber, setPageNumber, totalItem, perPage }) => {
    const totalPages = Math.ceil(totalItem / perPage);
    
    return (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setPageNumber(Math.max(1, pageNumber - 1))} 
          disabled={pageNumber === 1}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <HiOutlineChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        <span className="text-sm text-gray-600">
          Page {pageNumber} of {totalPages}
        </span>
        
        <button 
          onClick={() => setPageNumber(Math.min(totalPages, pageNumber + 1))} 
          disabled={pageNumber === totalPages || totalPages === 0}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <HiOutlineChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Rating Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Average Rating */}
            <div className="flex flex-col justify-center items-center p-6 bg-gray-50 rounded-lg">
              <div className="mb-2">
                <span className="text-5xl font-bold text-gray-900">{product.rating}</span>
                <span className="text-xl text-gray-500">/5</span>
              </div>
              <div className="mb-2">
                <StarRating rating={product.rating} size="large" />
              </div>
              <p className="text-sm text-gray-500">
                {totalReview} {totalReview === 1 ? 'Review' : 'Reviews'}
              </p>
            </div>
            
            {/* Rating Distribution */}
            <div className="p-6 bg-gray-50 rounded-lg">
              {ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center mb-2 last:mb-0">
                  <div className="w-4 mr-2">{item.rating}</div>
                  <div className="w-8">
                    <AiFillStar className="text-amber-400" />
                  </div>
                  <div className="w-full max-w-xs">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        style={{ 
                          width: `${totalReview > 0 ? Math.floor((100 * item.sum) / totalReview) : 0}%` 
                        }} 
                        className="h-full bg-amber-400 rounded-full"
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm text-gray-500">
                    {item.sum}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Add Review Section */}
          <div className="mb-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Agrega tu Review</h3>
            
            {currentUser ? (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Tu calificación</p>
                  <div className="flex gap-1">
                    <StarRating 
                      rating={formData.rating} 
                      size="large" 
                      interactive={true} 
                      onRatingChange={handleRatingChange}
                    />
                  </div>
                  {errors.rating && (
                    <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
                  )}
                </div>
                
                <form onSubmit={review_submit} className="space-y-4">
                  <div>
                    <textarea 
                      name="review"
                      value={formData.review} 
                      required 
                      onChange={handleChange}
                      className={getInputClassName("review")}
                      rows="4"
                      placeholder="Comparte tu opinión sobre este producto..."
                    ></textarea>
                    {errors.review && (
                      <p className="text-red-500 text-xs mt-1">{errors.review}</p>
                    )}
                  </div>
                  
                  <div>
                    <button 
                      type="submit" 
                      className="px-6 py-2 text-white rounded-lg bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!formData.rating || !formData.review}
                    >
                      Enviar reseña
                    </button>
                  </div>
                  {errorMessage && (
                    <div className="text-red-500 text-sm">
                      {errorMessage}
                    </div>
                  )}
                  
                </form>
              </div>
            ) : (
              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <p className="text-gray-600 mb-4">Necesitas iniciar sesión para dejar una reseña.</p>
                <Link 
                  className="inline-block px-6 py-2 text-white rounded-lg bg-gradient-to-r from-primary to-black hover:bg-gradient-to-r hover:to-primary hover:from-black transition-colors" 
                  to="/sign-in"
                >
                  Iniciar sesión
                </Link>
              </div>
            )}
          </div>
          
          {/* Reviews List */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Reseñas de clientes ({totalReview})
              </h2>
              
              {totalReview > perPage && (
                <Pagination 
                  pageNumber={pageNumber} 
                  setPageNumber={setPageNumber} 
                  totalItem={totalReview} 
                  perPage={perPage} 
                />
              )}
            </div>
            
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div 
                    key={index} 
                    className="p-6 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{review.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={review.rating} size="small" />
                          <span className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{review.review}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Aún no hay reseñas. ¡Sé el primero en reseñar este producto!
              </div>
            )}
            
            {/* Bottom Pagination */}
            {totalReview > perPage && (
              <div className="flex justify-center mt-8">
                <Pagination 
                  pageNumber={pageNumber} 
                  setPageNumber={setPageNumber} 
                  totalItem={totalReview} 
                  perPage={perPage} 
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Reviews;