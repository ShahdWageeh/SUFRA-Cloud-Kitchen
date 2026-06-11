import api from "./api";

class MealPlanningService {
  async generateMealPlan(data) {
    const response = await api.post("/meal-planning/generate", data);
    return response.data;
  }
}

const mealPlanningService = new MealPlanningService();

export default mealPlanningService;
