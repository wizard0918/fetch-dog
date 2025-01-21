import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { SearchTerms } from '../types';

interface AgeSliderProps {
  value: [number, number];
  setSearchTerms: React.Dispatch<React.SetStateAction<SearchTerms>>;
}

const valuetext = (value: number): string => {
  return `${value} year(s) old`;
};

const AgeSlider: React.FC<AgeSliderProps> = ({ value, setSearchTerms }) => {
  const handleChange = (event: Event, newValue: number | number[]): void => {
    if (Array.isArray(newValue)) {
      setSearchTerms(prev => ({ ...prev, ageMin: newValue[0], ageMax: newValue[1] }));
    }
  };

  return (
    <Box>
      <Slider
        sx={{ color: '#6504b5' }}
        min={0}
        max={20}
        getAriaLabel={() => 'Age range'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay='auto'
        getAriaValueText={valuetext}
      />
    </Box>
  );
};

export default AgeSlider;
