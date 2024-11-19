import React from 'react';
import { Stock } from '../lib/types';

interface StockTableProps {
  stocks: Stock[];
}

const StockTable: React.FC<StockTableProps> = ({ stocks = [] }) => {
  const safeStocks = Array.isArray(stocks) ? stocks : [];

  if (safeStocks.length === 0) {
    return <div>No stocks to display</div>;
  }

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Stock Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer">
              Market Cap
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer">
              P/E Ratio
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer">
              ROE
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer">
              Debt/Equity
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer">
              Div Yield
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer">
              Revenue Growth
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {safeStocks.map((stock, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{stock['Stock Name']}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{stock['Market Capitalization']?.toLocaleString() || 'N/A'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{stock['P/E Ratio']?.toFixed(2) || 'N/A'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{stock['ROE']?.toFixed(2)}%</td>
              <td className="px-6 py-4 text-sm text-gray-600">{stock['Debt/Equity Ratio']?.toFixed(2) || 'N/A'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{stock['Dividend Yield']?.toFixed(2)}%</td>
              <td className="px-6 py-4 text-sm text-gray-600">{stock['Revenue Growth']?.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
