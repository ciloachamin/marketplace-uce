import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

const DataTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  onSelectAll,
  onSelectItem,
  pagination = true,
  defaultItemsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase();
    console.log(term);
    
    return data.filter(item => 
      columns.some(column => {
        // Obtener el valor renderizado o el valor crudo
        const value = column.render 
          ? String(column.render(item)) 
          : String(item[column.key]);
        return value.toLowerCase().includes(term);
      })
    );
  }, [searchTerm, data, columns]);

  // Calcular datos paginados
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = pagination ? filteredData.slice(startIndex, endIndex) : filteredData;

  // Opciones para items por página
  const itemsPerPageOptions = [5, 10, 20, 50, 100];

  // Manejar cambio de página
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Manejar selección de todos los items
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (onSelectAll) onSelectAll(checked);
  };

  // Manejar cambio de items por página
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = Number(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Resetear a la primera página al cambiar el tamaño
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    {/* Barra de búsqueda mejorada */}
    <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white dark:bg-gray-800">
        <div className="relative mb-4 md:mb-0 w-full md:w-1/2">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input
            type="text"
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Buscar en todas las columnas..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); 
            }}
          />
        </div>
        {pagination && (
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mostrar:
            </label>
            <select
              id="itemsPerPage"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <span className="text-sm text-gray-700 dark:text-gray-300">por página</span>
          </div>
        )}
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 bg-gray-100 border-gray-300 rounded-sm dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="px-6 py-3">
                {column.title}
              </th>
            ))}
            <th scope="col" className="px-6 py-3">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-search-${index}`}
                      type="checkbox"
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded-s dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={item.selected || false}
                      onChange={(e) => onSelectItem && onSelectItem(item.id || index, e.target.checked)}
                    />
                    <label
                      htmlFor={`checkbox-table-search-${index}`}
                      className="sr-only"
                    >
                      checkbox
                    </label>
                  </div>
                </td>
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => onEdit && onEdit(item)}
                    className="font-medium text-primary hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(item)}
                    className="font-medium text-red-600 dark:text-red-500 hover:underline"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-white dark:bg-gray-800">
              <td colSpan={columns.length + 2} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                No se encontraron resultados
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {pagination && filteredData.length > itemsPerPage && (
        <nav className="flex flex-col md:flex-row justify-between items-center p-4 bg-white dark:bg-gray-800">
          <span className="text-sm text-gray-700 dark:text-gray-300 mb-4 md:mb-0">
            Mostrando{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {startIndex + 1}-{Math.min(endIndex, filteredData.length)}
            </span>{' '}
            de{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredData.length}
            </span>{' '}
            registros
          </span>
          
          <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
              >
                Anterior
              </button>
            </li>
            
            {/* Mostrar siempre el primer número */}
            <li>
              <button
                onClick={() => handlePageChange(1)}
                className={`flex items-center justify-center px-3 h-8 leading-tight ${
                  currentPage === 1
                    ? 'text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
              >
                1
              </button>
            </li>

            {/* Mostrar puntos suspensivos si hay muchas páginas antes */}
            {currentPage > 3 && totalPages > 4 && (
              <li className="flex items-center justify-center px-3 h-8 text-gray-500">
                ...
              </li>
            )}

            {/* Mostrar páginas alrededor de la actual */}
            {Array.from({ length: Math.min(3, totalPages - 2) }, (_, i) => {
              let pageNum;
              if (currentPage <= 2) {
                pageNum = i + 2;
              } else if (currentPage >= totalPages - 1) {
                pageNum = totalPages - 3 + i;
              } else {
                pageNum = currentPage - 1 + i;
              }
              
              if (pageNum > 1 && pageNum < totalPages) {
                return (
                  <li key={pageNum}>
                    <button
                      onClick={() => handlePageChange(pageNum)}
                      className={`flex items-center justify-center px-3 h-8 leading-tight ${
                        currentPage === pageNum
                          ? 'text-primary/90 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-primary/90 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              }
              return null;
            })}

            {/* Mostrar puntos suspensivos si hay muchas páginas después */}
            {currentPage < totalPages - 2 && totalPages > 4 && (
              <li className="flex items-center justify-center px-3 h-8 text-gray-500">
                ...
              </li>
            )}

            {/* Mostrar siempre el último número si hay más de 1 página */}
            {totalPages > 1 && (
              <li>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight ${
                    currentPage === totalPages
                      ? 'text-primary/90 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-primary/90 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
                >
                  {totalPages}
                </button>
              </li>
            )}

            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectItem: PropTypes.func,
  pagination: PropTypes.bool,
  defaultItemsPerPage: PropTypes.number,
};

export default DataTable;