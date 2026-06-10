import api from "./api";

class OrdersService {
  async getChefOrders() {
    const response = await api.get("/orders/chef/orders");
    console.log("Orders response:", response.data);
    return response.data;
  }
}

const ordersService = new OrdersService();

export default ordersService;
