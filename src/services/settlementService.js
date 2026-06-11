import api from "./api";

const settlementService = {
  getWallet: async () => {
    const response = await api.get("/settlement/wallet");
    return response.data;
  },
  getEarnings: async () => {
    const response = await api.get("/settlement/earnings");
    return response.data;
  },
};

export default settlementService;
