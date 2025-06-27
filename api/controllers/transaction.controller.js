import Transaction from "../models/transaction.model.js";
import Wallet from "../models/wallet.model.js";

export const createTransaction = async (req, res, next) => {
  try {
    // Asegurarnos que el usuario que otorga los puntos está autenticado
    console.log(`Usuario autenticado: ${req.user.id}`);
    
    const issuedBy = req.user.id; // Asumiendo que tienes autenticación JWT
    console.log(`Usuario que crea la transacción: ${issuedBy}`);
    

    const transactionData = {
      ...req.body,
      issuedBy,
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();

    if (transaction.wallet) {
      const wallet = await Wallet.findById(transaction.wallet);
      if (wallet) {
        if (transaction.type === "credit") {
          wallet.availablePoints += transaction.points;
          wallet.totalPoints += transaction.points;
        } else if (transaction.type === "debit") {
          wallet.availablePoints -= transaction.points;
          wallet.redeemedPoints += transaction.points;
        }
        await wallet.save();
      }
    }

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};
export const getTransactionHistory = async (req, res, next) => {
  try {
    const wallets = await Wallet.find({ user: req.params.userId });
    const walletIds = wallets.map((w) => w._id);
    const transactions = await Transaction.find({ wallet: { $in: walletIds } })
      .sort({ createdAt: -1 })
      .populate("wallet")
      .populate("business", "name logo category")

    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};
