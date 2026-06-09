import api from "./api";
import { filterVerifiedChefs } from "@/utils/chefUtils";

export const chefService = {
  async getAllChefs(params = {}) {
    const response = await api.get("/chefs", { params });
    return response.data;
  },

  async getVerifiedChefs(params = {}) {
    const response = await this.getAllChefs(params);

    return {
      ...response,
      data: filterVerifiedChefs(response.data),
    };
  },

  async getChefById(chefId) {
    const response = await api.get(`/chefs/${chefId}`);
    return response.data;
  },
};

export default chefService;
