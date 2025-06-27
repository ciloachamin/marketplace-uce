import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
import Shop from '../models/shop.model.js';
import User from '../models/user.model.js';

// middleware/verifyToken.js
export const verifyToken = async (req, res, next) => {
  const accessToken = req.cookies.access_token;

  // 1. Verificar access token
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      // Token expirado o inválido, continuar al refresh token
    }
  }

  // 2. Si no hay access token válido, verificar refresh token
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) return next(errorHandler(401, 'No autenticado'));

  try {
    const user = await User.findOne({ refreshToken });
    if (!user) return next(errorHandler(403, 'Token de refresco inválido'));

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (user._id.toString() !== decoded.id) {
      return next(errorHandler(403, 'Token de refresco inválido'));
    }

    // Adjuntar usuario a la solicitud PERO no generar nuevos tokens aquí
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyBusiness = async (req, res, next) => {
  const token = req.cookies?.business_token || req.headers?.authorization?.split(' ')[1];
  console.log("verifyBusiness",token);
  if (!token) {
    return next(errorHandler(401, 'Unauthorized: No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const business = await Business.findById(decoded.id).select('-qrScannerToken');
    
    if (!business) {
      return next(errorHandler(404, 'Business not found'));
    }

    req.business = business;
    next();
  } catch (error) {
    next(errorHandler(401, 'Unauthorized: Invalid token'));
  }
};

// Verificar que el usuario es dueño del negocio
export const shopOwner = async (req, res, next) => {
  try {
    console.log('shopOwner shopID',req.params.shopId);
    console.log('shopOwner',req.user);
    
    const shop = await Shop.findOne({ owners: req.user.id });
    console.log("SSSS", shop);
    
    console.log('params',req.params);

    const userId = req.user.id;
    console.log('user',userId);
    
    
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Negocio no encontrado'
      });
    }
    console.log('owners',shop.owners);
    console.log('userID', req.user._id);
    

    console.log('userID',shop.owners.includes(userId));
    
    if (!shop.owners.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado - No eres dueño de este negocio'
      });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar la propiedad del negocio'
    });
  }
};

export const adminOnly = async (req, res, next) => {
  console.log('user admin Only',req.user);
  const user = await User.findById(req.user.id);
  console.log('usser',user);
  
  if (user && user.role === 'admin') {
    next();
  } else {
    return next(errorHandler(403, 'Acceso solo para administradores'));
  }
};

export const adminAndShop = async (req, res, next) => {
  console.log('adminAndShopuser', req.user);
  const user = await User.findById(req.user.id);
  console.log('user',user);
  
  if (user && (user.role === 'admin' || user.role === 'shop')) {
    next();
  } else {
    return next(errorHandler(403, 'Acceso solo para administradores'));
  }
};