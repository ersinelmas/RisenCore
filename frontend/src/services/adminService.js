import apiClient from '../api/axiosConfig';

const API_URL = '/v1/admin';

const getAllUsers = () => {
    return apiClient.get(`${API_URL}/users`);
};

const adminService = {
    getAllUsers,
};

export default adminService;