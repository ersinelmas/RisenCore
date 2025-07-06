import apiClient from '../api/axiosConfig';

const API_URL = '/v1/tasks';

const getAllTasks = () => {
    return apiClient.get(API_URL);
};

const createTask = (description) => {
    return apiClient.post(API_URL, { description });
};

const updateTask = (id, updateData) => {
    // updateData will be an object like { completed: true }
    return apiClient.put(`${API_URL}/${id}`, updateData);
};

const deleteTask = (id) => {
    return apiClient.delete(`${API_URL}/${id}`);
};


const taskService = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
};

export default taskService;