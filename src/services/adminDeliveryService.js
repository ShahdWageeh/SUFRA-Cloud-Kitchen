import api from "./api";

const adminDeliveryService = {
  async getAllDeliveryUsers() {
    const response = await api.get("/users/delivery");
    return response.data;
  },

  async createDeliveryUser(userData) {
    const response = await api.post("/users/delivery", userData);
    return response.data;
  },

  async deleteDeliveryUser(userId) {
    const response = await api.delete(`/users/delivery/${userId}`);
    return response.data;
  },

  async toggleDeliveryUserStatus(userId) {
    const response = await api.patch(`/users/delivery/${userId}/toggle-block`);
    return response.data;
  },

  async getDeliveryManagementData() {
    const response = await api.get("/admin/delivery-management");
    return response.data;
  },

  async assignDeliveryPerson(orderId, deliveryId) {
    const response = await api.post("/admin/assign-delivery", {
      orderId,
      deliveryId,
    });
    return response.data;
  },
};

export default adminDeliveryService;
