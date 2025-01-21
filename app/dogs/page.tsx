'use client';

import { Box, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Main from '../components/Main';
import SearchBar from '../components/SearchBar';
import useFetchDogData from '../hooks/useFetchDogData';
import DogCardSkeleton from '../components/DogCardSkeleton';
import MatchModal from '../components/MatchModal';

const Home = () => {
  // State management
  const { isLoading, error, dogData, fetchDogData, searchData } = useFetchDogData();
  const [favoritesList, setFavoritesList] = useState<string[]>([]);
  const [match, setMatch] = useState<any>();
  const [isMatchLoading, setIsMatchLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isNonMobile = useMediaQuery('(min-width: 580px)');

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      const params = new URLSearchParams(searchParams.toString());
      fetchDogData(params);
    }
  }, [fetchDogData, searchParams]);

  const updateSearchParams = (params: Record<string, string | number>) => {
    const stringParams: Record<string, string> = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    );

    const newParams = new URLSearchParams(stringParams);
    const newUrl = `${pathname}?${newParams.toString()}`;
    router.push(newUrl);
  };

  return (
    <>
    <Box sx={{ display: 'flex', flexDirection: isNonMobile ? 'row' : 'column', flex: '1 1 auto', textAlign: 'center', p: 1, gap: '1rem', backgroundColor: '#efeef1' }}>
      <SearchBar
        setFavoritesList={setFavoritesList}
        setIsMatchLoading={setIsMatchLoading}
        setSearchParams={updateSearchParams}
        setIsModalOpen={setIsModalOpen}
        setMatch={setMatch}
        favoritesList={favoritesList}
      />
      {isLoading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
            alignItems: "stretch",
            "@media (min-width: 768px)": {
              gap: "1.5rem",
            },
            marginTop: '10px',
            width: '100%'
          }}
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <DogCardSkeleton key={index} />
          ))}
        </Box>
      ) : error ? (
        <Typography component="p" variant="h6">
          {error}
        </Typography>
      ) : (
        <Main favoritesList={favoritesList} setFavoritesList={setFavoritesList} dogData={dogData} paginationData={searchData} />
      )}
    </Box>
    <MatchModal matchData={match} isMatchLoading={isMatchLoading} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
};

export default Home;
