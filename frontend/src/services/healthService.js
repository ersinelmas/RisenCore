import apiClient from "../api/axiosConfig";

const API_URL = "/health";

const healthService = {
    createMetric: (metricData) => {
        return apiClient.post(API_URL, metricData);
    },

    getAllMetrics: () => {
        return apiClient.get(API_URL);
    },

    getMetricsByType: (type) => {
        return apiClient.get(`${API_URL}/type/${type}`);
    },

    deleteMetric: (id) => {
        return apiClient.delete(`${API_URL}/${id}`);
    },
};

export default healthService;
