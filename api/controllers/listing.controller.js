import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
export const getListings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    // Si no hay query parameters, devolver todos los listings
    if (Object.keys(req.query).length === 0) {
      const listings = await Listing.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
      
      const total = await Listing.countDocuments();
      
      return res.status(200).json({
        success: true,
        listings,
        total,
        page,
        pages: Math.ceil(total / limit)
      });
    }
    // Inicializar objeto de consulta vacío
    const query = {};

    // Solo agregar filtros si existen en la consulta
    if (req.query.searchTerm) {
      query.name = { $regex: req.query.searchTerm, $options: 'i' };
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filtro de precio (si se proporciona)
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : Number.MAX_SAFE_INTEGER;
    query.regularPrice = { $gte: minPrice, $lte: maxPrice };

    // Filtros opcionales
    if (req.query.type && req.query.type !== 'all') {
      query.type = req.query.type;
    }

    if (req.query.offer === 'true') {
      query.offer = true;
    }

    if (req.query.furnished === 'true') {
      query.furnished = true;
    }

    if (req.query.parking === 'true') {
      query.parking = true;
    }

    // Ordenamiento (con valores por defecto)
    const sortField = req.query.sort ? req.query.sort.split('_')[0] : 'createdAt';
    const sortOrder = req.query.sort ? (req.query.sort.split('_')[1] === 'desc' ? -1 : 1) : -1;
    const sortOptions = { [sortField]: sortOrder };

    // Ejecutar consulta
    const listings = await Listing.find(query)
      .sort(sortOptions)
      .limit(limit)
      .skip(skip);

    // Obtener total de resultados
    const total = await Listing.countDocuments(query);

    res.status(200).json({
      success: true,
      listings,
      total,
      page,
      pages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Error in getListings:', error);
    next(error);
  }
};