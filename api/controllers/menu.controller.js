import RestaurantMenu from "../models/menu.model.js";
import Shop from "../models/shop.model.js";
import { errorHandler } from "../utils/error.js";

// Crear menú para un restaurante (solo dueños o admin)
export const createRestaurantMenu = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.shopId);

    // Verificar si el negocio existe y es un restaurante
    if (!shop) {
      return next(errorHandler(404, "Negocio no encontrado"));
    }
    if (shop.category !== "restaurant") {
      return next(errorHandler(400, "Solo restaurantes pueden tener menús"));
    }

    // Verificar permisos
    if (req.user.role !== "admin" && !shop.owners.includes(req.user.id)) {
      return next(errorHandler(403, "No autorizado para crear menús"));
    }

    // Verificar si ya existe un menú para este restaurante
    const existingMenu = await RestaurantMenu.findOne({
      shopId: req.params.shopId,
    });
    if (existingMenu) {
      return next(errorHandler(400, "Este restaurante ya tiene un menú"));
    }

    const newMenu = new RestaurantMenu({
      shopId: req.params.shopId,
      ...req.body,
    });

    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (error) {
    next(error);
  }
};

// Obtener menú de un restaurante
export const getRestaurantMenu = async (req, res, next) => {
  console.log(`User ID: ${req.params}`);

  try {
    console.log(`User ID: ${req.params}`);

    console.log("perro", req.params);

    const menu = await RestaurantMenu.findOne({
      shopId: req.params.shopId,
    }).populate("shopId", "name logo category imageDailyMenu");

    console.log(`Menu1: ${menu}`);

    if (!menu) {
      return next(errorHandler(404, "Menú no encontrado"));
    }

    // Filtrar menús diarios activos
    const activeDailyMenus = menu.dailyMenus.filter(
      (menu) => menu.isActive && new Date(menu.expiresAt) > new Date()
    );

    console.log(`Menu1: ${activeDailyMenus}`);

    // Filtrar menús fijos activos
    const activeFixedMenus = menu.fixedMenus.filter((menu) => menu.isActive);

    res.status(200).json({
      ...menu._doc,
      dailyMenus: activeDailyMenus,
      fixedMenus: activeFixedMenus,
    });
  } catch (error) {
    next(error);
  }
};

// Agregar menú diario
export const addDailyMenu = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.shopId);

    if (!shop) {
      return next(errorHandler(404, "Restaurante no encontrado"));
    }

    // Verificar permisos
    if (req.user.role !== "admin" && !shop.owners.includes(req.user.id)) {
      return next(errorHandler(403, "No autorizado para modificar menús"));
    }

    // Buscar o crear el menú del restaurante si no existe
    let menu = await RestaurantMenu.findOne({ shopId: req.params.shopId });

    if (!menu) {
      // Crear un nuevo menú de restaurante si no existe
      menu = new RestaurantMenu({
        shopId: req.params.shopId,
        dailyMenus: [],
        fixedMenus: [],
      });
    }
    console.log(`Menu: ${menu}`);
    console.log("Fecha" + new Date(req.body.date));

    const newDailyMenu = {
      ...req.body,
      isActive: true,
    };

    menu.dailyMenus.push(newDailyMenu);
    await menu.save();

    console.log(`Menu2: ${menu}`);
    // Filtrar menús diarios activos
    const activeDailyMenus = menu.dailyMenus.filter(
      (menu) => menu.isActive && new Date(menu.expiresAt) > new Date()
    );

    console.log(`Menu2: ${activeDailyMenus}`);

    // Filtrar menús fijos activos
    const activeFixedMenus = menu.fixedMenus.filter((menu) => menu.isActive);

    console.log(`Menu2: ${activeFixedMenus}`);

    res.status(200).json({
      ...menu._doc,
      dailyMenus: activeDailyMenus,
      fixedMenus: activeFixedMenus,
    });
  } catch (error) {
    next(error);
  }
};

