import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TransactionItem from '../components/TransactionItem';

export default function WalletTransactions() {
  const { walletId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch wallet details
        const walletRes = await fetch(`/api/wallet/${walletId}`, {
          credentials: 'include', 
        });
        const walletData = await walletRes.json();
        setWallet(walletData);
        
        // Fetch transactions
        const transRes = await fetch(`/api/wallet/transactions/${walletId}`, {
          credentials: 'include', 
        });
        const transData = await transRes.json();
        setTransactions(transData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [walletId]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Historial de Puntos: {wallet?.business?.name || 'Negocio'}
      </h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Puntos Totales</h3>
            <p className="text-3xl font-bold">{wallet?.totalPoints || 0}</p>
          </div>
          <div>
            <h3 className="font-semibold">Puntos Disponibles</h3>
            <p className="text-3xl font-bold text-green-600">{wallet?.availablePoints || 0}</p>
          </div>
          <div>
            <h3 className="font-semibold">Puntos Redimidos</h3>
            <p className="text-3xl font-bold text-orange-600">{wallet?.redeemedPoints || 0}</p>
          </div>
        </div>
      </div>

      {loading && <p className="text-center">Cargando transacciones...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="space-y-4">
        {transactions.length === 0 && !loading && (
          <p className="text-center text-gray-500">No hay transacciones registradas</p>
        )}
        
        {transactions.map((transaction) => (
          <TransactionItem key={transaction._id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}