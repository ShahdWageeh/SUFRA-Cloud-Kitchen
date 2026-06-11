import api from "./api";

class OrdersService {
  async getChefOrders() {
    const response = await api.get("/orders/chef/orders");
    return response.data;
  }

  async getMyOrders() {
    const response = await api.get("/orders/my-orders");
    return response.data;
  }

  async getOrderById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }
}

const ordersService = new OrdersService();

export default ordersService;
