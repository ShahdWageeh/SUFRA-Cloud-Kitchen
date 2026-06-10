import api from "./api";

class ProfileService {
  async getProfile(id) {
    const response = await api.get(`/chefs/${id}`);
    return response.data;
  }

  async updateProfile(data) {
    const response = await api.put("/chefs/profile", data);
    return response.data;
  }
}

const profileService = new ProfileService();

export default profileService;
