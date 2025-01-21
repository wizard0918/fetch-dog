'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Button,
  CircularProgress,
} from '@mui/material';
import { AccountCircleOutlined, EmailOutlined } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Auth from './services/auth';
import { FormState, ErrorState } from './types';

/**
 * Login component for user authentication
 * Handles form validation, submission, and error display.
 */
export default function Login() {
  const router = useRouter();

  // Local state to manage form inputs, error states, and loading state
  const [formState, setFormState] = useState<FormState>({ name: '', email: '' });
  const [errorState, setErrorState] = useState<ErrorState>({ nameError: false, emailError: false });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Loading state to show progress

  // Check if the user is already logged in and redirect if true
  useEffect(() => {
    const user = Auth.getUser();
    if (user) {
      router.push('/dogs');
    }
  }, [router]);

  // Handle input change and reset the respective error state
  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrorState((prev) => ({ ...prev, [`${name}Error`]: false }));
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Validates the name input to ensure it is not empty.
   * @returns {boolean} Returns true if valid, false if invalid.
   */
  const validateName = (): boolean => {
    if (formState.name.trim() === '') {
      setErrorState((prev) => ({ ...prev, nameError: true }));
      return false;
    }
    return true;
  };

  /**
   * Validates the email input using a regex pattern.
   * @returns {boolean} Returns true if valid, false if invalid.
   */
  const validateEmail = (): boolean => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (!formState.email.match(emailPattern)) {
      setErrorState((prev) => ({ ...prev, emailError: true }));
      return false;
    }
    return true;
  };

  /**
   * Handles form submission, validates fields, and makes the API call for login.
   * @param e The form submission event.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate name and email before proceeding with submission
    const isNameValid = validateName();
    const isEmailValid = validateEmail();

    // If either field is invalid, show error message and prevent form submission
    if (!isNameValid || !isEmailValid) {
      setErrorMsg('Please complete both fields before submitting');
      return;
    }

    // Start loading state
    setLoading(true);

    // Attempt to authenticate the user by calling the API
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(formState),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        // Store the user session and redirect
        Auth.login(formState);
        router.push('/dogs');
      } else {
        setErrorMsg('Failed to login. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f4f9',
        padding: '2rem',
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          textAlign: 'center',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
        }}
      >
        <Box
          component="img"
          src="/images/logo.png"
          alt="Fetch Logo"
          sx={{ width: '150px', margin: '0 auto 1.5rem' }}
        />
        <Typography
          variant="h4"
          component="h1"
          sx={{ marginBottom: '1.5rem', color: '#6504b5', fontWeight: 'bold' }}
        >
          Dog Lover Search
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <FormControl variant="standard" sx={{ width: '100%' }}>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input
              id="name"
              name="name"
              value={formState.name}
              error={errorState.nameError}
              onChange={inputChangeHandler}
              onBlur={validateName}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircleOutlined />
                </InputAdornment>
              }
            />
            {errorState.nameError && (
              <Typography variant="caption" color="error">
                Name cannot be empty
              </Typography>
            )}
          </FormControl>

          <FormControl variant="standard" sx={{ width: '100%' }}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              id="email"
              name="email"
              type="email"
              value={formState.email}
              error={errorState.emailError}
              onChange={inputChangeHandler}
              onBlur={validateEmail}
              startAdornment={
                <InputAdornment position="start">
                  <EmailOutlined />
                </InputAdornment>
              }
            />
            {errorState.emailError && (
              <Typography variant="caption" color="error">
                Please enter a valid email address
              </Typography>
            )}
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            sx={{
              marginTop: '1rem',
              backgroundColor: '#6504b5',
              color: '#ffffff',
              border: 'solid 1px #6504b5',
              '&:hover': { backgroundColor: '#ffffff', color: '#6504b5', borderColor: '#6504b5' },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>

          {errorMsg && (
            <Typography variant="body2" color="error" sx={{ marginTop: '1rem' }}>
              {errorMsg}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
}
