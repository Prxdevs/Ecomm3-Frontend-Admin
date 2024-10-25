// ProductPage.js
import React, { useState, useEffect } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, Image, HStack, VStack, IconButton, ButtonGroup, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Stack, FormControl, FormLabel, Input, Select, Text } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import axios from 'axios';
import { getAllCategories, getAllProducts } from '../actions/apiActions';

const ProductPage = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    tags: [], // Initialize as an empty array
    variants: [],
    images: []
  });

  const fetchCategories = async () => {
    try {
      // const response = await axios.get('http://localhost:4000/admin/category', {
      //   withCredentials: true,
      // });
      const response = await getAllCategories();
      setCategories(response);
      console.log('Categories:', response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const urls = files.map((file) => URL.createObjectURL(file));
    setImageList((prevImages) => [...prevImages, ...urls]);

    // Use functional update to correctly update the image array
    setFormData((prevFormData) => ({ ...prevFormData, image: [...(prevFormData.image || []), ...files] }));

    // Log the values directly from state
    console.log('imageList:', [...imageList, ...urls]);
    console.log('formData:', { ...formData, image: [...(formData.image || []), ...files] });
  };



  const removeImage = (index) => {
    const newImageList = [...imageList];
    newImageList.splice(index, 1);
    setImageList(newImageList);

    const newFiles = [...formData.image];
    newFiles.splice(index, 1);
    setFormData({ ...formData, image: newFiles });
  };

  const openEditModal = (product) => {
    setEditModalOpen(true);
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      rating: product.rating,
      price: product.price,
      description: product.description,
      stocks: product.stocks,
      tag: product.tag,
      sizes: product.sizes,
      image: null, // Since you don't want to display the image in edit mode
    });
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataForBackend = new FormData();
      for (const key in formData) {
        formDataForBackend.append(key, formData[key]);
      }
      console.log('FormData for Backend:', formDataForBackend);

      const response = await axios.put(
        `http://localhost:4000/admin/updateproduct/${selectedProduct._id}`,
        formDataForBackend,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Response:', response.data); // Check the response

      // After successful submission, close the modal and fetch updated product list
      closeEditModal();
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      // Handle the error, e.g., show an error message
    }
  };



  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const response = await getAllProducts();
      setProducts(response);
      console.log(response)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);





  const openAddModal = () => {
    setAddModalOpen(true);
    // Clear the form data when opening the add modal
    setFormData({
      name: '',
      category: '',
      rating: '',
      price: '',
      description: '',
      stocks: '',
      tag: '',
      sizes: '',
      colors: '',
      gender: '',
      image: '',
    });
  };


  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataForBackend = new FormData();
      for (const key in formData) {
        if (key === 'image') {
          // Append each image separately to the FormData
          formData[key].forEach((image) => {
            formDataForBackend.append('image', image);
          });
        } else {
          formDataForBackend.append(key, formData[key]);
        }
      }
      console.log('FormData for Backend:', formDataForBackend);
      const response = await axios.post('http://localhost:4000/admin/addproduct', formDataForBackend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data); // You can handle the response as needed

      // After successful submission, close the modal and fetch updated product list
      closeAddModal();
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      // Handle the error, e.g., show an error message
    }
  };

  const handleProductDelete = async (productId) => {
    try {
      const response = await fetch(`http://localhost:4000/admin/deleteproduct/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Product deleted successfully
        setProducts(products.filter(product => product._id !== productId));
      } else {
        const data = await response.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Product Management</Heading>
      <Button color={'blueviolet'} onClick={() => openAddModal()}><EditIcon />Add Product</Button>

      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Preview</Th>
              <Th>Category</Th>
              <Th>tag</Th>
              <Th>Price</Th>
              {/* <Th>Availble Sizes</Th>
              <Th>Stock</Th>
              <Th>Gender</Th>
              <Th>Colors</Th> */}
              <Th>Function</Th>

              {/* Add more columns as needed */}
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product) => (
              <Tr key={product._id}>
                <Td>{product.name}</Td>
                <Td><Image borderRadius={5} src={`http://localhost:5000/uploads${product.images[0]}`} height={'60px'} width={'80px'} /></Td>
                <Td>{product.category.name}</Td>
                <Td>{product.tags.join(', ')}</Td>
                <Td>
                  {product.variants.map((variant) => (
                    <div key={variant._id}>
                      Color: {variant.color}, Price: ₹{variant.price}
                    </div>
                  ))}
                </Td>
                {/* <Td>{product.sizes}</Td> */}
                {/* <Td>{product.stocks}</Td> */}
                {/* <Th>{product.gender}</Th> */}
                {/* <Th>{product.colors}</Th> */}
                <Td>
                  <ButtonGroup>
                    <Button color={'blueviolet'} onClick={() => openEditModal(product)}><EditIcon /></Button>
                    <Button color={'red'} onClick={() => handleProductDelete(product._id)}><DeleteIcon /></Button>
                  </ButtonGroup>
                </Td>
                {/* Add more columns as needed */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}



      {/* Add Modal */}
      {isAddModalOpen && (
        <Modal isOpen={isAddModalOpen} onClose={closeAddModal}>
          <ModalOverlay />
          <ModalContent width="50%">
            <ModalHeader>Add Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleAddSubmit}>
                <Stack spacing={4}>
                  {/* Add input fields for adding product details */}
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  {/* <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </FormControl> */}

                  <FormControl>
                    <FormLabel>Rating</FormLabel>
                    <Input
                      type="text"
                      name="rating"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Price</FormLabel>
                    <Input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Stocks</FormLabel>
                    <Input
                      type="text"
                      name="stocks"
                      value={formData.stocks}
                      onChange={(e) => setFormData({ ...formData, stocks: e.target.value })}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Tag</FormLabel>
                    <Input
                      type="text"
                      name="tag"
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Sizes</FormLabel>
                    <Input
                      type="text"
                      name="sizes"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Colors</FormLabel>
                    <Input
                      type="text"
                      name="colors"
                      value={formData.colors}
                      onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Gender</FormLabel>
                    <Input
                      type="text"
                      name="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    />
                  </FormControl>



                  <FormControl>
                    <FormLabel>Images</FormLabel>
                    <Input type="file" name="image" onChange={handleImageChange} multiple />
                  </FormControl>

                  <HStack spacing={4} mt={4}>
                    {imageList.map((image, index) => (
                      <VStack key={index} spacing={3}>
                        <Image src={image} boxSize="70px" objectFit="cover" borderRadius="lg" />
                        <IconButton
                          size="xs"
                          variant="outline"
                          colorScheme="red"
                          icon={<DeleteIcon />}
                          onClick={() => removeImage(index)}
                        />
                      </VStack>
                    ))}
                  </HStack>

                  <Button type="submit">Add Product</Button>
                </Stack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/* Edit Modal */}
      {/* Edit Modal */}
      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
          <ModalOverlay />
          <ModalContent width="50%">
            <ModalHeader>Edit Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleEditSubmit}>
                <Stack spacing={4}>
                  {/* Product Name */}
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </FormControl>

                  {/* Product Category */}
                  <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Product Description */}
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </FormControl>

                  {/* Product Tags */}
                  <FormControl>
                    <FormLabel>Tags</FormLabel>
                    <Input
                      type="text"
                      name="tags"
                      value={formData.tags ? formData.tags.join(', ') : ''} // Check if tags is defined
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                    />
                  </FormControl>


                  {/* Variants - Colors, Prices, and Stocks */}
                  {formData.variants.map((variant, index) => (
                    <Box key={variant._id} borderWidth="1px" borderRadius="lg" padding="4" mb="4">
                      <Text fontWeight="bold">Variant {index + 1}</Text>

                     
                      <FormControl>
                        <FormLabel>Color</FormLabel>
                        <Input
                          type="text"
                          value={variant.color}
                          // onChange={(e) => {
                          //   const updatedVariants = [...formData.variants];
                          //   updatedVariants[index].color = e.target.value;
                          //   setFormData({ ...formData, variants: updatedVariants });
                          // }}
                        />
                      </FormControl>

                     
                      <FormControl>
                        <FormLabel>Price</FormLabel>
                        <Input
                          type="number"
                          value={variant.price}
                          // onChange={(e) => {
                          //   const updatedVariants = [...formData.variants];
                          //   updatedVariants[index].price = e.target.value;
                          //   setFormData({ ...formData, variants: updatedVariants });
                          // }}
                        />
                      </FormControl>

                    
                      <FormControl>
                        <FormLabel>Stock</FormLabel>
                        <Input
                          type="number"
                          value={variant.stock}
                          // onChange={(e) => {
                          //   const updatedVariants = [...formData.variants];
                          //   updatedVariants[index].stock = e.target.value;
                          //   setFormData({ ...formData, variants: updatedVariants });
                          // }}
                        />
                      </FormControl>
                    </Box>
                  ))}

                  {/* Image Upload */}
                  <FormControl>
                    <FormLabel>Images</FormLabel>
                    <Input
                      type="file"
                      name="image"
                      multiple // Allow multiple file uploads
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setFormData({ ...formData, images: files });
                      }}
                    />
                    {/* <Text fontSize="sm" color="gray.500">Current Images: {formData.images.join(', ')}</Text> */}
                  </FormControl>

                  {/* Submit Button */}
                  <Button type="submit">Update Product</Button>
                </Stack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}





    </Box>
  );
};

export default ProductPage;
