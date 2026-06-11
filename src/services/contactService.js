import api from "./api";

const contactService = {
  submitMessage: async (data) => {
    const response = await api.post("/contact", data);
    return response.data;
  },
  getMessages: async () => {
    const response = await api.get("/contact");
    return response.data;
  },
  markAsFinished: async (id) => {
    const response = await api.patch(`/contact/${id}/status`);
    return response.data;
  },
};

export default contactService;
