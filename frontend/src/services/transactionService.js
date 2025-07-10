import apiClient from '../api/axiosConfig';

const API_URL = '/v1/transactions';

const getAllTransactions = () => {
    return apiClient.get(API_URL);
};

const createTransaction = (transactionData) => {
    return apiClient.post(API_URL, transactionData);
};

const transactionService = {
    getAllTransactions,
    createTransaction,
};

export default transactionService;