import api from "./api";

class BrandingService {
  async generateKitchenBranding(data) {
    const response = await api.post("/chefs/kitchen-branding", data);
    return response.data;
  }
}

const brandingService = new BrandingService();

export default brandingService;
