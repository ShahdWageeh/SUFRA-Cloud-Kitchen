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

  async checkout(orderData) {
    const response = await api.post("/orders/checkout", orderData);
    return response.data;
  }
}

const ordersService = new OrdersService();

export default ordersService;
