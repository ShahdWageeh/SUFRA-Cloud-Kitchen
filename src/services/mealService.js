import api from "./api";

export const mealService = {
  async getActiveMeals(params = {}) {
    const response = await api.get("/meals/active", { params });
    return response.data;
  },

  async getMealById(mealId) {
    const response = await api.get(`/meals/${mealId}`);
    return response.data;
  },
};

export default mealService;
