import { useState } from "react";
import { BiCategory } from "react-icons/bi";
import { FaBars, FaRegEnvelope, FaUsersSlash } from "react-icons/fa";
import { FaGift, FaShop, FaUsers } from "react-icons/fa6";
import { IoMdAdd, IoMdPersonAdd, IoMdRestaurant } from "react-icons/io";
import { MdAlignHorizontalLeft, MdDashboard } from "react-icons/md";
import { useSelector } from "react-redux";
import BannersTable from "../components/BannersTable";
import CategoriesTable from "../components/CategoriesTable";
import PrizesTable from "../components/PrizesTable";
import ProductsTable from "../components/ProductsTable";
import Sidebar from "../components/Sidebar";
import UsersTable from "../components/UsersTable";
import AdminRequests from "./AdminRequests";
import CreateBanner from "./CreateBanner";
import CreatePrize from "./CreatePrize";
import CreateProduct from "./CreateProduct";
import CreateShop from "./CreateShop";
import ShopOwnersManagement from "./ShopOwnersManagement";
import MenuManagement from "../components/MenuManagement";

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user);

  const sidebarItems = [
    // {
    //   id: "dashboard",
    //   icon: <MdDashboard />,
    //   label: "Dashboard",
    //   allowedRoles: ["admin", "seller", "shop"],
    // },
    {
      id: "myshop",
      icon: <FaShop />,
      label: "Mi Negocio",
      allowedRoles: ["shop", "admin"],
    },
    {
      id: "menu",
      icon: <IoMdRestaurant />,
      label: "Agregar Menú",
      allowedRoles: ["admin", "shop"],
    },
    {
      id: "category",
      icon: <BiCategory />,
      label: "Categorias",
      allowedRoles: ["admin"],
    },
    {
      id: "producto",
      icon: <IoMdAdd />,
      label: "Crear Producto",
      allowedRoles: ["seller", "shop", "admin"],
    },
    {
      id: "productos",
      icon: <MdAlignHorizontalLeft />,
      label: "Productos",
      allowedRoles: ["seller", "shop", "admin"],
    },
    {
      id: "banner",
      icon: <IoMdAdd />,
      label: "Crear Banner",
      allowedRoles: ["admin"],
    },
    {
      id: "banners",
      icon: <MdAlignHorizontalLeft />,
      label: "Banners",
      allowedRoles: ["admin"],
    },
    {
      id: "premio",
      icon: <FaGift />,
      label: "Crear Premio",
      allowedRoles: ["shop", "admin"],
    },
    {
      id: "premios",
      icon: <FaGift />,
      label: "Mis Premios",
      allowedRoles: ["shop", "admin"],
    },
    {
      id: "users",
      icon: <FaUsers />,
      label: "Usuarios",
      allowedRoles: ["admin"],
    },
    {
      id: "requests",
      icon: <FaRegEnvelope />,
      label: "Solicitiudes",
      allowedRoles: ["admin"],
    },
    {
      id: "addowners",
      icon: <IoMdPersonAdd />,
      label: "Agregar Dueños",
      allowedRoles: ["admin", "shop"],
    },

  ];

  const filteredSidebarItems = sidebarItems.filter(
    (item) =>
      !item.allowedRoles || item.allowedRoles.includes(currentUser?.role)
  );
  console.log(filteredSidebarItems);

  const [activeMenu, setActiveMenu] = useState("myshop");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuChange = (menuItem) => {
    setActiveMenu(menuItem);
  };

  const renderContent = () => {
    switch (activeMenu) {
      // case "dashboard":
      //   return <></>;
      case "myshop":
        return <CreateShop />;
      case "category":
        return <CategoriesTable />;
      case "producto":
        return <CreateProduct />;
      case "productos":
        return <ProductsTable />;
      case "banner":
        return <CreateBanner />;
      case "banners":
        return <BannersTable />;
      case "users":
        return <UsersTable />;
      case "products":
        return <div>Products Content</div>;
      case "premio":
        return <CreatePrize />;
      case "premios":
        return <PrizesTable />;
      case "requests":
        return <AdminRequests />;
      case "addowners":
        return <ShopOwnersManagement />;
      case "menu":
        return <MenuManagement />;
      default:
        return <>hayn't nada </>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-1 sm:flex relative min-h-screen">
      <Sidebar
        items={filteredSidebarItems}
        activeMenu={activeMenu}
        handleMenuChange={handleMenuChange}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="p-4 sm:p-5 flex-1">
        {sidebarOpen && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
