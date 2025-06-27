import Product from "../models/product.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

const generateSlug = (name) => {
  return name
    .toLowerCase() // Convertir a minúsculas
    .replace(/\s+/g, "-") // Reemplazar espacios con guiones
    .replace(/[^\w\-]+/g, "") // Eliminar caracteres especiales
    .replace(/\-\-+/g, "-") // Reemplazar múltiples guiones con uno solo
    .replace(/^-+/, "") // Eliminar guiones al inicio
    .replace(/-+$/, ""); // Eliminar guiones al final
};
export const createProduct = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Generar el slug inicial a partir del nombre
    let slug = generateSlug(name);

    // Verificar si el slug ya existe
    let existingProduct = await Product.findOne({ slug });
    let counter = 1;

    // Si el slug ya existe, agregar un sufijo numérico hasta que sea único
    while (existingProduct) {
      slug = `${generateSlug(name)}-${counter}`;
      existingProduct = await Product.findOne({ slug });
      counter++;
    }

    // Crear el producto con el slug único
    const newProduct = await Product.create({
      ...req.body,
      slug, // Asignar el slug generado
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};
// Obtener todos los productos
export const getProducts = async (req, res, next) => {
  try {
    let sort = {};
    if (req.query.sort) {
      const sortParam = req.query.sort.startsWith("-") ? req.query.sort.substring(1) : req.query.sort;
      sort[sortParam] = req.query.sort.startsWith("-") ? -1 : 1;
    }

    let limit = 0;
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }

    const products = await Product.find({})
      .sort(sort)
      .limit(limit)
      .populate({
        path: 'userRef',
        model: User
      });

      console.log('products',products);
      

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    .populate({
      path: 'userRef',
      model: User
    });

    console.log('products',product);
    

    if (!product) {
      return next(errorHandler(404, 'Product not found!'));
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// Obtener un producto por su slug
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return next(errorHandler(404, "Producto no encontrado"));
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// Actualizar un producto
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(errorHandler(404, "Producto no encontrado!"));
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return next(errorHandler(404, "Producto no encontrado"));
    }
    res.status(200).json("Producto eliminado correctamente");
  } catch (error) {
    next(error);
  }
};

// Buscar productos por texto
export const searchProducts = async (req, res, next) => {
  try {
    const { searchTerm, category, brand, shopName, minPrice, maxPrice, discount, 
            approvedForSale, campus, minRating, sort, page = 1, limit = 10 } = req.query;
    
    // Construir el query de búsqueda
    const query = {};
    
    // Búsqueda por texto (usa el índice de texto definido en el modelo)
    if (searchTerm) {
      query.$text = { $search: searchTerm };
    }
    
    // Filtros adicionales
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (brand && brand !== 'all') {
      query.brand = brand;
    }
    
    if (shopName) {
      query.shopName = { $regex: shopName, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (discount === 'true') {
      query.discount = { $gt: 0 };
    }
    
    if (approvedForSale === 'true') {
      query.approvedForSale = true;
    }
    
    if (campus && campus !== 'all') {
      query.campus = campus;
    }
    
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }
    
    // Opciones de ordenamiento
    let sortOption = { createdAt: -1 }; // Por defecto: más recientes primero
    
    if (sort) {
      const [field, order] = sort.split('_');
      sortOption = { [field]: order === 'asc' ? 1 : -1 };
    }
    
    // Paginación
    const skip = (page - 1) * limit;
    
    // Ejecutar la consulta
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .exec();
    
    // Contar el total de resultados (sin paginación)
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      products,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit)
    });
    
  } catch (error) {
    next(error);
  }
};


// Obtener todos los productos con información del usuario
export const getProductsWithUsers = async (req, res, next) => {
  try {
    console.log('getProductsWithUsers ',req.query.sort);
    
    let sort = {};
    if (req.query.sort) {
      const sortParam = req.query.sort.startsWith("-") ? req.query.sort.substring(1) : req.query.sort;
      sort[sortParam] = req.query.sort.startsWith("-") ? -1 : 1;
    }

    let limit = 0;
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }
    console.log('limit',limit);
    

    const products = await Product.find({})
      .sort(sort)
      .limit(limit)
      .populate({
        path: 'userRef',
        model: User
      });

      console.log('products',products);
      

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// Obtener productos solo de usuarios con rol 'admin' o 'ell'
export const getAdminEllProducts = async (req, res, next) => {
  try {
    let sort = {};
    if (req.query.sort) {
      const sortParam = req.query.sort.startsWith("-") ? req.query.sort.substring(1) : req.query.sort;
      sort[sortParam] = req.query.sort.startsWith("-") ? -1 : 1;
    }

    let limit = 0;
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }

    // Primero encontramos los usuarios con los roles que nos interesan
    const adminEllUsers = await User.find({
      role: { $in: ['admin', 'sell'] }
    }).select('_id');

    // Luego encontramos los productos de esos usuarios
    const products = await Product.find({
      userRef: { $in: adminEllUsers.map(user => user._id) }
    })
      .sort(sort)
      .limit(limit)
      .populate({
        path: 'userRef',
        select: 'username email role avatar',
        model: User
      });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};


export const getProductsFilter = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    // Si no hay query parameters, devolver todos los productos
    if (Object.keys(req.query).length === 0) {
      const products = await Product.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate('userRef', 'username email avatar');
      
      const total = await Product.countDocuments();
      
      return res.status(200).json({
        success: true,
        products,
        total,
        page,
        pages: Math.ceil(total / limit)
      });
    }

    // Inicializar objeto de consulta
    const query = {};

    

    // Búsqueda por texto (usa el índice de texto)
    console.log('searchTerm',req.query.searchTerm);
    
    // Búsqueda por texto (usando regex)
    if (req.query.searchTerm) {
      const escapedSearchTerm = req.query.searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      query.$or = [
        { name: { $regex: escapedSearchTerm, $options: 'i' } },
        { description: { $regex: escapedSearchTerm, $options: 'i' } }
      ];
    }

    // Filtros básicos
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    if (req.query.brand && req.query.brand !== 'all') {
      query.brand = req.query.brand;
    }

    if (req.query.shopName) {
      query.shopName = { $regex: req.query.shopName, $options: 'i' };
    }

    // Filtro de precio
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : Number.MAX_SAFE_INTEGER;
    query.price = { $gte: minPrice, $lte: maxPrice };

    // Filtros booleanos
    if (req.query.discount === 'true') {
      query.discount = { $gt: 0 };
    }

    if (req.query.approvedForSale === 'true') {
      query.approvedForSale = true;
    }

    // Filtro por campus
    if (req.query.campus && req.query.campus !== 'all') {
      query.campus = req.query.campus;
    }

    // Filtro por rating mínimo
    if (req.query.minRating) {
      query.rating = { $gte: parseFloat(req.query.minRating) };
    }

    // Ordenamiento
    const sortField = req.query.sort ? req.query.sort.split('_')[0] : 'createdAt';
    const sortOrder = req.query.sort ? (req.query.sort.split('_')[1] === 'asc' ? 1 : -1) : -1;
    const sortOptions = { [sortField]: sortOrder };

    console.log('query',query);
    
    // Ejecutar consulta con populate
    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(limit)
      .skip(skip)
      .populate('userRef', 'username email avatar');

      console.log('products',products);
      

    // Obtener total de resultados
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      total,
      page,
      pages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Error in getProducts:', error);
    next(error);
  }
};