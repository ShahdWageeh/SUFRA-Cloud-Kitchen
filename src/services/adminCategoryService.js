import tokenService from "./tokenService";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

function getAuthToken() {
  if (typeof window === "undefined") return null;

  return (
    tokenService.get() ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("admin_token")
  );
}

async function adminRequest(path, { method = "GET", body } = {}) {
  const token = getAuthToken();
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const isFormData = body instanceof FormData;
  if (!isFormData && body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const raw = await response.text();
  let result = {};

  if (raw) {
    try {
      result = JSON.parse(raw);
    } catch {
      const isHtml = raw.trim().startsWith("<");
      const error = new Error(
        isHtml
          ? "API route not found. Check that NEXT_PUBLIC_API_BASE_URL points to the backend API, not the Next.js app."
          : raw.slice(0, 200),
      );
      error.status = response.status;
      throw error;
    }
  }

  if (!response.ok) {
    const error = new Error(
      result.message || `Request failed with status ${response.status}`,
    );
    error.status = response.status;
    error.data = result;
    throw error;
  }

  return result;
}

class AdminCategoryService {
  async getAllCategories() {
    return adminRequest("/categories");
  }

  async getCategoryById(categoryId) {
    return adminRequest(`/categories/${categoryId}`);
  }

  async createCategory(formData) {
    return adminRequest("/categories", { method: "POST", body: formData });
  }

  async updateCategory(categoryId, formData) {
    const id = String(categoryId || "").trim();
    if (!id || id === "undefined") {
      throw new Error("Invalid category id.");
    }

    try {
      return await adminRequest(`/categories/${id}`, {
        method: "PUT",
        body: formData,
      });
    } catch (error) {
      if (error.status !== 404 && error.status !== 405) {
        throw error;
      }

      return adminRequest(`/categories/${id}`, {
        method: "PATCH",
        body: formData,
      });
    }
  }

  async deleteCategory(categoryId) {
    const id = String(categoryId || "").trim();
    if (!id || id === "undefined") {
      throw new Error("Invalid category id.");
    }

    return adminRequest(`/categories/${id}`, { method: "DELETE" });
  }

  async updateCategoryStatus(categoryId, status) {
    const id = String(categoryId || "").trim();
    if (!id || id === "undefined") {
      throw new Error("Invalid category id.");
    }

    return adminRequest(`/categories/${id}/status`, {
      method: "PATCH",
      body: { status },
    });
  }
}

const adminCategoryService = new AdminCategoryService();

export default adminCategoryService;
