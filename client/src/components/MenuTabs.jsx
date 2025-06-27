import React from 'react';

const MenuTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-4">
        <button
          onClick={() => setActiveTab('daily')}
          className={`py-2 px-3 font-medium text-sm ${
            activeTab === 'daily'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Menús Diarios
        </button>
        <button
          onClick={() => setActiveTab('fixed')}
          className={`py-2 px-3 font-medium text-sm ${
            activeTab === 'fixed'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Menús Fijos
        </button>
      </nav>
    </div>
  );
};

export default MenuTabs;