import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function TransactionItem({ transaction }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">
            {transaction.type === 'credit' ? 'Puntos añadidos' : 'Puntos redimidos'}
          </h3>
          <p className="text-sm text-gray-600">{transaction.description}</p>
          <p className="text-xs text-gray-500 mt-1">
            {format(new Date(transaction.createdAt), 'PPPpp', { locale: es })}
          </p>
        </div>
        
        <div className={`text-lg font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
          {transaction.type === 'credit' ? '+' : '-'}{transaction.points} pts
        </div>
      </div>
    </div>
  );
}