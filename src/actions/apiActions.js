import axios from "axios";

const baseURL = "http://localhost:5000/api";

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