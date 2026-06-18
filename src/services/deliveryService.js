import api from "./api";

const deliveryService = {
  async getCurrentOrder() {
    const response = await api.get("/delivery/current-order");

    return response.data;
  },

  async getDeliveryHistory() {
    const response = await api.get("/delivery/history");

    return response.data;
  },

  async completeOrder(orderId, otp) {
    const response = await api.post(`/delivery/orders/${orderId}/complete`, {
      otp,
    });

    return response.data;
  },
};

export default deliveryService;
