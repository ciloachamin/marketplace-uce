import Banner from '../models/banner.model.js';
import { errorHandler } from '../utils/error.js';

export const createBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);
    return res.status(201).json(banner);
  } catch (error) {
    next(error);
  }
};

export const getBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return next(errorHandler(404, 'Banner no encontrado!'));
    }
    res.status(200).json(banner);
  } catch (error) {
    next(error);
  }
};

export const getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ priority: 1 });
    res.status(200).json(banners);
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!banner) {
      return next(errorHandler(404, 'Banner no encontrado'));
    }
    res.status(200).json(banner);
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return next(errorHandler(404, 'Banner no encontrado!'));
    }
    res.status(200).json({ message: 'El Banner ha sido eliminado!' });
  } catch (error) {
    next(error);
  }
};
