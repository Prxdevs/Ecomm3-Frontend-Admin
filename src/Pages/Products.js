import React, { useState, useEffect } from 'react';
import {
  Box, Button, Table, Tbody, Td, Th, Thead, Tr, Image, ButtonGroup,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl,
  FormLabel, Input, Select, Stack
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { createProduct, deleteProduct, getAllCategories, getAllProducts, updateProduct } from '../actions/apiActions';

const ProductManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    tags: [],
    tagInput: '',
    variants: [{ color: '', price: '', stock: '' }],
    images: []
  });
  const [existingImages, setExistingImages] = useState([]); // Track existing images
  const [removedImages, setRemovedImages] = useState([]); // Track images to remove
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts(filter);
      setProducts(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null); // Clear editing state
    setNewProduct({
      name: '',
      category: '',
      price: '',
      description: '',
      tags: [],
      tagInput: '',
      variants: [{ color: '', price: '', stock: '' }],
      images: []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category._id,
      price: product.price,
      description: product.description,
      tags: product.tags,
      tagInput: '',
      variants: product.variants.map(v => ({ color: v.color, price: v.price, stock: v.stock })),
      images: product.images // URLs for display only
    });
    setExistingImages(product.images);
    setRemovedImages([]);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddTag = () => {
    if (newProduct.tagInput.trim()) {
      setNewProduct({
        ...newProduct,
        tags: [...newProduct.tags, newProduct.tagInput.trim()],
        tagInput: '',
      });
    }
  };

  const handleRemoveTag = (index) => {
    setNewProduct({
      ...newProduct,
      tags: newProduct.tags.filter((_, i) => i !== index),
    });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...newProduct.variants];
    newVariants[index][field] = value;
    setNewProduct({ ...newProduct, variants: newVariants });
  };

  const handleAddVariant = () => {
    setNewProduct({
      ...newProduct,
      variants: [...newProduct.variants, { color: '', price: '', stock: ''}],
    });
  };

  const handleRemoveVariant = (index) => {
    setNewProduct({
      ...newProduct,
      variants: newProduct.variants.filter((_, i) => i !== index),
    });
  };

  const handleRemoveExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    setRemovedImages([...removedImages, imageToRemove]); // Add to removed images
    setExistingImages(existingImages.filter((_, i) => i !== index)); // Update existing images
  };

  const handleFileChange = (e) => {
    setNewProduct({ ...newProduct, images: Array.from(e.target.files) });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const tagsArray = typeof newProduct.tags === 'string'
      ? newProduct.tags.split(',').map(tag => tag.trim())
      : newProduct.tags;

    // Append each field correctly
    formData.append('name', newProduct.name);
    formData.append('category', newProduct.category);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);

    // Convert tags and variants to JSON strings for consistent formatting
    formData.append('tags', JSON.stringify(tagsArray));
    formData.append('variants', JSON.stringify(newProduct.variants));

    // Append remaining existing images to the formData
    formData.append('existingImages', JSON.stringify(existingImages));

    // Append removed images to the formData for deletion
    formData.append('removedImages', JSON.stringify(removedImages));

    // Append new images added in this edit
    for (const image of newProduct.images) {
      formData.append('images', image);
    }

    try {
      if (editingProduct) {
        // Update product
        const response = await updateProduct(editingProduct._id, formData);
        console.log('Product updated successfully:', response);
      } else {
        // Add product
        const response = await createProduct(formData);
        console.log('Product added successfully:', response);
      }
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleChange = (event) => {
    const value = event.target.value === "all" ? "" : event.target.value;
    setFilter(value);
  };

  return (
    <Box p={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
        <h1>Product Management</h1>
        <Box display="flex" gap={2}>
          <Select onChange={handleChange} w={200}>
            <option value="" disabled>Select your category</option>
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
          <Button colorScheme="teal" size="md" onClick={openAddModal}>
            Add Product
          </Button>
        </Box>
      </Box>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Image</Th>
            <Th>Category</Th>
            <Th>Tags</Th>
            <Th>Variants</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product._id}>
              <Td>{product.name}</Td>
              <Td>
                <Image
                  borderRadius={5}
                  src={`${process.env.REACT_APP_API_URL}uploads${product.images[0]}`}
                  height="60px"
                  width="80px"
                  objectFit="contain"
                />
              </Td>
              <Td>{product.category.name}</Td>
              <Td>{product.tags.join(', ')}</Td>
              <Td>
                {product.variants.map((variant) => (
                  <div key={variant._id}>
                    Color: {variant.color}, Price: ₹{variant.price}, stock: {variant.stock}
                  </div>
                ))}
              </Td>
              <Td>
                <Button colorScheme="blue" onClick={() => openEditModal(product)}>
                  <EditIcon />
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingProduct ? "Edit Product" : "Add New Product"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmitProduct}>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input type="text" name="name" value={newProduct.name} onChange={handleInputChange} />
                </FormControl>

                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select name="category" value={newProduct.category} onChange={handleInputChange}>
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Price</FormLabel>
                  <Input type="text" name="price" value={newProduct.price} onChange={handleInputChange} />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input type="text" name="description" value={newProduct.description} onChange={handleInputChange} />
                </FormControl>

                <FormControl>
                  <FormLabel>Tags</FormLabel>
                  <Stack direction="row" spacing={2}>
                    <Input
                      type="text"
                      name="tagInput"
                      placeholder="Enter a tag"
                      value={newProduct.tagInput}
                      onChange={(e) => setNewProduct({ ...newProduct, tagInput: e.target.value })}
                    />
                    <Button onClick={handleAddTag} colorScheme="blue">+</Button>
                  </Stack>
                  <Stack spacing={1} mt={2}>
                    {newProduct.tags.map((tag, index) => (
                      <Stack key={index} direction="row" alignItems="center">
                        <Input value={tag} readOnly />
                        <Button size="sm" colorScheme="red" onClick={() => handleRemoveTag(index)}>-</Button>
                      </Stack>
                    ))}
                  </Stack>
                </FormControl>

                <FormControl>
                  <FormLabel>Variants</FormLabel>
                  <Stack spacing={2}>
                    {newProduct.variants.map((variant, index) => (
                      <Stack key={index} direction="row" alignItems="center">
                        <Input
                          type="text"
                          placeholder="Color"
                          value={variant.color}
                          onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                        />
                        <Input
                          type="text"
                          placeholder="Price"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                        />
                        <Input
                          type="text"
                          placeholder="Stock"
                          value={variant.stock}
                          onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                        />
                        <Button size="sm" colorScheme="red" onClick={() => handleRemoveVariant(index)}>-</Button>
                      </Stack>
                    ))}
                    <Button onClick={handleAddVariant} colorScheme="blue">Add</Button>
                  </Stack>
                </FormControl>

                <FormControl>
                  <FormLabel>Existing Images</FormLabel>
                  <Stack direction="row" spacing={2}>
                    {existingImages.map((image, index) => (
                      <Box key={index} position="relative">
                        <Image
                          src={`${process.env.REACT_APP_API_URL}uploads/${image}`}
                          boxSize="50px"
                          borderRadius="5px"
                          alt={`Existing image ${index + 1}`}
                        />
                        <Button
                          size="xs"
                          colorScheme="red"
                          position="absolute"
                          top="0"
                          right="0"
                          onClick={() => handleRemoveExistingImage(index)}
                        >
                          &times;
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                </FormControl>

                <FormControl>
                  <FormLabel>Images</FormLabel>
                  <Input type="file" name="images" onChange={handleFileChange} multiple />
                </FormControl>

                <Button type="submit" colorScheme="teal">{editingProduct ? "Edit Product" : "Add New Product"}</Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductManagement;
