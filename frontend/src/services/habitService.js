import apiClient from '../api/axiosConfig';

const API_URL = '/v1/habits';

const getAllHabits = () => {
    return apiClient.get(API_URL);
};

const createHabit = (habitData) => {
    return apiClient.post(API_URL, habitData);
};

const toggleHabitCompletion = (habitId, date) => {
    // date should be in 'YYYY-MM-DD' format
    return apiClient.post(`${API_URL}/${habitId}/completions?date=${date}`);
};

const deleteHabit = (habitId) => {
    return apiClient.delete(`${API_URL}/${habitId}`);
};

const habitService = {
    getAllHabits,
    createHabit,
    toggleHabitCompletion,
    deleteHabit,
};

export default habitService;