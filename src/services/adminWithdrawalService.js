import api from "./api";

const adminWithdrawalService = {
  getAllRequests: async (status) => {
    const response = await api.get("/withdrawals/requests", {
      params: status ? { status } : {},
    });

    return response.data;
  },

  approveRequest: async (withdrawalId, notes = "") => {
    const response = await api.patch(`/withdrawals/${withdrawalId}/approve`, {
      notes,
    });

    return response.data;
  },

  rejectRequest: async (withdrawalId, notes = "") => {
    const response = await api.patch(`/withdrawals/${withdrawalId}/reject`, {
      notes,
    });

    return response.data;
  },
};

export default adminWithdrawalService;
