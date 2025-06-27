import express from 'express';
import { 
  createRestaurantMenu,
  getRestaurantMenu,
  addDailyMenu,
  addFixedMenu,
  updateDailyMenu,
  updateFixedMenu,
  deleteDailyMenu,
  deleteFixedMenu,
  toggleMenuStatus,
  getAllMenus
} from '../controllers/menu.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Crear menú para restaurante
router.post('/:shopId/create', verifyToken, createRestaurantMenu);

// Obtener menú de restaurante
router.get('/:shopId', getRestaurantMenu);

// Menús diarios
router.post('/:shopId/daily', verifyToken, addDailyMenu);
router.put('/:shopId/daily/:menuId', verifyToken, updateDailyMenu);
router.delete('/:shopId/daily/:menuId', verifyToken, deleteDailyMenu);

// Menús fijos
router.post('/:shopId/fixed', verifyToken, addFixedMenu);
router.put('/:shopId/fixed/:menuId', verifyToken, updateFixedMenu);
router.delete('/:shopId/fixed/:menuId', verifyToken, deleteFixedMenu);

// Activar/desactivar menú
router.patch('/:shopId/:menuType/:menuId/toggle', verifyToken, toggleMenuStatus);

// Obtener todos los menús (admin)
router.get('/', getAllMenus);

export default router;