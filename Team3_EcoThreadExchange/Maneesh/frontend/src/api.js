import axios from "axios";

// Base URL of your Spring Boot backend
const API_BASE_URL = "http://localhost:8080/api/users";

// Register a new user
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, userData);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

// Login user
export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, userData);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

// Forgot Password
export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
        return response.data;
    } catch (error) {
        console.error("Error with forgot password:", error);
        throw error;
    }
};


// Home Page
export const  home = async (home) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/home`, home);
        return response.data;
    } catch (error) {
        console.error("Error with home page:", error);
        throw error;
    }
};

// Get all users (optional, for admin functionality)
export const getAllUsers = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
