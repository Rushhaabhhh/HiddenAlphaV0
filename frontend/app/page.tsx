'use client';

import React, { useState, useEffect } from 'react';
import { fetchStocks } from '../app/services/StockService';
import StockTable from '../app/components/StockTable';
import StockFilter from '../app/components/StockFilter';
import Navbar from '../app/components/Navbar';
import { Stock } from './lib/types';

export default function Home() {
  const [stocks, setStocks] = useState<Stock[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStocks = async () => {
      try {
        setIsLoading(true);
        const fetchedStocks = await fetchStocks();
        setStocks(Array.isArray(fetchedStocks) ? fetchedStocks : []);
        setError(null);
      } catch (error) {
        console.error('Error loading stocks', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setStocks(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadStocks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <div className="w-8 h-8 bg-blue-900 rounded-full animate-pulse"></div>
        <span>Loading stocks...</span>
      </div>
    );
  }
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-4xl text-gray-800 text-center font-bold mb-4">Stock Screener</h1>
        <StockFilter 
          onFilteredStocks={(filteredStocks) => setStocks(filteredStocks)} 
        />
        {stocks === null || stocks.length === 0 ? (
        <div>No stocks found</div>
      ) : (
        <StockTable stocks={stocks} />
        )}
      </main>
    </div>
  );
};

