import api from "./api";

const cartService = {
  getCart: async () => {
    const response = await api.get("/cart");
    return response.data;
  },

  addItem: async (mealId, quantity = 1) => {
    const response = await api.post("/cart/items", { mealId, quantity });
    return response.data;
  },

  updateQuantity: async (mealId, quantity) => {
    const response = await api.patch(`/cart/items/${mealId}`, { quantity });
    return response.data;
  },

  removeItem: async (mealId) => {
    const response = await api.delete(`/cart/items/${mealId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete("/cart");
    return response.data;
  },
};

export default cartService;
