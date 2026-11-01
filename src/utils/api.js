import axios from "axios";

const api = axios.create({
  baseURL: "", // Uses relative path; proxies via vite.config.js in dev, native in Vercel
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("portfolio_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthRoute = error.config.url.includes("/api/auth/login");
      if (!isAuthRoute) {
        localStorage.removeItem("portfolio_admin_token");
        localStorage.removeItem("portfolio_admin_user");
      }
    }
    return Promise.reject(error);
  }
);

// API methods
export const getProjects = async () => {
  const res = await api.get("/api/projects");
  return res.data;
};

export const createProject = async (projectData) => {
  const res = await api.post("/api/projects", projectData);
  return res.data;
};

export const updateProject = async (id, projectData) => {
  const res = await api.put(`/api/projects/${id}`, projectData);
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/api/projects/${id}`);
  return res.data;
};

export const reorderProjects = async (orderedIds) => {
  const res = await api.patch("/api/projects/reorder", { orderedIds });
  return res.data;
};

export const loginAdmin = async (email, password) => {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data;
};

export const verifyAdminToken = async () => {
  const res = await api.get("/api/auth/verify");
  return res.data;
};

export default api;
