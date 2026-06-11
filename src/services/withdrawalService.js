import api from "./api";

const withdrawalService = {
  getHistory: async () => {
    const response = await api.get("/withdrawals/history");
    return response.data;
  },
  requestWithdrawal: async (data) => {
    const response = await api.post("/withdrawals/request", data);
    return response.data;
  },
};

export default withdrawalService;
