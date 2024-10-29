import apiClient from '@/api/Axios';

// Fetch settings from the server
export const getSettings = async () => {
    try {
        const response = await apiClient.get('/settings');
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        console.error('Error fetching settings:', errorMessage);
        throw new Error(errorMessage);
    }
};

// Save settings to the server
export const saveSettings = async (data) => {
    try {
        const response = await apiClient.post('/settings/save', data);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error saving settings';
        console.error('Error saving settings:', errorMessage);
        throw new Error(errorMessage);
    }
};
