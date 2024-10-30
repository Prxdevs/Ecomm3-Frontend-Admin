// AdminDashboard.js
import React from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <Box p={4}>
      <Heading mb={4}>Admin Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        <Stat>
          <StatLabel>Total Products</StatLabel>
          <StatNumber>100</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Total Users</StatLabel>
          <StatNumber>50</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Total Orders</StatLabel>
          <StatNumber>75</StatNumber>
        </Stat>
      </SimpleGrid>

      <Box mt={6}>
        <Heading size="md">Quick Actions</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mt={4}>
          <Link to="/category" fontSize="lg" p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
            Manage Categories
          </Link>
          
          <Link to="/products" fontSize="lg" p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
            Manage Products
          </Link>

          <Link to="/users" fontSize="lg" p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
            Manage Users
          </Link>

          <Link to="/orders" fontSize="lg" p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
            View Orders
          </Link>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
