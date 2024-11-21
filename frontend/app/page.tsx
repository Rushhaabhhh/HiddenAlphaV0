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
  let stocks: Stock[] = [];

  try {
    // Fetch stocks or filter based on the query
    stocks = query ? await filterStocks(query) : await fetchStocks();
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto p-4">
          <h1 className="text-4xl text-gray-800 text-center font-bold mb-4">
            Stock Screener
          </h1>
          <div className="text-red-500">Failed to fetch stocks: {`${error}`}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-4xl text-gray-800 text-center font-bold mb-4">
          Stock Screener
        </h1>
        {/* Pass stocks as props to avoid mismatched states */}
        <StockFilter initialQuery={query} />
        {stocks.length === 0 ? (
          <div className="text-center text-gray-600">No stocks found for the given query.</div>
        ) : (
          <StockTable stocks={stocks} />
        )}
      </main>
    </div>
  );
}
