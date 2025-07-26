import apiClient from "../api/axiosConfig";

const API_URL = "/v1/analytics";

/**
 * Fetches the AI-generated weekly review for the current user.
 * @returns {Promise<AxiosResponse<string>>} A promise that resolves to the API response containing the review text.
 */
const getWeeklyReview = () => {
  return apiClient.get(`${API_URL}/weekly-review`);
};

const analyticsService = {
  getWeeklyReview,
};

export default analyticsService;