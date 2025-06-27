import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ items, activeMenu, handleMenuChange, isOpen, toggleSidebar }) {
  // Eliminamos el estado local isOpen ya que ahora lo manejamos desde el padre

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={toggleSidebar}
        data-drawer-target="default-sidebar" 
        data-drawer-toggle="default-sidebar" 
        aria-controls="default-sidebar" 
        type="button" 
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg 
          className="w-6 h-6" 
          aria-hidden="true" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            clipRule="evenodd" 
            fillRule="evenodd" 
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      {/* Sidebar */}
      <aside 
        id="default-sidebar" 
        className={`absolute top-0 left-0 z-40 w-64  h-full sm:h-screen transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          sm:relative sm:translate-x-0`} 
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {items.map((item, index) => (
              <li key={index}>
                <button
                  className={`flex items-center w-full p-2 rounded-lg transition-colors duration-200 ${
                    activeMenu === item.id
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-900 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    handleMenuChange(item.id);
                    // Cerrar el sidebar en móviles al seleccionar un ítem
                    if (window.innerWidth < 640) toggleSidebar();
                  }}
                >
                  {/* Icon */}
                  <span className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span className="ms-3 whitespace-nowrap">
                    {item.label}
                  </span>

                  {/* Optional Badge */}
                  {item.badge && (
                    <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;