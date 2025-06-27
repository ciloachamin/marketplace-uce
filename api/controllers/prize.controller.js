import Wallet from "../models/wallet.model.js";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import Shop from "../models/shop.model.js";
import Prize from "../models/prize.model.js";

// Crear premio (para dueños de negocio)
export const createPrize = async (req, res, next) => {
  try {
    console.log(req.params.shopId);
    console.log(req.user.id);

    const { name, description, pointsRequired, image, stock, expirationDate } =
      req.body;
    const shopId = req.params.shopId;
    const userId = req.user.id;

    // Verificar que el usuario es dueño del negocio
    const shop = await Shop.findById(shopId);
    console.log("shop 2", shop);

    if (!shop) {
      return res.status(404).json({ message: "Negocio no encontrado" });
    }
    if (!shop.owners.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "No autorizado - No eres dueño de este negocio",
      });
    }

    const prize = new Prize({
      name,
      description,
      pointsRequired,
      shop: shopId,
      image,
      stock,
      expirationDate,
    });

    await prize.save();

    res.status(201).json(prize);
  } catch (error) {
    next(error);
  }
};

// Obtener premios de un negocio
export const getShopPrizes = async (req, res, next) => {
  try {
    console.log(`User ID: ${req.user.id}`);
    console.log(`User Role: ${req.params}`);

    const shopId = req.params.shopId;
    console.log(`Shop ID: ${shopId}`);

    const prizes = await Prize.find({ shop: shopId, isActive: true }).sort({
      pointsRequired: 1,
    });

    console.log(`Prizes: ${prizes}`);

    res.status(200).json(prizes);
  } catch (error) {
    next(error);
  }
};

export const getPublicPrizes = async (req, res, next) => {
  try {
    const shopId = req.params.shopId;

    const prizes = await Prize.find({
      shop: shopId,
      isActive: true,
    }).sort({ pointsRequired: -1 });

    res.status(200).json({ prizes });
  } catch (error) {
    next(error);
  }
};

// Función auxiliar para obtener los puntos del usuario en un negocio específico
const getUserPoints = async (userId, shopId) => {
  try {
    const wallet = await Wallet.findOne({ user: userId, business: shopId });
    if (wallet) {
      return wallet.availablePoints;
    } else {
      return 0; // Si no hay wallet, el usuario tiene 0 puntos en ese negocio
    }
  } catch (error) {
    throw error;
  }
};

// Obtener premios reclamables por usuario
export const getClaimablePrizes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const shopId = req.params.shopId;
    const userPoints = await getUserPoints(userId, shopId);

    console.log(`User points: ${userPoints}`);
    console.log(`Shop ID: ${shopId}`);

    const prizes = await Prize.find({
      shop: shopId,
      isActive: true,
      $or: [{ stock: { $gt: -1 } }],
    }).sort({ pointsRequired: -1 });

    console.log(`Prizes: ${prizes}`);

    res.status(200).json({ prizes, userPoints });
  } catch (error) {
    next(error);
  }
};

// Reclamar premio
export const claimPrize = async (req, res, next) => {
  try {
    const prizeId = req.params.prizeId;
    const userId = req.user.id;

    const prize = await Prize.findById(prizeId);
    if (!prize || !prize.isActive) {
      return res.status(404).json({ message: "Premio no disponible" });
    }

    // Verificar puntos del usuario
    const userPoints = await getUserPoints(userId, prize.shop); // Función ficticia
    if (userPoints < prize.pointsRequired) {
      return res.status(400).json({ message: "Puntos insuficientes" });
    }

    // Verificar stock
    if (prize.stock > 0) {
      prize.stock -= 1;
      await prize.save();
    } else if (prize.stock === 0) {
      return res.status(400).json({ message: "Premio agotado" });
    }

    // Registrar reclamación (necesitarías un modelo para esto)
    await createPrizeClaim(userId, prizeId); // Función ficticia

    // Descontar puntos (implementar según tu sistema)
    await deductUserPoints(userId, prize.shop, prize.pointsRequired); // Función ficticia

    res.status(200).json({ message: "Premio reclamado con éxito" });
  } catch (error) {
    next(error);
  }
};

// Actualizar un premio existente
export const updatePrize = async (req, res, next) => {
  try {
    const prizeId = req.params.prizeId;
    const userId = req.user.id;
    const updateData = req.body;

    // Buscar el premio
    const prize = await Prize.findById(prizeId);
    if (!prize) {
      return res.status(404).json({ message: "Premio no encontrado" });
    }

    // Verificar que el usuario es dueño del negocio asociado al premio
    const shop = await Shop.findById(prize.shop);
    if (!shop) {
      return res.status(404).json({ message: "Negocio no encontrado" });
    }
    if (shop.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "No autorizado para actualizar este premio" });
    }

    // Actualizar campos permitidos
    const allowedUpdates = [
      "name",
      "description",
      "pointsRequired",
      "image",
      "stock",
      "isActive",
      "expirationDate",
    ];
    const updates = {};

    for (const field of allowedUpdates) {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    }

    // Si se actualizan puntos requeridos, validar que sea número positivo
    if (updates.pointsRequired !== undefined && updates.pointsRequired <= 0) {
      return res
        .status(400)
        .json({ message: "Los puntos requeridos deben ser mayores a 0" });
    }

    // Si se actualiza stock, validar que sea número no negativo
    if (updates.stock !== undefined && updates.stock < 0) {
      return res
        .status(400)
        .json({ message: "El stock no puede ser negativo" });
    }

    const updatedPrize = await Prize.findByIdAndUpdate(prizeId, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedPrize);
  } catch (error) {
    next(error);
  }
};

// Actualizar estado de un premio (activar/desactivar)
export const updatePrizeStatus = async (req, res, next) => {
  try {
    const prizeId = req.params.prizeId;
    const userId = req.user.id;
    const { isActive } = req.body;

    // Buscar el premio
    const prize = await Prize.findById(prizeId);
    if (!prize) {
      return res.status(404).json({ message: "Premio no encontrado" });
    }

    // Verificar que el usuario es dueño del negocio asociado al premio
    const shop = await Shop.findById(prize.shop);
    if (!shop) {
      return res.status(404).json({ message: "Negocio no encontrado" });
    }
    if (shop.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "No autorizado para actualizar este premio" });
    }

    // Actualizar solo el estado
    const updatedPrize = await Prize.findByIdAndUpdate(
      prizeId,
      { isActive },
      { new: true }
    );

    res.status(200).json({
      message: `Premio ${isActive ? "activado" : "desactivado"} correctamente`,
      prize: updatedPrize,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un premio (borrado lógico)
export const deletePrize = async (req, res, next) => {
  try {
    const prizeId = req.params.prizeId;
    const userId = req.user.id;

    // Buscar el premio
    const prize = await Prize.findById(prizeId);
    if (!prize) {
      return res.status(404).json({ message: "Premio no encontrado" });
    }

    // Verificar que el usuario es dueño del negocio asociado al premio
    const shop = await Shop.findById(prize.shop);
    if (!shop) {
      return res.status(404).json({ message: "Negocio no encontrado" });
    }

    // Verificar si el usuario es admin O está incluido en los owners del negocio
    const isOwner = shop.owners.some(
      (ownerId) => ownerId.toString() === req.user.id
    );

    if (!isOwner) {
      return next(
        errorHandler(401, "No autorizado para eliminar este premio!")
      );
    }

    // Borrado lógico (marcar como inactivo en lugar de borrar)
    await Prize.findByIdAndUpdate(prizeId, { isActive: false });

    res.status(200).json({ message: "Premio eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};
