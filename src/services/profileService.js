import api from "./api";

class ProfileService {
  async updateProfile(data) {
    const response = await api.put("/chefs/profile", data);
    // console.log("1", response.data.data);
    // console.log("2", response.data.data.kitchenName);
    // console.log("3", response.data.data.slogan);
    // console.log("4", response.data.data.description);
    // console.log("5", response.data.data.firstName);
    return response.data;
  }
}

const profileService = new ProfileService();

export default profileService;
