import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AdminRoute from "./components/AdminRoute";
import FloatingQRButton from "./components/FloatingQRButton";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MenuManagement from "./components/MenuManagement";
import NotAuthorized from "./components/NotAuthorized";
import PrivateRoute from "./components/PrivateRoute";
import UsersTable from "./components/UsersTable";
import AdminRequests from "./pages/AdminRequests";
import CreateBanner from "./pages/CreateBanner";
import CreateListing from "./pages/CreateListing";
import CreatePrize from "./pages/CreatePrize";
import CreateProduct from "./pages/CreateProduct";
import CreateShop from "./pages/CreateShop";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Listing from "./pages/Listing";
import Product from "./pages/Product";
import ProductSearch from "./pages/ProductSearch";
import Profile from "./pages/Profile";
import QRScannerPage from "./pages/QRScannerPage";
import SellerPlan from "./pages/SellerPlan";
import Shop from "./pages/Shop";
import ShopOwnersManagement from "./pages/ShopOwnersManagement";
import ShopPrizes from "./pages/ShopPrizes";
import ShopsList from "./pages/ShopWalletsPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UpdateListing from "./pages/UpdateListing";
import UpdateProduct from "./pages/UpdateProduct";
import Wallet from "./pages/Wallet";
import WalletGuide from "./pages/WalletGuide";
import WalletTransactions from "./pages/WalletTransactions";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from './redux/user/userSlice';
import {blogPosts }from "./components/blogPosts";
import BlogHome from "./pages/BlogHome";
import BlogPost from "./components/BlogPost";
export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogHome posts={blogPosts} />} />
        <Route path="/blog/:slug" element={<BlogPost posts={blogPosts} />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/seller-plan" element={<SellerPlan />} />
        {/* <Route path="/search" element={<Search />} /> */}
        <Route path="/search" element={<ProductSearch />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/shop/:shopId" element={<Shop />} />
        <Route path="/business/:shopId/prizes" element={<ShopPrizes/>} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="/shop" element={<ShopsList/>} />
        <Route path="/wallet-info" element={<WalletGuide/>} />
        <Route path='/shops/menu' element={<MenuManagement />} />

        {/* Rutas privadas para cualquier usuario autenticado */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/wallet/transactions/:walletId" element={<WalletTransactions />} />
        </Route>

        {/* Rutas solo para administradores */}
        <Route element={<AdminRoute />}>
          <Route path="/create-banner" element={<CreateBanner />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
          <Route path="/admin/users" element={<UsersTable />} />

        </Route>

        {/* Rutas solo para vendedores/negocios */}
        <Route element={<PrivateRoute allowedRoles={['admin', 'seller', 'shop' ]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-shop" element={<CreateShop />} />
          <Route path="/create-prize" element={<CreatePrize/>} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:listingId" element={<UpdateListing />} />
          <Route path="/update-product/:productId" element={<UpdateProduct />} />
          <Route path="/qr-scanner" element={<QRScannerPage />} />
        </Route>
                {/* Rutas solo para vendedores/negocios */}
        <Route element={<PrivateRoute allowedRoles={['shop', 'admin' ]} />}>
          <Route path="/shops/owners" element={<ShopOwnersManagement />} />
        </Route>
      </Routes>
      <Footer></Footer>
      <FloatingQRButton />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}
