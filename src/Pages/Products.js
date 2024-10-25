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
    variants: [{ color: '', price: '' }],
    images: []
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
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
      variants: [{ color: '', price: '' }],
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
      variants: product.variants.map(v => ({ color: v.color, price: v.price })),
      images: product.images // URLs for display only
    });
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
      variants: [...newProduct.variants, { color: '', price: '' }],
    });
  };

  const handleRemoveVariant = (index) => {
    setNewProduct({
      ...newProduct,
      variants: newProduct.variants.filter((_, i) => i !== index),
    });
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

  return (
    <Box p={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
        <h1>Product Management</h1>
        <Button colorScheme="teal" size="md" onClick={openAddModal}>
          Add Product
        </Button>
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
                  src={`http://localhost:5000/uploads${product.images[0]}`}
                  height="60px"
                  width="80px"
                />
              </Td>
              <Td>{product.category.name}</Td>
              <Td>{product.tags.join(', ')}</Td>
              <Td>
                {product.variants.map((variant) => (
                  <div key={variant._id}>
                    Color: {variant.color}, Price: ₹{variant.price}
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
                        <Button size="sm" colorScheme="red" onClick={() => handleRemoveVariant(index)}>-</Button>
                      </Stack>
                    ))}
                    <Button onClick={handleAddVariant} colorScheme="blue">Add</Button>
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
