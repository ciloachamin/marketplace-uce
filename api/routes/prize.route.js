import express from "express";
import {
  createPrize,
  getShopPrizes,
  getClaimablePrizes,
  claimPrize,
  updatePrize,
  updatePrizeStatus,
  deletePrize,
  getPublicPrizes
} from "../controllers/prize.controller.js";
import { verifyToken, shopOwner} from "../utils/verifyUser.js";

const router = express.Router();

// Dueños de negocio pueden crear premios
router.post("/shop/:shopId", verifyToken,shopOwner, createPrize);
router.get("/shop/:shopId", verifyToken, shopOwner,  getShopPrizes);
router.put("/update/:prizeId", verifyToken, updatePrize);
router.patch("/:prizeId/status", verifyToken, updatePrizeStatus);
router.delete("/:prizeId", verifyToken, deletePrize);

router.get("/public/:shopId", getPublicPrizes); // Sin verifyToken
// Usuarios pueden ver y reclamar premios
router.get("/claimable/:shopId", verifyToken, getClaimablePrizes);
router.post("/claim/:prizeId", verifyToken, claimPrize);

export default router;
