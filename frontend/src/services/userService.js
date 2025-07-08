import apiClient from '../api/axiosConfig';

const API_URL = '/v1/users';

const changePassword = (passwordData) => {
    return apiClient.patch(`${API_URL}/change-password`, passwordData);
};

const userService = {
    changePassword,
};

export default userService;