// ordersPage.js
import React, { useState, useEffect } from 'react';
import { Select ,Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner ,Image, ButtonGroup, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Stack, FormControl, FormLabel, Input} from '@chakra-ui/react';
import { EditIcon,DeleteIcon} from '@chakra-ui/icons'
import axios from 'axios';

// ... (import statements remain unchanged)

const OrdersPage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [productDetails, setProductDetails] = useState({});

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3999/orders/get-all-orders', {
        withCredentials: true,
      });
      setOrders(response.data.orders);
      console.log(orders)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const getProductDetailsById = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:3999/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  };

  const fetchProductDetails = async () => {
    try {
      const uniqueProductIds = Array.from(
        new Set(
          orders
            .flatMap((order) => order.products.map((product) => product.productId))
        )
      );

      const productDetailsMap = {};

      await Promise.all(
        uniqueProductIds.map(async (productId) => {
          const productDetails = await getProductDetailsById(productId);
          if (productDetails) {
            productDetailsMap[productId] = productDetails;
          }
        })
      );

      setProductDetails(productDetailsMap);
      console.log(productDetails)
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      fetchProductDetails();
    }
  }, [orders]);

  return (
    <Box p={4}>
    <Heading mb={4}>Orders Management</Heading>

    {loading ? (
      <Spinner size="xl" />
    ) : (
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Customer Email</Th>
            <Th>Product</Th>
            {/* <Th>Product Rate</Th> */}
            <Th>Quantity</Th>
            <Th>Total Amount</Th>
            <Th>Order Date</Th>
            <Th>Payment Method</Th>
            <Th>Payment Status</Th>
            <Th>Payment Id</Th>
            <Th>Order Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <Tr key={order._id}>
              <Td>{order.user && order.user.length > 0 ? `${(order.user[0].email).slice(0, 9)}...` : 'N/A'}</Td>
              <Td>
                {order.products && order.products.length > 0 ? (
                  <ul>
                    {order.products.map((product) => (
                      <div key={product._id} style={{display:'flex'}}>
                        {productDetails[product.productId] ? (<>
                          <div>
                            <Image
                              src={`http://localhost:3999${productDetails[product.productId].image}`}
                              alt={productDetails[product.productId].name}
                              height={'60px'}
                              width={'80px'}
                              borderRadius={5}
                            />
                          </div>
                          <div style={{ marginLeft: '10px' }} >
                            <p style={{fontWeight:'bold'}}>{(productDetails[product.productId].name).slice(0,10)}...</p>
                            <p style={{color:'blue', marginTop:'3px'}}>₹{productDetails[product.productId].price}</p>
                            </div></>
                        ) : (
                          'Loading...'
                        )}
                      </div>
                    ))}
                  </ul>
                ) : (
                  'No products'
                )}
              </Td>
              
              <Td>
                {order.products && order.products.length > 0 ? (
                  <ul>
                    {order.products.map((product) => (
                      <div key={product._id}>
                        {product.quantity}
                      </div>
                    ))}
                  </ul>
                ) : (
                  'No Quntity'
                )}
              </Td>
              <Td>
                {order.totalAmount ? `${order.totalAmount}/-` : 'N/A'}
              </Td>
              <Td>
                {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
              </Td>
              <Td>
                {order.paymentmethod ? `${order.paymentmethod}/-` : 'N/A'}
              </Td>
              <Td>
                {order.paymentStatus ? `${order.paymentStatus}` : 'N/A'}
              </Td>
              <Td>
              {order.paymentId ? `${order.paymentId.slice(0, 5)}...` : 'N/A'}
              </Td>
              <Td>
                {order.orderstatus ? `${order.orderstatus}` : 'N/A'}
              </Td>
              <Td>
                <ButtonGroup>
                    <Button color={'blueviolet'} ><EditIcon /></Button>
                    <Button color={'red'} ><DeleteIcon /></Button>
                </ButtonGroup>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    )}
  </Box>
  );
};

export default OrdersPage;

