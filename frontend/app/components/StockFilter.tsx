'use client';

import React, { useState } from 'react';
import { Stock } from '../lib/types';
import { filterStocks } from '../services/StockService';

interface StockFilterProps {
  initialQuery: string; // Use deterministic data from server
}

const StockFilter: React.FC<StockFilterProps> = ({ initialQuery }) => {
  const [query, setQuery] = useState(initialQuery);
  const [filteredStocks, setFilteredStocks] = useState<Stock[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const stocks = await filterStocks(query);
      setFilteredStocks(stocks);
    } catch (error) {
      console.error('Error filtering stocks', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex space-x-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter filter query (e.g. ROE > 10 AND Market Capitalization >= 300)"
        className="flex-grow px-4 py-2 border rounded-lg focus:outline-none text-gray-800 focus:ring-2 focus:ring-blue-600"
      />
      <button
        type="submit"
        className="px-5 py-2 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 focus:outline-none"
      >
        Filter
      </button>
    </form>
  );
};

export default StockFilter;
