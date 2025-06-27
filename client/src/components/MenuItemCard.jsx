const MenuItemCard = ({ item }) => {
  const categoryNames = {
    entrada: "Entrada",
    sopa: "Sopa",
    plato_principal: "Plato Principal",
    postre: "Postre",
    bebida: "Bebida",
    otros: "Otros",
  };
  return (
    <div className="flex justify-between items-start py-1 border-b border-gray-100 last:border-0">
      <div>
        <p className="font-medium">{item.name}</p>
        {item.description && (
          <p className="text-xs text-gray-500">{item.description}</p>
        )}
        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
          {categoryNames[item.category] || item.category}
        </span>
      </div>
      <div className="text-right">
        {item.price && <p className="font-medium">${item.price.toFixed(2)}</p>}
        {item.secondPrice && (
          <p className="text-sm text-gray-500">
            ${item.secondPrice.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