// Agregar menú fijo
export const addFixedMenu = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return next(errorHandler(404, "Restaurante no encontrado"));

    // Verificar permisos
    if (req.user.role !== "admin" && !shop.owners.includes(req.user.id)) {
      return next(errorHandler(403, "No autorizado para modificar menús"));
    }

    let menu = await RestaurantMenu.findOne({ shopId: req.params.shopId });

    // Si no existe el menú, crearlo y guardarlo primero
    if (!menu) {
      menu = new RestaurantMenu({
        shopId: req.params.shopId,
        dailyMenus: [],
        fixedMenus: [],
      });
      await menu.save(); // ¡Falta guardar el nuevo menú!
    }

    // Validación para menús de imagen
    if (req.body.isImageMenu && !req.body.imageUrl) {
      return next(
        errorHandler(400, "Se requiere una imagen para este tipo de menú")
      );
    }

    // Validación para menús normales
    if (!req.body.isImageMenu) {
      const hasEmptyCategories = req.body.categories?.some(
        (category) =>
          !category.name ||
          category.items?.some(
            (item) => !item.name?.trim() || !item.price || !item.category
          )
      );

      if (hasEmptyCategories) {
        return next(
          errorHandler(
            400,
            "Todos los items deben tener nombre, precio y categoría"
          )
        );
      }
    }

    const newFixedMenu = {
      ...req.body,
      isActive: true,
      imageUrl: req.body.isImageMenu ? req.body.imageUrl : "",
      categories: req.body.isImageMenu ? [] : req.body.categories, // Limpiar categorías si es imagen
    };

    // Usar findOneAndUpdate para evitar race conditions
    const updatedMenu = await RestaurantMenu.findOneAndUpdate(
      { shopId: req.params.shopId },
      { $push: { fixedMenus: newFixedMenu } },
      { new: true, upsert: true }
    ).populate("shopId", "name logo category");

    // Filtrar menús activos
    const activeMenus = {
      dailyMenus: updatedMenu.dailyMenus.filter(
        (m) => m.isActive && new Date(m.expiresAt) > new Date()
      ),
      fixedMenus: updatedMenu.fixedMenus.filter((m) => m.isActive),
    };

    res.status(200).json({
      ...updatedMenu._doc,
      ...activeMenus,
    });
  } catch (error) {
    next(errorHandler(500, `Error del servidor: ${error.message}`));
  }
};

// Actualizar menú diario
// Actualizar menú diario (CORREGIDO)
export const updateDailyMenu = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.shopId);

    // Verificar permisos
    if (req.user.role !== "admin" && !shop.owners.includes(req.user.id)) {
      return next(errorHandler(403, "No autorizado para modificar menús"));
    }

    const menu = await RestaurantMenu.findOne({ shopId: req.params.shopId });
    if (!menu) {
      return next(errorHandler(404, "Menú no encontrado"));
    }

    // Buscar el índice del menú diario
    const dailyMenuIndex = menu.dailyMenus.findIndex(
      (m) => m._id.toString() === req.params.menuId
    );

    if (dailyMenuIndex === -1) {
      return next(errorHandler(404, "Menú diario no encontrado"));
    }

    // Actualizar el menú diario CORRECTO (antes estaba usando fixedMenus)
    menu.dailyMenus[dailyMenuIndex] = {
      ...menu.dailyMenus[dailyMenuIndex].toObject(),
      ...req.body,
    };

    await menu.save();
    res.status(200).json(menu);
  } catch (error) {
    next(error);
  }
};

// Actualizar menú fijo
export const updateFixedMenu = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.shopId);

    // Verificar permisos
    if (req.user.role !== "admin" && !shop.owners.includes(req.user.id)) {
      return next(errorHandler(403, "No autorizado para modificar menús"));
    }

    const menu = await RestaurantMenu.findOne({ shopId: req.params.shopId });
    if (!menu) {
      return next(errorHandler(404, "Menú no encontrado"));
    }

    const fixedMenuIndex = menu.fixedMenus.findIndex(
      (m) => m._id.toString() === req.params.menuId
    );

    if (fixedMenuIndex === -1) {
      return next(errorHandler(404, "Menú fijo no encontrado"));
    }

    menu.fixedMenus[fixedMenuIndex] = {
      ...menu.fixedMenus[fixedMenuIndex].toObject(),
      ...req.body,
    };

    await menu.save();
    res.status(200).json(menu);
  } catch (error) {
    next(error);
  }
};

