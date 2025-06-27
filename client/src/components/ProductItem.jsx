import { Link } from 'react-router-dom';
import { MdStore, MdSchool, MdStarRate } from 'react-icons/md';

export default function ProductItem({ product }) {
    console.log(product);
    
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full'>
      <Link to={`/product/${product._id}`}>
        <img
          src={
            product.imageUrls[0] ||
            'https://via.placeholder.com/300x300?text=No+Image'
          }
          alt={product.name}
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <div className='flex justify-between items-start'>
            <p className='truncate text-lg font-semibold text-slate-700'>
              {product.name}
            </p>
            {product.discount > 0 && (
              <span className='bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                -{product.discount}%
              </span>
            )}
          </div>
          
          <div className='flex items-center gap-1'>
            <MdStore className='h-4 w-4 text-blue-700' />
            <p className='text-sm text-gray-600 truncate w-full'>
              {product.shopName}
            </p>
          </div>
          
          <div className='flex items-center gap-1'>
            <MdSchool className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-600'>{product.campus}</p>
          </div>
          
          <div className='flex items-center gap-1'>
            <MdStarRate className='h-4 w-4 text-yellow-500' />
            <p className='text-sm text-gray-600'>
              {product.rating || 'No ratings yet'}
            </p>
          </div>
          
          <div className='flex items-center justify-between mt-2'>
            <div>
              {product.discount > 0 ? (
                <>
                  <span className='text-lg font-bold text-slate-800'>
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className='text-sm text-gray-500 line-through ml-2'>
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className='text-lg font-bold text-slate-800'>
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            <span className='text-sm text-gray-600'>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}