import api from "./api";
import tokenService from "./tokenService";

class AuthService {
  async register(data) {
    const response = await api.post("/auth/register", data);
    const result = response.data;
    if (result.success) {
      tokenService.save(result.data.token);
    }

    return result;
  }

  async login(data) {
    const response = await api.post("/auth/login", data);
    const result = response.data;
    if (result.success) {
      tokenService.save(result.data.token);
    }

    return result;
  }

  async me() {
    const response = await api.get("/auth/me");
    return response.data;
  }

  logout() {
    tokenService.remove();
  }
}

const authService = new AuthService();

export default authService;
