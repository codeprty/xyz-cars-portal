import api from "./api";

export const getBusinesses = async () => {
  const resp = await api.get("/businesses");
  return resp.data;
};

export const createBusiness = async (data) => {
  return api.post("/businesses", data);
};

export const updateBusiness = async (id, data) => {
  return api.put(`/businesses/${id}`, data);
};

export const deleteBusiness = async (id) => {
  return api.delete(`/businesses/${id}`);
};
