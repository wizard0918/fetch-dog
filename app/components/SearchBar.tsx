import React, { useEffect, useState, FormEvent } from 'react';
import {
  useMediaQuery,
  Box,
  Divider,
  Typography,
  FormControl,
  Input,
  InputLabel,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  OutlinedInput,
} from '@mui/material';
import AgeSlider from './AgeSlider'; 
import { SearchTerms, DogData } from '../types';

interface SearchBarProps {
  setFavoritesList: React.Dispatch<React.SetStateAction<string[]>>;
  setSearchParams: (params: Record<string, string | number>) => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMatch: React.Dispatch<React.SetStateAction<DogData | undefined>>;
  favoritesList: string[];
  setIsMatchLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const resultsPaginationNumber = [5, 10, 15, 20, 25];
const sortInfo = [
  { label: 'Ascending by age', value: 'age:asc' },
  { label: 'Descending by age', value: 'age:desc' },
  { label: 'Ascending by name', value: 'name:asc' },
  { label: 'Descending by name', value: 'name:desc' },
  { label: 'Ascending by breed', value: 'breed:asc' },
  { label: 'Descending by breed', value: 'breed:desc' },
];

let breedList: string[] | undefined;

const SearchBar: React.FC<SearchBarProps> = ({
  setFavoritesList,
  setSearchParams,
  setIsModalOpen,
  setMatch,
  favoritesList,
  setIsMatchLoading,
}) => {
  const [error, setError] = useState(false);
  const [matchError, setMatchError] = useState<{ bool: boolean; message: string }>({ bool: false, message: '' });
  const [searchTerms, setSearchTerms] = useState<SearchTerms>({
    breeds: '',
    zipCodes: '',
    ageMin: 0,
    ageMax: 20,
    size: '',
    sort: '',
  });
  const isNonMobile = useMediaQuery('(min-width: 580px)');

  useEffect(() => {
    const fetchBreedList = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dogs/breeds`, {
          method: 'GET',
          credentials: 'include',
        });

        const data: string[] = await response.json();
        breedList = data;
      } catch (err) {
        console.error('Failed to fetch breed list:', err);
      }
    };

    fetchBreedList();
  }, []);

  const searchChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setSearchTerms((prev) => ({ ...prev, [name]: value }));
    }
  };
  

  const searchSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    if (searchTerms.zipCodes.trim().length !== 5 && searchTerms.zipCodes.trim().length > 0) {
      setError(true);
      return;
    }

    const searchParams = Object.entries(searchTerms)
      .filter(([, value]) => value !== '')
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, string | number>);
    setSearchParams(searchParams);
  };

  const matchSubmitHandler = async () => {
    if (favoritesList.length === 0) {
      setMatchError({ bool: true, message: 'Please favorite at least one dog before being matched!' });
      return;
    }

    setMatchError({ bool: false, message: '' });
    setIsMatchLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dogs/match`, {
        method: 'POST',
        body: JSON.stringify(favoritesList),
        headers: {
          'fetch-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to execute match fetch!');
      }

      const data: { match: string } = await response.json();

      const matchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify([data.match]),
      });

      if (!matchResponse.ok) {
        throw new Error('Failed to fetch matched dog data!');
      }

      const matchData = await matchResponse.json();
      setMatch(matchData[0]);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setMatchError({ bool: true, message: (err as Error).message });
    }

