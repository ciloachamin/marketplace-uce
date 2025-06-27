import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateProduct() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    category: '',
    brand: '',
    price: 0,
    stock: 1,
    discount: 0,
    shopName: '',
    campus: '',
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const productId = params.productId;
      const res = await fetch(`/api/product/get/${productId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchProduct();
  }, [params.productId]);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per product');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.price < +formData.discount)
        return setError('Discount must be lower than the price');
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/product/update/${params.productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/product/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Actualizar Producto
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type='text'
              placeholder='Nombre'
              className='w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90'
              id='name'
              maxLength='62'
              minLength='10'
              required
              onChange={handleChange}
              value={formData.name}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              type='text'
              placeholder='Descripción'
              className='w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90'
              id='description'
              required
              onChange={handleChange}
              value={formData.description}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="category" className="text-sm font-medium text-gray-700">
              Categoría
            </label>
            <input
              type='text'
              placeholder='Categoría'
              className='w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90'
              id='category'
              required
              onChange={handleChange}
              value={formData.category}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="brand" className="text-sm font-medium text-gray-700">
              Marca
            </label>
            <input
              type='text'
              placeholder='Marca'
              className='w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90'
              id='brand'
              required
              onChange={handleChange}
              value={formData.brand}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="price" className="text-sm font-medium text-gray-700">
              Precio
            </label>
            <input
              type='number'
              placeholder='Precio'
              className='w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90'
              id='price'
              min='0'
              required
              onChange={handleChange}
              value={formData.price}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="stock" className="text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type='number'
              placeholder='Stock'
              className='w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90'
              id='stock'
              min='1'
              required
              onChange={handleChange}
              value={formData.stock}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="discount" className="text-sm font-medium text-gray-700">
              Descuento
            </label>
            <input
              type='number'
              placeholder='Descuento'
              className='w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90'
              id='discount'
              min='0'
              onChange={handleChange}
              value={formData.discount}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="shopName" className="text-sm font-medium text-gray-700">
              Nombre de la tienda
            </label>
            <input
              type='text'
              placeholder='Nombre de la tienda'
              className='w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90'
              id='shopName'
              required
              onChange={handleChange}
              value={formData.shopName}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="campus" className="text-sm font-medium text-gray-700">
              Campus
            </label>
            <input
              type='text'
              placeholder='Campus'
              className='w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90'
              id='campus'
              required
              onChange={handleChange}
              value={formData.campus}
            />
          </div>
        </div>
        
        <div className='flex flex-col flex-1 gap-4'>
          <div className="space-y-1">
            <label htmlFor="images" className="text-sm font-medium text-gray-700">
              Imágenes:
              <span className='font-normal text-gray-600 ml-2'>
                La primera imagen será la portada (máximo 6)
              </span>
            </label>
            <div className='flex gap-4'>
              <input
                onChange={(e) => setFiles(e.target.files)}
                className='p-3 border border-gray-300 rounded w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90'
                type='file'
                id='images'
                accept='image/*'
                multiple
              />
              <button
                type='button'
                disabled={uploading}
                onClick={handleImageSubmit}
                className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
              >
                {uploading ? 'Subiendo...' : 'Subir'}
              </button>
            </div>
          </div>
          
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='product image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Eliminar
                </button>
              </div>
            ))}
          
          <button
            disabled={loading || uploading}
            className='p-3 bg-primary/90 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Actualizando...' : 'Actualizar producto'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}