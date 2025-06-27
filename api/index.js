import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import productRouter from './routes/product.route.js';
import shopRouter from './routes/shop.route.js';
import bannerRouter from './routes/banner.route.js';
import categoryRouter from './routes/category.route.js';
import reviewRouter from './routes/review.route.js';
import cookieParser from 'cookie-parser';
import walletRouter from './routes/wallet.route.js';
import transactionRouter from './routes/transaction.route.js';
import requestRouter from './routes/request.route.js';
import prizeRouter from './routes/prize.route.js';
import menuRouter from './routes/menu.route.js';
import path from 'path';
import cors from 'cors';


dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

  const __dirname = path.resolve();

  const app = express();
  app.use(cors({
    origin: process.env.FRONTEND.split(','),
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
  }))

  // Headers adicionales para ventanas emergentes (Google OAuth)
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none'); // Necesario para Firebase
  next();
});
app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/product', productRouter); 
app.use('/api/shop', shopRouter);
app.use('/api/banner', bannerRouter);
app.use('/api/category', categoryRouter);
app.use('/api/review', reviewRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/request', requestRouter);
app.use('/api/prizes', prizeRouter);
app.use('/api/menu', menuRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
