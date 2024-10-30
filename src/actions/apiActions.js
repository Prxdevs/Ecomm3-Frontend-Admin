import axios from "axios";

const baseURL = `${process.env.REACT_APP_API_URL}api`;

const instance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

export async function getAllCategories() {
    try {
        const response = await instance.get("/categories");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateCategory(selectedCategoryId, formDataForBackend) {
    try {
        const response = await instance.put(`/categories/${selectedCategoryId}`, formDataForBackend);

        console.log('newResponse:', response.data); // Check the response
        return response.data;
    } catch (error) {
        throw error; // Handle error as needed in your component
    }
}

export async function getAllProducts(category, color, tags) {
    try {
        const response = await instance.get("/products", {
            params: {
                category: category,
                color: color,
                tags: tags
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function createProduct(newProduct) {
    try {
        const response = await instance.post("/products", newProduct);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteProduct(id) {
    try {
        const response = await instance.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateProduct(selectedProductId, formData) {
    try {
        const response = await instance.put(`/products/${selectedProductId}`, formData, {
            // headers: {
            //     'Content-Type': 'multipart/form-data', // Ensure you're sending FormData
            // },
        });
        return response.data;
    } catch (error) {
        throw error; // Handle error as needed in your component
    }
}