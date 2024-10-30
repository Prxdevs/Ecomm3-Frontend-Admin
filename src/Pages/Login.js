// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChakraProvider, Container, Heading, Box, Input, Button } from '@chakra-ui/react';
import axios from 'axios';


const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      // Assuming email and password are already defined or retrieved from some input fields
      // const email = 'your';
      // const password = 'your';

      // Make the API call to the login endpoint
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      },
        { withCredentials: true }
      );

      // Check if the login was successful based on the API response
      if (response.data.message === 'Login successful') {
        // Call onLogin(true) if authentication is successful
        onLogin(true);
        navigate('/dashboard');
      } else {
        // Handle unsuccessful login (show error message, etc.)
        console.error('Login failed:', response.data.message);
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error('Error during login:', error.message);
    }
  };

  return (

    <Container maxW="container.md" centerContent>
      <Box mt="10">
        <Heading mb="4">Admin Login</Heading>
        <Input
          placeholder="Email"
          mb="4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          mb="4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleLogin}>
          Login
        </Button>
      </Box>
    </Container>

  );
};

export default Login;
