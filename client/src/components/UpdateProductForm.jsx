import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { app } from '../firebase';

export default function UpdateProductForm({ product, currentUser, onSuccess, onCancel }) {
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
  const [cateShow, setCateShow] = useState(false);
  const [allCategory, setAllCategory] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await fetch('/api/category/get');
        const data = await res.json();
        if (data.success === false) {
          console.error(data.message);
          return;
        }
        setAllCategory(data);
        setOriginalCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        imageUrls: product.imageUrls || [],
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        brand: product.brand || '',
        price: product.price || 0,
        stock: product.stock || 1,
        discount: product.discount || 0,
        shopName: product.shopName || '',
        campus: product.campus || '',
      });
    }
  }, [product]);

  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      const filtered = originalCategories.filter(c => 
        c.name.toLowerCase().includes(value.toLowerCase())
      );
      setAllCategory(filtered);
    } else {
      setAllCategory(originalCategories);
    }
  };

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
          setImageUploadError('La carga de imagen falló (máximo 2 mb por imagen)');
          setUploading(false);
        });
    } else {
      setImageUploadError('Solo puedes subir 6 imágenes por producto');
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
    setFormData({
      ...formData,
      [e.target.id]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('Debes subir al menos una imagen');
      if (+formData.price < +formData.discount)
        return setError('El descuento debe ser menor que el precio');
      
      setLoading(true);
      setError(false);
      
      const res = await fetch(`/api/product/update/${product._id}`, {
        method: 'PUT',
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
      } else {
        onSuccess(data);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
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
            minLength='3'
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
        <div className="space-y-1 relative">
          <label htmlFor="category" className="text-sm font-medium text-gray-700">
            Categoría
          </label>
          <input
            readOnly
            onClick={() => setCateShow(!cateShow)}
            className='w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90 cursor-pointer'
            value={formData.category}
            type="text"
            placeholder={loadingCategories ? 'Cargando categorías...' : '-- Selecciona categoría --'}
            id='category'
            required
          />
          {cateShow && (
            <div className='absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1'>
              <div className='p-2 sticky top-0 bg-white z-10 border-b'>
                <input
                  value={searchValue}
                  onChange={categorySearch}
                  className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/90'
                  type="text"
                  placeholder='Buscar categoría...'
                  autoFocus
                />
              </div>
              <div className='max-h-60 overflow-y-auto'>
                {loadingCategories ? (
                  <div className='p-4 text-center text-gray-500'>Cargando categorías...</div>
                ) : allCategory.length === 0 ? (
                  <div className='p-4 text-center text-gray-500'>No se encontraron categorías</div>
                ) : (
                  allCategory.map((c) => (
                    <div
                      key={c._id}
                      className={`p-3 hover:bg-gray-100 cursor-pointer ${formData.category === c.name && 'bg-primary/10'}`}
                      onClick={() => {
                        setCateShow(false);
                        setFormData({...formData, category: c.name});
                        setSearchValue('');
                        setAllCategory(originalCategories);
                      }}
                    >
                      {c.name}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
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
            step='0.01'
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
            step='0.01'
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
        <div className="flex justify-between mt-4 w-full">
          {" "}
          <button
            type="button"
            onClick={onCancel}
            className="w-1/2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 mr-2"
          >
            Cancelar
          </button>
          <button
            disabled={loading || uploading}
            className="w-1/2 px-4 py-2 bg-gradient-to-r from-primary to-black text-white rounded-lg hover:bg-gradient-to-r hover:to-primary hover:from-black disabled:opacity-80"
            type="submit"
          >
            {loading ? 'Actualizando...' : 'Actualizar Producto'}
          </button>
        </div>
        {error && <p className='text-red-700 text-sm'>{error}</p>}
      </div>
    </form>
  );
}