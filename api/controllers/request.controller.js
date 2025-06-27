import Request from '../models/request.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

// Crear solicitud
export const createRequest = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    // Verificar si ya existe una solicitud pendiente
    const existingRequest = await Request.findOne({ 
      user: userId,
      status: 'pending'
    });

    if (existingRequest) {
      return next(errorHandler(400, 'Ya tienes una solicitud pendiente'));
    }

    const request = new Request({
      user: userId,
      message
    });

    await request.save();
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

// Obtener todas las solicitudes (para admin)
export const getRequests = async (req, res, next) => {
  try {
    const requests = await Request.find()
      .populate('user', 'username email name lastname')
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

// Actualizar estado de solicitud (para admin)
export const updateRequest = async (req, res, next) => {
  try {
    const { status, adminResponse } = req.body;
    const requestId = req.params.id;

    const request = await Request.findById(requestId);
    if (!request) {
      return next(errorHandler(404, 'Solicitud no encontrada'));
    }

    request.status = status;
    request.adminResponse = adminResponse;
    await request.save();

    // Si se aprueba, actualizar el rol del usuario
    if (status === 'approved') {
      await User.findByIdAndUpdate(request.user, { role: 'seller' });
    }

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

// Verificar estado de solicitud del usuario
export const checkUserRequest = async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      const request = await Request.findOne({ 
        user: userId,
        status: { $in: ['pending', 'approved', 'rejected'] }
      }).sort({ createdAt: -1 });
      
      res.status(200).json({
        hasPending: request?.status === 'pending' || request?.status === 'rejected',
        status: request?.status || null
      });
    } catch (error) {
      next(error);
    }
  };