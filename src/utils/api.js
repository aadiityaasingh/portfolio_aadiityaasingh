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

// Skill Category methods
export const getSkills = async () => {
  const res = await api.get("/api/skills");
  return res.data;
};

export const createSkill = async (skillData) => {
  const res = await api.post("/api/skills", skillData);
  return res.data;
};

export const updateSkill = async (id, skillData) => {
  const res = await api.put(`/api/skills/${id}`, skillData);
  return res.data;
};

export const deleteSkill = async (id) => {
  const res = await api.delete(`/api/skills/${id}`);
  return res.data;
};

export const reorderSkills = async (orderedIds) => {
  const res = await api.patch("/api/skills/reorder", { orderedIds });
  return res.data;
};

// Experience methods
export const getExperiences = async () => {
  const res = await api.get("/api/experience");
  return res.data;
};

export const createExperience = async (experienceData) => {
  const res = await api.post("/api/experience", experienceData);
  return res.data;
};

export const updateExperience = async (id, experienceData) => {
  const res = await api.put(`/api/experience/${id}`, experienceData);
  return res.data;
};

export const deleteExperience = async (id) => {
  const res = await api.delete(`/api/experience/${id}`);
  return res.data;
};

export const reorderExperiences = async (orderedIds) => {
  const res = await api.patch("/api/experience/reorder", { orderedIds });
  return res.data;
};

// Certification methods
export const getCertifications = async () => {
  const res = await api.get("/api/certifications");
  return res.data;
};

export const createCertification = async (certData) => {
  const res = await api.post("/api/certifications", certData);
  return res.data;
};

export const updateCertification = async (id, certData) => {
  const res = await api.put(`/api/certifications/${id}`, certData);
  return res.data;
};

export const deleteCertification = async (id) => {
  const res = await api.delete(`/api/certifications/${id}`);
  return res.data;
};

export const reorderCertifications = async (orderedIds) => {
  const res = await api.patch("/api/certifications/reorder", { orderedIds });
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
