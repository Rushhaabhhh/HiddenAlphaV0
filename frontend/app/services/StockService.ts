import { Stock } from '../lib/types';

const BASE_URL = 'http://localhost:8080';

export async function fetchStocks(): Promise<Stock[]> {
  try {
    const response = await fetch(`${BASE_URL}/stocks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fetch stocks error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Fetched stocks:', data);
    return data;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
}

export async function filterStocks(query: string): Promise<Stock[]> {
  try {
    const response = await fetch(`${BASE_URL}/filter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Filter stocks error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Filtered stocks:', data);
    return data;
  } catch (error) {
    console.error('Error filtering stocks:', error);
    throw error;
  }
}
