
import React from 'react';
import type { StatusSummary } from '../types';

interface TicketTableProps {
  summary: StatusSummary[];
  totalTickets: number;
}

const TicketTable: React.FC<TicketTableProps> = ({ summary, totalTickets }) => {

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('aberto')) return 'bg-blue-500';
    if (s.includes('andamento')) return 'bg-yellow-500';
    if (s.includes('resolvido') || s.includes('fechado')) return 'bg-green-500';
    if (s.includes('pendente')) return 'bg-gray-400';
    return 'bg-slate-500';
  };


  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h3 className="font-bold text-[#333333] mb-4">Resumo por Status</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-[#333333] uppercase bg-gray-50 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Contagem de Chamados</th>
              <th scope="col" className="px-6 py-3">Satisfação Média</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((row) => {
               const colorClass = getStatusColor(row.status);
               const percentage = totalTickets > 0 ? (row.count / totalTickets) * 100 : 0;
              return (
                <tr key={row.status} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center">
                      <span className={`h-2.5 w-2.5 rounded-full mr-2 ${colorClass}`}></span>
                      {row.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center">
                        <span className="w-12 text-right mr-4 font-medium">{row.count}</span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className={`${colorClass} h-2.5 rounded-full`}
                            style={{ width: `${percentage}%` }}
                            title={`${percentage.toFixed(1)}%`}
                        ></div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{row.avgSatisfaction !== null ? `${row.avgSatisfaction.toFixed(1)} / 5` : '—'}</td>
                </tr>
              )
            })}
             {summary.length === 0 && (
                <tr>
                    <td colSpan={3} className="text-center py-10 text-gray-500">Nenhum dado de chamado para exibir.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTable;