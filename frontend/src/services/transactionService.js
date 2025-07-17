import apiClient from '../api/axiosConfig';

const API_URL = '/v1/transactions';

const getAllTransactions = () => {
    return apiClient.get(API_URL);
};

const createTransaction = (transactionData) => {
    return apiClient.post(API_URL, transactionData);
};

const getExpenseSummary = () => {
    return apiClient.get(`${API_URL}/summary/by-category`);
};

const deleteTransaction = (id) => {
    return apiClient.delete(`${API_URL}/${id}`);
};

const transactionService = {
    getAllTransactions,
    createTransaction,
    getExpenseSummary,
    deleteTransaction
};

export default transactionService;