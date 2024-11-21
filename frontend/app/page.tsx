import { fetchStocks, filterStocks } from './services/StockService';
import StockTable from './components/StockTable';
import StockFilter from './components/StockFilter';
import Navbar from './components/Navbar';
import { Stock } from './lib/types';

export const dynamic = 'force-dynamic'; 

export default async function Home({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const query = searchParams?.query || '';
  let stocks: Stock[] | null = null; 
  try {
    stocks = query ? await filterStocks(query) : await fetchStocks();
  } catch (error) {
    console.error('Error fetching stocks:', error);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-4xl text-gray-800 text-center font-bold mb-4">
          Stock Screener
        </h1>
        <StockFilter currentQuery={query} />
        {stocks === null ? (
          <div className="text-center text-red-500">
            Failed to fetch stocks. Please try again later.
          </div>
        ) : stocks.length === 0 ? (
          <div className="text-center text-gray-600">No stocks found for the given query.</div>
        ) : (
          <StockTable stocks={stocks} />
        )}
      </main>
    </div>
  );
}
