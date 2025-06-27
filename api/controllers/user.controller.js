import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';
import Product from '../models/product.model.js';
import Shop from '../models/shop.model.js';
export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  });
};

export const updateUser = async (req, res, next) => {
  console.log('user',req.user);
  const user = await User.findById(req.user.id);
  const isAdmin = user.role === 'admin';
  console.log('isAdmin',isAdmin);
  if (!isAdmin && (req.user.id !== req.params.id)) {
    return next(errorHandler(401, 'You can only update your own account!'));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          name: req.body.name,
          lastname: req.body.lastname,
          password: req.body.password,
          avatar: req.body.avatar,
          phone: req.body.phone,
          role: isAdmin ? req.body.role : req.user.role, 
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};

export const getUser = async (req, res, next) => {
  try {
    
    const user = await User.findById(req.params.id);
  
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = user._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const getUserProducts = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const products = await Product.find({ userRef: req.params.id });
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own products!'));
  }
};

export const getUserShop = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const shop = await Shop.findOne({ owners: req.user.id });
      res.status(200).json(shop);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'Solo puedes ver tu propio negocio!'));
  }
};
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};