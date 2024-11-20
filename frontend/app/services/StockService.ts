import { Stock } from '../lib/types';

const BASE_URL = 'https://hiddenalphav0-1.onrender.com';

export async function fetchStocks(acceptHtml: boolean = false): Promise<Stock[] | string> {
  try {
    const response = await fetch(`${BASE_URL}/stocks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html',
        'Accept': acceptHtml ? 'text/html' : 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fetch stocks error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('text/html')) {
      const html = await response.text();
      console.log('Fetched HTML stocks:', html);
      return html;
    }

    const data = await response.json();
    console.log('Fetched JSON stocks:', data);
    return data;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
}

export async function filterStocks(query: string, acceptHtml: boolean = false): Promise<Stock[] | string> {
  try {
    const response = await fetch(`${BASE_URL}/filter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/html',
        'Accept': acceptHtml ? 'text/html' : 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Filter stocks error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('text/html')) {
      const html = await response.text();
      console.log('Filtered HTML stocks:', html);
      return html;
    }

    const data = await response.json();
    console.log('Filtered JSON stocks:', data);
    return data;
  } catch (error) {
    console.error('Error filtering stocks:', error);
    throw error;
  }
}
