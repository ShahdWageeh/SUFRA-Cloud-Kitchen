import api from "./api";

class OrdersService {
  async getChefOrders() {
    const response = await api.get("/orders/chef/orders");
    console.log("Orders response:", response.data);
    return response.data;
  }

  async updateOrderItemStatus(orderId, mealId, status) {
    const response = await api.patch(`/orders/${orderId}/items/status`, {
      mealId,
      status,
    });
    return response.data;
  }

  async getMyOrders() {
    const response = await api.get("/orders/my-orders");
    return response.data;
  }

  async getOrderById(id) {
    const response = await api.get(`/orders/${id}`);
    console.log("Orders response:", response.data);
    return response.data;
  }

  async checkout(orderData) {
    const response = await api.post("/orders/checkout", orderData);
    return response.data;
  }
}

const ordersService = new OrdersService();

export default ordersService;
