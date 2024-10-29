import apiClient from '@/api/Axios';

// Login user
export const loginUser = async (userData) => {
    try {
        const response = await apiClient.post('/login', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Login failed';
    }
};

// Signup user
export const signupUser = async (userData) => {
    try {
        const response = await apiClient.post('/signup', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Signup failed';
    }
};

// Logout user
export const logoutUser = async () => {
    try {
        await apiClient.post('/logout');
        localStorage.removeItem('access_token');
        return true;
    } catch (error) {
        throw error.response?.data || 'Logout failed';
    }
};

// Fetch current user
export const fetchCurrentUser = async () => {
    try {
        const response = await apiClient.get('/me/user');
        console.log("user", response.data)
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Failed to fetch current user';
    }
};

// Fetch users list
export const fetchUsers = async () => {
    try {
        const response = await apiClient.get('/users');
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Failed to fetch users';
    }
};

// Add a new user
export const addUser = async (userData) => {
    try {
        const response = await apiClient.post('/users', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Failed to add user';
    }
};

// Edit a user
export const editUser = async (id, userData) => {
    try {
        const response = await apiClient.post(`/users/${id}`, userData);
        return response.data; // Ensure this returns the updated user
    } catch (error) {
        throw error.response?.data || 'Failed to edit user';
    }
};

// Delete a user
export const deleteUser = async (id) => {
    try {
        await apiClient.delete(`/users/${id}`);
        return true;
    } catch (error) {
        throw error.response?.data || 'Failed to delete user';
    }
};

// Change user status
export const changeUserStatus = async (id, status) => {
    try {
        const response = await apiClient.get(`/users/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Failed to change user status';
    }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
    try {
        const response = await apiClient.post('/user/profile', profileData);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Failed to update profile';
    }
};
