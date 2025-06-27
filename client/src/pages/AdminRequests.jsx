import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/request', {
            headers: {
                "Content-Type": "application/json",
              },
        });
        const data = await res.json();
        if (data.success === false) {
          throw new Error(data.message);
        }
        setRequests(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.role === 'admin') {
      fetchRequests();
    }
  }, [currentUser]);

  const handleUpdateRequest = async (requestId, status) => {
    try {
      const res = await fetch(`/api/request/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      
      const data = await res.json();
      if (data.success === false) {
        throw new Error(data.message);
      }
      
      setRequests(requests.map(req => 
        req._id === requestId ? data : req
      ));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div>Cargando solicitudes...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Solicitudes de Vendedores</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensaje</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request._id}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-0 sm:ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {request.user?.name} {request.user?.lastname}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[150px] sm:max-w-none">
                          {request.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 max-w-[150px] truncate sm:max-w-none sm:whitespace-nowrap">
                    {request.message || 'Sin mensaje'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {request.status === 'approved' ? 'Aprobado' : 
                      request.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    {request.status === 'pending' && (
                      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0">
                        <button
                          onClick={() => handleUpdateRequest(request._id, 'approved')}
                          className="text-green-600 hover:text-green-900 text-left sm:text-center"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleUpdateRequest(request._id, 'rejected')}
                          className="text-red-600 hover:text-red-900 text-left sm:text-center"
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}