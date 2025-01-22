'use client';

import { Box, Typography, Pagination } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DogCard from './DogCard';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { DogData } from '../types';

interface PaginationData {
  total?: number;
  prev?: string;
  next?: string;
}

interface MainProps {
  favoritesList: string[];
  setFavoritesList: React.Dispatch<React.SetStateAction<string[]>>;
  dogData: DogData[];
  paginationData: PaginationData | null;
}

const Main: React.FC<MainProps> = ({ favoritesList, setFavoritesList, dogData, paginationData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Manually convert searchParams to an object
  const searchParamsObject = Array.from(searchParams).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const totalPages = Math.ceil((paginationData?.total || 0) / (+searchParamsObject['size']! || 25));
  // Logic in useEffect to handle page changes and button disabling
  useEffect(() => {
    const from = +searchParamsObject['from']! || 0;
    const size = +searchParamsObject['size']! || 25;

    setCurrentPage(Math.floor(from / size) + 1);
  }, [searchParams]);

  // Logic to change pages with pagination
  const changePageHandler = (event: React.ChangeEvent<unknown>, value: number) => {
    const size = +searchParamsObject['size']! || 25;
    const from = (value - 1) * size;

    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set('from', from.toString());
    router.push(`${pathname}?${updatedSearchParams.toString()}`);
  };

  return (
    <Box width="100%" component="main">
      {dogData.length === 0 ? (
        <Typography sx={{ marginInline: 'auto' }}>
          There are no dogs that match your search terms
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem',
              alignItems: 'stretch',
              '@media (min-width: 768px)': {
                gap: '1.5rem',
              },
              marginTop: '10px',
            }}
          >
            {dogData.map((data) => (
              <DogCard
                key={data.id}
                dogData={data}
                favoritesList={favoritesList}
                setFavoritesList={setFavoritesList}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ marginRight: '10px' }}>
              Page {currentPage} of {totalPages}
            </Typography>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={changePageHandler}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#6504b5',
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  backgroundColor: '#6504b5',
                  color: 'white',
                },
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Main;
