import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      console.log(result);
      console.log(result.user);
      
      

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
        credentials: 'include'
      });
      const data = await res.json();
      console.log(data);
      
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('could not sign in with google', error);
    }
  };
  return (
<button
      onClick={handleGoogleClick}
      type='button'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className='flex items-center justify-center gap-3 bg-white text-gray-700 px-6 py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 font-medium border border-gray-200 group'
    >
      <FcGoogle className={`text-xl ${isHovered ? 'animate-pulse' : ''}`} />
      <span className='group-hover:text-gray-900'>Continua con Google</span>
    </button>
  );
}
