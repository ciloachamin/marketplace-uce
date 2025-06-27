import bcryptjs from "bcryptjs";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

// export const createShop = async (req, res, next) => {
//   try {
//     const shop = await Shop.create(req.body);
//     return res.status(201).json(shop);
//   } catch (error) {
//     next(error);
//   }
// };

// Crear nuevo negocio
export const createShop = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const qrScannerToken = bcryptjs.hashSync(
      `${req.body.name}-${Date.now()}`,
      10
    );
    
    // Verificar si el usuario ya tiene un negocio
    const user = await User.findById(ownerId);
    if (user.shop) {
      return next(errorHandler(400, "Ya tienes un negocio registrado"));
    }

    const shopData = {
      ...req.body,
      owners: ownerId,
      qrScannerToken,
    };

    // Crear el negocio
    const shop = await Shop.create(shopData);
    
    // Actualizar el usuario para asignarle el ID del negocio
    await User.findByIdAndUpdate(ownerId, { 
      $set: { 
        shop: shop._id,
      } 
    });

    return res.status(201).json(shop);
  } catch (error) {
    next(error);
  }
};

export const deleteShop = async (req, res, next) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    return next(errorHandler(404, "Shop not found!"));
  }

  if (req.user.id !== shop.userRef) {
    return next(errorHandler(401, "You can only delete your own shop!"));
  }

  try {
    await Shop.findByIdAndDelete(req.params.id);
    res.status(200).json("Shop has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return next(errorHandler(404, "Shop not found!"));
    }

    const user = await User.findById(req.user.id);
    const isAdmin = user?.role === "admin";
    
    // Verificar si el usuario es admin O está incluido en los owners del negocio
    const isOwner = shop.owners.some(ownerId => ownerId.toString() === req.user.id);
    
    if (!isAdmin && !isOwner) {
      return next(errorHandler(401, "You can only update shops you own!"));
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.status(200).json(updatedShop);
  } catch (error) {
    next(error);
  }
};

export const getShop = async (req, res, next) => {
  try {
    console.log(`Shop ID: ${req.params.id}`);
    const shop = await Shop.findById(req.params.id);
    console.log(shop);

    if (!shop) {
      return next(errorHandler(404, "Shop not found!"));
    }
    res.status(200).json(shop);
  } catch (error) {
    next(error);
  }
};

export const getShops = async (req, res, next) => {
  try {
    console.log(`Query Params: ${JSON.stringify(req.query)}`);

    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const shops = await Shop.find({
      name: { $regex: searchTerm, $options: "i" },
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(shops);
  } catch (error) {
    next(error);
  }
};

export const updatePointConfig = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const { pointConfig } = req.body;

    const business = await Business.findById(businessId);
    if (!business) {
      return next(errorHandler(404, "Business not found"));
    }

    if (business.owner.toString() !== req.user.id) {
      return next(errorHandler(403, "Unauthorized to update this business"));
    }

    business.pointConfig = pointConfig;
    await business.save();

    res.status(200).json(business);
  } catch (error) {
    next(error);
  }
};

export const getUserBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.find({ owner: req.user.id });
    res.status(200).json(businesses);
  } catch (error) {
    next(error);
  }
};

export const getShopByOwner = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owners: req.user.id });
    if (!shop) {
      return next(
        errorHandler(404, "No se encontró negocio para este usuario")
      );
    }
    res.status(200).json(shop);
  } catch (error) {
    next(error);
  }
};

export const addShopOwner = async (req, res, next) => {
  try {
    const { shopId, userId } = req.params;
    console.log(`Shop ID: ${shopId}, User ID: ${userId}`);
    
    const user = await User.findById(req.user.id);

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return next(errorHandler(404, "Negocio no encontrado"));
    }

    // Verificar permisos
    if (user.role !== "admin" && !shop.owners.includes(user._id)) {
      return next(errorHandler(403, "No tienes permisos para esta acción"));
    }

    const newOwner = await User.findById(userId);
    if (!newOwner) {
      return next(errorHandler(404, "Usuario no encontrado"));
    }

    // Verificar que el usuario no sea ya dueño
    if (shop.owners.includes(newOwner._id)) {
      return next(
        errorHandler(400, "Este usuario ya es dueño de este negocio")
      );
    }

    // Verificar que el usuario no tenga ya otro negocio (excepto admin)
    if (
      newOwner.shop &&
      newOwner.shop.toString() !== shopId &&
      newOwner.role !== "admin"
    ) {
      return next(
        errorHandler(400, "Este usuario ya tiene otro negocio asignado")
      );
    }

    // Agregar como dueño
    shop.owners.push(newOwner._id);
    await shop.save();

    // Asignar el negocio al nuevo dueño (si no es admin)
    if (newOwner.role !== "admin") {
      newOwner.shop = shop._id;
      await newOwner.save();
    }
    // 2. Actualizar el rol del usuario a 'shop'
    await User.findByIdAndUpdate(userId, { role: "shop", shop: shopId });

    res.status(200).json({
      success: true,
      message: "Dueño agregado exitosamente",
      shop,
    });
  } catch (error) {
    next(error);
  }
};

export const removeShopOwner = async (req, res, next) => {
  try {
    const { shopId, userId } = req.params;
    const user = await User.findById(req.user.id);
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return next(errorHandler(404, "Negocio no encontrado"));
    }

    // Verificar permisos
    if (user.role !== "admin" && !shop.owners.includes(user._id)) {
      return next(errorHandler(403, "No tienes permisos para esta acción"));
    }

    // No permitir quitar al último dueño
    if (shop.owners.length <= 1) {
      return next(
        errorHandler(400, "No puedes quitar al único dueño del negocio")
      );
    }

    const ownerToRemove = await User.findById(userId);
    if (!ownerToRemove) {
      return next(errorHandler(404, "Usuario no encontrado"));
    }

    // Verificar que el usuario sea dueño
    if (!shop.owners.includes(ownerToRemove._id)) {
      return next(
        errorHandler(400, "Este usuario no es dueño de este negocio")
      );
    }

    // Quitar dueño
    shop.owners = shop.owners.filter((owner) => owner.toString() !== userId);
    await shop.save();

    // Quitar referencia del negocio al usuario (si no es admin)
    if (ownerToRemove.role !== "admin") {
      ownerToRemove.shop = undefined;
      await ownerToRemove.save();
    }

    res.status(200).json({
      success: true,
      message: "Dueño removido exitosamente",
      shop,
    });
  } catch (error) {
    next(error);
  }
};