// Eliminar menú diario
export const deleteDailyMenu = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.shopId);

    // Verificar permisos
    if (req.user.role !== "admin" && !shop.owners.includes(req.user.id)) {
      return next(errorHandler(403, "No autorizado para modificar menús"));
    }

    const menu = await RestaurantMenu.findOne({ shopId: req.params.shopId });
    if (!menu) {
      return next(errorHandler(404, "Menú no encontrado"));
    }

    menu.dailyMenus = menu.dailyMenus.filter(
      (m) => m._id.toString() !== req.params.menuId
    );

    await menu.save();
    res.status(200).json(menu);
  } catch (error) {
    next(error);
  }
};

// Eliminar menú fijo
export const deleteFixedMenu = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    // Verificar permisos
    if (req.user.role !== "admin" && !shop.owners.includes(req.user.id)) {
      return next(errorHandler(403, "No autorizado para modificar menús"));
    }

    const menu = await RestaurantMenu.findOne({ shopId: req.params.shopId });
    if (!menu) {
      return next(errorHandler(404, "Menú no encontrado"));
    }

    menu.fixedMenus = menu.fixedMenus.filter(
      (m) => m._id.toString() !== req.params.menuId
    );

    await menu.save();
    res.status(200).json(menu);
  } catch (error) {
    next(error);
  }
};

// Activar/desactivar menú
export const toggleMenuStatus = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.shopId);

    // Verificar permisos
    if (req.user.role !== "admin" && !shop.owners.includes(req.user.id)) {
      return next(errorHandler(403, "No autorizado para modificar menús"));
    }

    const menu = await RestaurantMenu.findOne({ shopId: req.params.shopId });
    if (!menu) {
      return next(errorHandler(404, "Menú no encontrado"));
    }

    const menuType = req.params.menuType; // 'daily' o 'fixed'
    const menuId = req.params.menuId;

    let menuArray, menuIndex;

    if (menuType === "daily") {
      menuArray = menu.dailyMenus;
      menuIndex = menu.dailyMenus.findIndex((m) => m._id.toString() === menuId);
    } else {
      menuArray = menu.fixedMenus;
      menuIndex = menu.fixedMenus.findIndex((m) => m._id.toString() === menuId);
    }

    if (menuIndex === -1) {
      return next(errorHandler(404, "Menú no encontrado"));
    }

    menuArray[menuIndex].isActive = !menuArray[menuIndex].isActive;
    await menu.save();

    res.status(200).json(menu);
  } catch (error) {
    next(error);
  }
};

// Obtener todos los menús (solo admin)
export const getAllMenus = async (req, res, next) => {
  try {
    // Obtener todos los menús desde la base de datos
    const menus = await RestaurantMenu.find().populate("shopId");

    // Procesar y filtrar los menús
    const filteredMenus = menus.map((menu) => {
      const activeDailyMenus = menu.dailyMenus.filter(
        (dailyMenu) =>
          dailyMenu.isActive && new Date(dailyMenu.expiresAt) > new Date()
      );

      const activeFixedMenus = menu.fixedMenus.filter(
        (fixedMenu) => fixedMenu.isActive
      );

      return {
        ...menu._doc, // Usar la estructura del documento original
        dailyMenus: activeDailyMenus, // Incluir solo menús diarios activos
        fixedMenus: activeFixedMenus, // Incluir solo menús fijos activos
      };
    });

    res.status(200).json(filteredMenus);
  } catch (error) {
    console.error("Error obteniendo menús filtrados:", error);
    next(error);
  }
};

