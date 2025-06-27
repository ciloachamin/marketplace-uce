import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer';
import { signOutUserSuccess } from './user/userSlice'; 

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  whitelist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// src/redux/store.js
const authMiddleware = storeAPI => next => action => {
  if (action.type.endsWith('/rejected')) {
    const status = action.payload?.status || action.error?.status;
    if (status === 401 || status === 403) {
      storeAPI.dispatch(signOutUserSuccess());
      storeAPI.dispatch(persistor.purge());
    }
  }
  return next(action);
};
// Añade el middleware a la configuración
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authMiddleware),
});

export const persistor = persistStore(store);
