import { useState, useCallback } from 'react';
import { DogData, SearchResult } from '../types';

type FetchDogDataReturnType = {
  isLoading: boolean;
  error: string | null;
  dogData: DogData[];         // Array of dog data objects
  fetchDogData: (searchParams: URLSearchParams) => Promise<void>;
  searchData: SearchResult | null; // Search result data containing dog IDs and pagination info
};

const useFetchDogData = (): FetchDogDataReturnType => {
  const [searchData, setSearchData] = useState<SearchResult | null>(null);
  const [dogData, setDogData] = useState<DogData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDogData = useCallback(async (searchParams: URLSearchParams) => {
    setIsLoading(true);
    setError(null);

    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/dogs/search?`;

    // If no breeds are provided, default to Affenpinscher
    if (!searchParams.has('breeds')) {
      searchParams.append('breeds', 'Affenpinscher');
    }

    // Construct the query string from the searchParams
    searchParams.forEach((value, key) => {
      url += `${key}=${value}&`;
    });

    // Remove the trailing '&' at the end of the URL
    url = url.slice(0, -1);

    try {
      // Fetch the search data using the constructed URL
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to execute search fetch!');
      }

      const data: SearchResult = await response.json();
      setSearchData(data);

      // Fetch the dog data based on the returned IDs
      const dogResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'fetch-api-key': process.env.REACT_APP_API_KEY as string,
        },
        credentials: 'include',
        body: JSON.stringify(data.resultIds),
      });

      if (!dogResponse.ok) {
        throw new Error('Failed to fetch dogs!');
      }

      const dogData: DogData[] = await dogResponse.json();
      setDogData(dogData);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    dogData,
    fetchDogData,
    searchData,
  };
};

export default useFetchDogData;
