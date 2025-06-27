import Wallet from "../models/wallet.model.js";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import Shop from "../models/shop.model.js";
import { errorHandler } from "../utils/error.js";

// Obtener todas las wallets de un usuario
export const getUserWallets = async (req, res, next) => {
  try {
    const wallets = await Wallet.find({ user: req.params.userId })
      .populate("business", "name logo category")
      .select("business totalPoints availablePoints redeemedPoints");

    res.status(200).json(wallets);
  } catch (error) {
    next(error);
  }
};

// Obtener detalles de una wallet específica
export const getWalletDetails = async (req, res, next) => {
  try {
    const wallet = await Wallet.findById(req.params.walletId)
      .populate("user", "name lastname qrcode")
      .populate("business", "name logo category");

    if (!wallet) {
      return next(errorHandler(404, "Wallet not found"));
    }

    res.status(200).json(wallet);
  } catch (error) {
    next(error);
  }
};

// Añadir puntos a una wallet (usado por el negocio)
export const addPointsToWallet = async (req, res, next) => {
  const { userId, points, description } = req.body;

  try {
    // 1. Verificar que el usuario que hace la petición es dueño de un negocio
    const shop = await Shop.findOne({ owners: req.user.id });
    if (!shop) {
      return next(
        errorHandler(403, "Solo los dueños de negocios pueden añadir puntos")
      );
    }

    // 2. Verificar que el usuario receptor existe
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "Usuario no encontrado"));
    }

    // Buscar o crear la wallet
    let wallet = await Wallet.findOne({ user: userId, business: shop._id  });

    if (!wallet) {
      // Crear nueva wallet si no existe
      wallet = new Wallet({
        user: userId,
        business: shop._id ,
        totalPoints: points,
        availablePoints: points,
      });
    } else {
      // Actualizar puntos si ya existe
      wallet.totalPoints += points;
      wallet.availablePoints += points;
    }

    await wallet.save();

    // Crear transacción
    const transaction = new Transaction({
      wallet: wallet._id,
      points: points,
      type: "credit",
      description: description || `Points added by ${shop.name}`,
      business: shop._id ,
      issuedBy: req.user.id,
    });

    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Points added successfully",
      wallet: wallet,
      transaction: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// Redimir puntos de una wallet
export const redeemPointsFromWallet = async (req, res, next) => {
  const { walletId, points, description } = req.body;

  try {
    const wallet = await Wallet.findById(walletId);

    if (!wallet) {
      return next(errorHandler(404, "Wallet not found"));
    }

    if (wallet.availablePoints < points) {
      return next(errorHandler(400, "Not enough available points"));
    }

    // Actualizar puntos
    wallet.availablePoints -= points;
    wallet.redeemedPoints += points;
    await wallet.save();

    // Crear transacción
    const transaction = new Transaction({
      wallet: wallet._id,
      points: points,
      type: "debit",
      description: description || "Points redeemed",
      business: wallet.business,
    });

    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Points redeemed successfully",
      wallet: wallet,
      transaction: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener transacciones de una wallet
export const getWalletTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ wallet: req.params.walletId })
      .sort({ createdAt: -1 })
      .populate("business", "name logo");

    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};
