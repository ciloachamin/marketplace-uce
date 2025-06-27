import { useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateBanner() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    priority: 1,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(`/api/banner/get/${params.bannerId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setFormData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBanner();
  }, [params.bannerId]);

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      setUploading(true);
      setImageUploadError(false);
      try {
        const url = await storeImage(file);
        setFormData({
          ...formData,
          imageUrl: url,
        });
        setImageUploadError(false);
      } catch (error) {
        setImageUploadError('La carga de imagen falló (2 mb máximo)');
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError('Debes seleccionar una imagen');
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.type === 'number' ? parseInt(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.imageUrl) {
        return setError('Debes subir una imagen');
      }
      
      setLoading(true);
      setError(false);
      
      const res = await fetch(`/api/banner/update/${params.bannerId}`, {
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
      } else {
        navigate(`/banners`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Actualizar Banner
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nombre del Banner
            </label>
            <input
              type='text'
              placeholder='Nombre del banner'
              className='w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90'
              id='name'
              required
              onChange={handleChange}
              value={formData.name}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="priority" className="text-sm font-medium text-gray-700">
              Prioridad (1 = más alto)
            </label>
            <input
              type='number'
              placeholder='Prioridad'
              className='w-full border p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90'
              id='priority'
              min='1'
              required
              onChange={handleChange}
              value={formData.priority}
            />
          </div>
        </div>
        
        <div className='flex flex-col flex-1 gap-4'>
          <div className="space-y-1">
            <label htmlFor="image" className="text-sm font-medium text-gray-700">
              Imagen del Banner
              <span className='font-normal text-gray-600 ml-2'>
                (Relación de aspecto recomendada: 3:1)
              </span>
            </label>
            <div className='flex gap-4'>
              <input
                onChange={(e) => setFile(e.target.files[0])}
                className='p-3 border border-gray-300 rounded w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/90'
                type='file'
                id='image'
                accept='image/*'
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
          
          {formData.imageUrl && (
            <div className='flex justify-between p-3 border items-center'>
              <img
                src={formData.imageUrl}
                alt='banner preview'
                className='w-full h-32 object-cover rounded-lg'
              />
            </div>
          )}
          
          <button
            disabled={loading || uploading}
            className='p-3 bg-primary/90 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Actualizando...' : 'Actualizar Banner'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}