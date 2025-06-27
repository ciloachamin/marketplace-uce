import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/cookies.config.js";
export const signup = async (req, res, next) => {
  const { username, email, password, name, lastname } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  console.log('hashedPassword',hashedPassword);

  const newUser = new User({
    username,
    name,
    lastname,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    res.status(201).json("User created successfully!");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "Usuario no encontrado!"));
    
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Credenciales incorrectas!"));
    
    // Generar tokens
    const accessToken = jwt.sign({ id: validUser._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: validUser._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '180d' });

    // Guardar refresh token
    validUser.refreshToken = refreshToken;
    await validUser.save();

    const { password: pass, ...rest } = validUser._doc;
    
    res
      .cookie("access_token", accessToken, cookieOptions)
      .cookie("refresh_token", refreshToken, { ...cookieOptions, maxAge: 180 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Nuevo controlador para refresh token
export const refresh = async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) return next(errorHandler(401, 'Token de refresco requerido'));

  try {

    console.log('refreshToken',refreshToken);
    
    const user = await User.findOne({ refreshToken });
    console.log('user',user);
    
    if (!user) return next(errorHandler(403, 'Token de refresco inválido'));

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err || user._id.toString() !== decoded.id) {
        return next(errorHandler(403, 'Token de refresco inválido'));
      }

      const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
      const newRefreshToken = jwt.sign({ id: validUser._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '180d' });
      user.refreshToken = newRefreshToken;
      await user.save();

      res
        .cookie('access_token', newAccessToken, cookieOptions)
        .cookie('refresh_token', newRefreshToken, { ...cookieOptions, maxAge: 180 * 24 * 60 * 60 * 1000 })
        .status(200)
        .json({ success: true });
    });
  } catch (error) {
    next(error);
  }
};


export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    // Si el usuario existe
    if (user) {
      // Generar nuevos tokens
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '180d' }
      );

      // Actualizar refresh token en la base de datos
      user.refreshToken = refreshToken;
      await user.save();

      // Preparar respuesta sin información sensible
      const { password: pass, refreshToken: rt, ...rest } = user._doc;

      return res
        .cookie("access_token", accessToken, {
          ...cookieOptions,
          maxAge: 15 * 60 * 1000, // 15 minutos
        })
        .cookie("refresh_token", refreshToken, {
          ...cookieOptions,
          maxAge: 180 * 24 * 60 * 60 * 1000, // 7 días
        })
        .status(200)
        .json(rest);
    }

    // Si el usuario no existe - Crear nuevo
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
    
    // Procesar nombre de Google
    const displayName = req.body.name || 'Usuario';
    const nameParts = displayName.split(" ");
    const name = nameParts[0] || 'Usuario';
    const lastname = nameParts.slice(1).join(" ") || 'Anónimo';

    // Crear nuevo usuario
    const newUser = new User({
      username:
        displayName.toLowerCase().replace(/\s+/g, '') +
        Math.random().toString(36).slice(-4),
      name: name,
      lastname: lastname,
      email: req.body.email,
      password: hashedPassword,
      avatar: req.body.photo,
      refreshToken: null,
    });

    // Generar tokens para el nuevo usuario
    const accessToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '180d'  }
    );

    // Asignar refresh token y guardar
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Preparar respuesta
    const { password: pass, refreshToken: rt, ...rest } = newUser._doc;

    res
      .cookie("access_token", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refresh_token", refreshToken, {
        ...cookieOptions,
        maxAge: 180 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json(rest);

  } catch (error) {
    // Manejo de errores específicos
    if (error.code === 11000) {
      return next(errorHandler(400, 'El correo electrónico ya está registrado'));
    }
    next(error);
  }
};

// Actualizar signOut
export const signOut = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) {
      await User.updateOne({ refreshToken }, { $set: { refreshToken: null } });
    }
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(200).json({ success: true, message: 'Sesión cerrada correctamente' });
  } catch (error) {
    next(error);
  }
};