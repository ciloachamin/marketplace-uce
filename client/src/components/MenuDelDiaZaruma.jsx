import React from "react";
import { FaUtensils } from "react-icons/fa";
import { Icons } from "./Icons";

const MenuDelDiaZaruma = ({ menu, menuImage }) => {
  // Extraer sopas, platos principales y bebidas del menú
  console.log(menu);

  const getMenuItems = () => {
    let soups = [];
    let mainCourses = [];
    let drinks = [];
    let desserts = [];
    let footerText = menu.description || "Buen provecho";

    if (menu.items && menu.items.length > 0) {
      // Buscar todas las sopas
      const soupItems = menu.items.filter(
        (item) =>
          item.category.toLowerCase().includes("sopa") ||
          item.name.toLowerCase().includes("sopa")
      );

      if (soupItems.length > 0) {
        soups = soupItems.map(
          (item) =>
            `${item.name}${item.description ? ` - ${item.description}` : ""}`
        );
      }

      // Buscar todos los platos principales
      const mainCourseItems = menu.items.filter(
        (item) =>
          item.category.toLowerCase().includes("principal") ||
          (!item.category.toLowerCase().includes("sopa") &&
            !item.category.toLowerCase().includes("postre") &&
            !item.category.toLowerCase().includes("bebida"))
      );

      if (mainCourseItems.length > 0) {
        mainCourses = mainCourseItems.map(
          (item) =>
            `${item.name}${item.description ? ` - ${item.description}` : ""}`
        );
      }

      // Buscar todas las bebidas
      const drinkItems = menu.items.filter(
        (item) =>
          item.category.toLowerCase().includes("bebida") ||
          item.name.toLowerCase().includes("bebida") ||
          item.name.toLowerCase().includes("jugo") ||
          item.name.toLowerCase().includes("refresco") ||
          item.name.toLowerCase().includes("gaseosa")
      );

      if (drinkItems.length > 0) {
        drinks = drinkItems.map(
          (item) =>
            `${item.name}${item.description ? ` - ${item.description}` : ""}`
        );
      }
    }
  // Buscar todos los postres
  const dessertItems = menu.items.filter(
    (item) =>
      item.category.toLowerCase().includes("postre") ||
      item.name.toLowerCase().includes("postre") ||
      item.name.toLowerCase().includes("helado") ||
      item.name.toLowerCase().includes("dulce")
  );

  if (dessertItems.length > 0) {
    desserts = dessertItems.map(
      (item) =>
        `${item.name}${item.description ? ` - ${item.description}` : ""}`
    );
  }
    


    return { soups, mainCourses, drinks, desserts, footerText };
  };

  const { soups, mainCourses, drinks,desserts, footerText } = getMenuItems();
  console.log(drinks);
  // Función para renderizar múltiples ítems con separación
  const renderItems = (items) => {
    return items.map((item, index) => (
      <div
        key={index}
        style={{
          fontSize: items.length > 2 ? "20px" : "28px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* Icono de comida (puedes cambiar FaUtensils por otro) */}
        <FaUtensils size={items.length > 2 ? 18 : 20} color="#CCA87D" />

        {/* Texto del ítem */}
        <span>{item}</span>
      </div>
    ));
  };
  // Calcular alturas dinámicas
  const soupHeight = soups.length > 1 ? 30 + soups.length * 35 : 60;
  const mainCourseHeight =
    mainCourses.length > 1 ? 30 + mainCourses.length * 35 : 80;
  const drinkHeight = drinks.length > 1 ? 30 + drinks.length * 30 : 60;
  const dessertHeight = desserts.length > 1 ? 30 + desserts.length * 30 : 60;

  // Calcular posiciones verticales
  const soupY = 140;
  const mainCourseY = soupY + soupHeight + 10;
  const drinkY = mainCourseY + mainCourseHeight;
  const dessertY = drinkY + drinkHeight + (drinks.length > 0 ? 30 : 0);
  const footerY = drinkY + dessertHeight + 30;

  return (
    <div className="mb-8">
      <svg
        width="100%"
        height="auto"
        viewBox="0 0 600 600" // Aumentamos la altura para acomodar las bebidas
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto block rounded-lg shadow-lg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Fondo */}
        <image href={menuImage} width="600" height="600" />

        {/* Fecha del menú */}
        {/* Opción 3: Diseño con fondo sutil y borde inferior */}
        {menu.date && (
          <foreignObject x="0" y="550" width="190" height="45">
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                fontFamily: "Road Rage",
                fontSize: "17px",
                fontWeight: "500",
                color: "#CCA87D",
                textAlign: "center",
                borderBottom: "2px solid ",
                padding: "8px 14px",
                textTransform: "capitalize",
              }}
              className="bg-gradient-to-r from-black to-[#302e2c] bg-opacity-80"
            >
              {new Date(menu.date).toLocaleString("es-ES", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </div>
          </foreignObject>
        )}

        {/* Título */}
        <foreignObject x="230" y="10" width="430" height="60">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              fontFamily: "Road Rage, system-ui",
              fontSize: "46px",
              fontWeight: "",
              color: "#CCA87D",
              textTransform: "uppercase",
            }}
          >
            {menu.name || "MENÚ DEL DÍA"}
          </div>
        </foreignObject>

        {/* Subtítulo */}
        <foreignObject x="380" y="70" width="350" height="40">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              fontFamily: "Road Rage",
              fontSize: "22px",
              fontStyle: "",
              color: "#CCA87D",
            }}
          >
            {menu.description ? `- ${menu.description} -` : "- ALMUERZOS -"}
          </div>
        </foreignObject>

        {/* Sopa */}
        <foreignObject x="200" y="105" width="200" height="42">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              fontFamily: "Road Rage",
              fontSize: "28px",
              fontWeight: "",
              textAlign: "center",
              color: "#CCA87D",
              textTransform: "uppercase",
            }}
            className="bg-gradient-to-r from-black to-[#302e2c] bg-opacity-80"
          >
            {soups.length > 1 ? "Sopas" : "Sopa"}
          </div>
        </foreignObject>
        <foreignObject x="60" y={soupY} width="520" height={soupHeight}>
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              fontFamily: "Road Rage",
              color: "#200E02",
              wordBreak: "break-word",
            }}
          >
            {renderItems(soups)}
          </div>
        </foreignObject>
        {/* Segundo - Ahora en dos columnas */}
        <foreignObject x="200" y={mainCourseY} width="200" height="40">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              fontFamily: "Road Rage",
              fontSize: "26px",
              fontWeight: "",
              color: "#CCA87D",
              textAlign: "center",
              textTransform: "uppercase",
            }}
            className="bg-gradient-to-r from-black to-[#302e2c] bg-opacity-80"
          >
            {mainCourses.length > 1 ? "Segundos" : "Segundo"}
          </div>
        </foreignObject>

        {/* Columna Izquierda */}
        <foreignObject
          x="60" // Más a la izquierda
          y={mainCourseY + 40}
          width="240" // Ancho reducido para dejar espacio a la derecha
          height={mainCourseHeight}
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              fontFamily: "Road Rage",
              color: "#200E02",
              wordBreak: "break-word",
              columnCount: 1, // Dividir en dos columnas
              columnGap: "20px", // Espacio entre columnas
            }}
          >
            {renderItems(
              mainCourses.slice(0, Math.ceil(mainCourses.length / 2))
            )}
          </div>
        </foreignObject>

        {/* Columna Derecha */}
        <foreignObject
          x="340" // A la derecha de la primera columna
          y={mainCourseY + 40}
          width="240"
          height={mainCourseHeight}
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              fontFamily: "Road Rage",
              color: "#200E02",
              wordBreak: "break-word",
            }}
          >
            {renderItems(mainCourses.slice(Math.ceil(mainCourses.length / 2)))}
          </div>
        </foreignObject>

        {drinks.length > 0 && (
          <>
            {/* Bebidas */}
            <foreignObject x="200" y={drinkY} width="200" height="40">
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                style={{
                  fontFamily: "Road Rage",
                  fontSize: "26px",
                  fontWeight: "",
                  textAlign: "center",
                  color: "#CCA87D",
                  textTransform: "uppercase",
                }}
                className="bg-gradient-to-r from-black to-[#302e2c] bg-opacity-80"
              >
                {drinks.length > 1 ? "Bebidas" : "Bebida"}
              </div>
            </foreignObject>
            <foreignObject
              x="60"
              y={drinkY + 30}
              width="520"
              height={drinkHeight}
            >
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                style={{
                  fontFamily: "Road Rage",
                  color: "#200E02",
                  wordBreak: "break-word",
                }}
              >
                {renderItems(drinks)}
              </div>
            </foreignObject>
          </>
        )}

        {desserts.length > 0 && (
          <>
            {/* Postres */}
            <foreignObject x="200" y={dessertY} width="200" height="40">
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                style={{
                  fontFamily: "Road Rage",
                  fontSize: "26px",
                  fontWeight: "",
                  textAlign: "center",
                  color: "#CCA87D",
                  textTransform: "uppercase",
                }}
                className="bg-gradient-to-r from-black to-[#302e2c] bg-opacity-80"
              >
                {desserts.length > 1 ? "Postres" : "Postre"}
              </div>
            </foreignObject>
            <foreignObject
              x="60"
              y={dessertY + 30}
              width="520"
              height={dessertHeight}
            >
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                style={{
                  fontFamily: "Road Rage",
                  color: "#200E02",
                  wordBreak: "break-word",
                }}
              >
                {renderItems(desserts)}
              </div>
            </foreignObject>
          </>
        )}

        {/* Footer */}
        {/* <foreignObject x="40" y={footerY} width="520" height="100">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              fontFamily: "Road Rage",
              fontSize: "28px",
              color: "#CCA87D",
              wordBreak: "break-word",
              overflow: "hidden",
              textAlign: "center",
              width: "100%",
            }}
          >
            {footerText}
          </div>
        </foreignObject> */}
        {/* Opción 4: Etiqueta diagonal moderna */}
        {menu.price && (
          <foreignObject x="460" y="480" width="120" height="120">
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                fontFamily: "Lato, sans-serif",
                fontSize: "28px",
                fontWeight: "700",
                color: "#CCA87D",
                textAlign: "center",
                transform: "rotate(-15deg)",
                boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="bg-gradient-to-tl from-black to-[#302e2c] border-l-4 border-[#CCA87D] p-4"
            >
              ${menu.price}
            </div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
};

export default MenuDelDiaZaruma;