    setIsMatchLoading(false);
  };

  const clearButtonHandler = () => {
    window.history.pushState({}, '', '/dogs');
    setSearchTerms({
      breeds: '',
      zipCodes: '',
      ageMin: 0,
      ageMax: 20,
      size: '',
      sort: '',
    });
  };

  return (
    <Box
      component="aside"
      sx={{
        top: isNonMobile ? '0' : 'auto',
        width: isNonMobile ? '350px' : '100%',
        height: isNonMobile ? '700px' : 'auto',
        border: '1px solid #6504b5',
        backgroundColor: '#fff',
        borderRadius: '10px',
        p: 1,
        marginTop: isNonMobile ? "10px" : '0px'
      }}
    >
      <Typography variant="h5" color="#6504b5">
        Search
      </Typography>
      <Box
        component="form"
        onSubmit={searchSubmitHandler}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', mt: 3 }}
      >
        <FormControl fullWidth>
          <InputLabel htmlFor="breeds">Breeds</InputLabel>
          <Select
            name="breeds"
            value={searchTerms.breeds}
            onChange={searchChangeHandler}
            labelId="breeds"
            input={<OutlinedInput label="breeds" />}
            sx={{
              color: "#6504b5",
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: '#6504b5',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6504b5',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6504b5',
              },
              '.MuiSvgIcon-root ': {
                fill: "#6504b5' !important",
              },
            }}
          >
            {breedList?.map((breed, index) => (
              <MenuItem key={`${breed}-${index}`} value={breed}>
                {breed}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel htmlFor="zipCodes">Zip Code</InputLabel>
          <Input
            id="zipCodes"
            name="zipCodes"
            value={searchTerms.zipCodes}
            onChange={searchChangeHandler}
            type="number"
          />
          {error && <Typography color="error">Zip Code must be exactly 5 digits</Typography>}
        </FormControl>
        <Box sx={{ mt: 1, width: '100%', backgroundColor: 'white', p: 1}}>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', textAlign: 'left', paddingLeft: '5px' }}>Age Range</Typography>
          <AgeSlider value={[searchTerms.ageMin, searchTerms.ageMax]} setSearchTerms={setSearchTerms} />
        </Box>
        <FormControl fullWidth>
          <InputLabel htmlFor="size">Items per page</InputLabel>
          <Select
            name="size"
            value={searchTerms.size}
            onChange={searchChangeHandler}
            labelId="size"
            input={<OutlinedInput label="Items per page" />}
            sx={{
              color: "#6504b5",
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: '#6504b5',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6504b5',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6504b5',
              },
              '.MuiSvgIcon-root ': {
                fill: "#6504b5' !important",
              },
            }}
          >
            {resultsPaginationNumber.map(number => (
              <MenuItem key={number} value={number}>
                {number}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel htmlFor="sort">Sort By</InputLabel>
          <Select
            name="sort"
            value={searchTerms.sort}
            onChange={searchChangeHandler}
            labelId="sort"
            input={<OutlinedInput label="Sort By" />}
            sx={{
              color: "#6504b5",
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: '#6504b5',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6504b5',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6504b5',
              },
              '.MuiSvgIcon-root ': {
                fill: "#6504b5' !important",
              },
            }}
          >
            {sortInfo.map(sortItem => (
              <MenuItem key={sortItem.value} value={sortItem.value}>
                {sortItem.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', flexDirection: isNonMobile ? 'column' : 'row', gap: '1rem', marginTop: '1rem', width: '100%' }}>
          <Button type="submit" variant="contained" sx={{ backgroundColor: '#6504b5', color: '#fff', '&:hover': { backgroundColor: "#520394", } }}>
            Search
          </Button>
          <Button onClick={clearButtonHandler} variant="outlined" sx={{ color: '#6504b5', borderColor: '#6504b5' }}>
            Clear Search
          </Button>
        </Box>
        <Divider sx={{ my: 0.3 }} />
        <Box sx={{ display: 'flex', flexDirection: isNonMobile ? 'column' : 'row', gap: '1rem', width: '100%' }}>
          <Button
            onClick={matchSubmitHandler}
            variant="contained"
            sx={{ backgroundColor: '#6504b5', color: '#fff', '&:hover': { backgroundColor: "#520394", } }}
          >
            Find Match
          </Button>
          {matchError.bool && <Typography color="error">{matchError.message}</Typography>}
          <Button
            onClick={() => setFavoritesList([])}
            variant="outlined"
            sx={{ color: '#6504b5', borderColor: '#6504b5' }}
          >
            Clear Favorites
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchBar;
