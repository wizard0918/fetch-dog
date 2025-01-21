'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress'; // Import the loading spinner
import Auth from '../services/auth';

const Header: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Loading state

  // Logout user with backend and execute logout method to remove items from local storage
  const logoutHandler = async () => {
    setLoading(true); // Set loading to true when logout starts
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      Auth.logout();
      router.push('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // Set loading to false when logout completes
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' sx={{ backgroundColor: '#6504b5' }}>
        <Toolbar>
          <Box component='div' sx={{ flexGrow: 1 }}>
            <Box component='img' src="/images/logo-2.png" width='50px' borderRadius='10px'></Box>
          </Box>
          <Button 
            onClick={logoutHandler} 
            sx={{
              height: '45px',
              padding: '11px 30px',
              border: '2px solid #6504b5',
              borderRadius: '23px',
              boxShadow: '0 1px 3px rgba(77,71,81,.2)',
              color: '#fff',
              fontSize: '14px',
              lineHeight: 1.4,
              transition: 'background-color .1s, border-color .1s, box-shadow .1s, color .1s, -webkit-box-shadow .1s',
              borderColor: '#fff',
              backgroundColor: 'transparent',
              textShadow: '0 1px 3px rgba(77,71,81,.3)',
              fontFamily: 'Nexa Heavy, arial, helvetica, sans-serif',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#ffffff',
                borderColor: '#6504b5',
                color: '#6504b5'
              },
            }}
            disabled={loading}
            className="cursor-pointer overflow-hidden inline-block box-border"
          >
            {loading ? <CircularProgress size={24} /> : 'Logout'}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
