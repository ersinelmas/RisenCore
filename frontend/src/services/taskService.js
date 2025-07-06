import apiClient from '../api/axiosConfig';

const API_URL = '/v1/tasks';

const getAllTasks = () => {
    return apiClient.get(API_URL);
};

const createTask = (description) => {
    return apiClient.post(API_URL, { description });
};

// TODO: Add getTaskById, updateTask, deleteTask functions later

const taskService = {
    getAllTasks,
    createTask,
};

export default taskService;