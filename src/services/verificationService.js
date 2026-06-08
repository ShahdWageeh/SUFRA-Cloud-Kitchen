import api from "./api";

class VerificationService {
  /**
   * Submit chef verification documents
   * @param {FormData} formData
   * @returns {Promise<Object>}
   */
  async submitVerification(formData) {
    const { data } = await api.post("/verification-request", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  }

  /**
   * Get current chef verification status
   * @returns {Promise<Object>}
   */
  async getVerificationStatus() {
    const { data } = await api.get("/verification-request/status");

    return data;
  }

  /**
   * Get all pending requests (Admin)
   * @returns {Promise<Object>}
   */
  async getPendingRequests() {
    const { data } = await api.get("/verification-request/pending");

    return data;
  }

  /**
   * Update verification request status (Admin)
   * @param {string} requestId
   * @param {"pending" | "approved" | "failed"} status
   * @returns {Promise<Object>}
   */
  async updateVerificationStatus(requestId, status) {
    const { data } = await api.patch(
      `/verification-request/${requestId}/status`,
      {
        status,
      },
    );

    return data;
  }
}

const verificationService = new VerificationService();

export default verificationService;
