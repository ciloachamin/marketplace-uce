import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../redux/reducers/categorySlice";
import { useNavigate } from "react-router-dom";

const NavItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading, error } = useSelector((state) => state.category);
  console.log(categories);
  

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (categoryName) => {
    navigate(`/search?category=${encodeURIComponent(categoryName.toLowerCase())}`);
  };

  if (loading) return <div className="h-12 bg-gray-100 animate-pulse"></div>;
  if (error) return <div className="h-12 bg-red-50 text-red-500 p-3">Error loading categories</div>;

  // Ensure categories is an array before mapping
  if (!Array.isArray(categories)) {
    return <div className="h-12 bg-yellow-50 text-yellow-600 p-3">Categories data format is invalid</div>;
  }

  return (
    <nav className="sticky top-0 z-10 bg-white shadow-md p-1 border-t-2">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop version */}
        <div className="hidden md:block bg-white">
          <div className="flex justify-center overflow-x-auto scrollbar-hide">
            {categories.map((category, index) => (
              <button
                key={category._id || index} // Use category._id if available
                onClick={() => handleCategoryClick(category.slug)}
                className="flex-shrink-0 px-5 py-2 mx-2 text-sm font-medium text-gray-700 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all duration-200"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Mobile version */}
        <div className="md:hidden bg-white">
          <div className="flex overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category, index) => (
              <button
                key={category._id || index} // Use category._id if available
                onClick={() => handleCategoryClick(category.slug)}
                className="flex-shrink-0 px-4 py-2 mx-1 text-sm font-medium text-gray-700 bg-gray-50 rounded-full hover:bg-gray-100 whitespace-nowrap"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavItems;