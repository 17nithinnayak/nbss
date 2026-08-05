import { api } from "./client";

export const membersApi = {
  list: () => api.get("/members").then((r) => r.data),
  get: (id) => api.get(`/members/${id}`).then((r) => r.data),
  create: (payload) => api.post("/members", payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/members/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/members/${id}`),
};

export const eventsApi = {
  list: () => api.get("/events").then((r) => r.data),
  get: (id) => api.get(`/events/${id}`).then((r) => r.data),
  create: (payload) => api.post("/events", payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/events/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/events/${id}`),
};

export const authApi = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
  changePassword: (current_password, new_password) =>
    api.post("/auth/change-password", { current_password, new_password }).then((r) => r.data),
};
