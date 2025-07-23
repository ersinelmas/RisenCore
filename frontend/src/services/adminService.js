import apiClient from '../api/axiosConfig';

const API_URL = '/v1/admin';

const getAllUsers = () => {
    return apiClient.get(`${API_URL}/users`);
};

const promoteUser = (username) => {
    return apiClient.patch(`${API_URL}/users/${username}/promote`);
};

const demoteUser = (username) => {
    return apiClient.patch(`${API_URL}/users/${username}/demote`);
};

const deleteUser = (userId) => {
    return apiClient.delete(`${API_URL}/users/${userId}`);
};

const adminService = {
    getAllUsers,
    promoteUser,
    demoteUser,
    deleteUser,
};

export default adminService;