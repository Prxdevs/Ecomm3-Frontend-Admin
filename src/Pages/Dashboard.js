// AdminDashboard.js
import React from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

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
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} mt={4}>
          <Link as={RouterLink} to="/products" fontSize="lg" p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
            Manage Products
          </Link>

          <Link as={RouterLink} to="/users" fontSize="lg" p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
            Manage Users
          </Link>

          <Link as={RouterLink} to="/orders" fontSize="lg" p={4} borderWidth="1px" borderRadius="md" boxShadow="sm">
            View Orders
          </Link>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
