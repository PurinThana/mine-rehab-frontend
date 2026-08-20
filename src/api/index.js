import axios from "axios";

// ============================================================================
// 1. ตั้งค่า Axios Client & Interceptors
// ============================================================================
const TOKEN_KEY = "token";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- การจัดการ Token (localStorage เป็นแหล่งข้อมูลจริงเพียงที่เดียว) ---
export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function clearAuthToken() {
  setAuthToken(null);
}

// AuthContext ลงทะเบียน callback ไว้ที่นี่ เพื่อให้ interceptor เคลียร์ session
// ได้เมื่อ token หมดอายุ โดยที่ไฟล์นี้ไม่ต้องรู้จัก React เลย
let unauthorizedHandler = null;
export function onUnauthorized(handler) {
  unauthorizedHandler = handler;
  return () => {
    if (unauthorizedHandler === handler) unauthorizedHandler = null;
  };
}

// แนบ Token ไปกับทุก Request อัตโนมัติ
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// จัดการ Response (ดึงเฉพาะ data) และ Error (เช่น Token หมดอายุ)
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 401 จาก /auth/login คือ "อีเมลหรือรหัสผ่านผิด" ไม่ใช่ session หมดอายุ
    // ปล่อยให้ฟอร์ม login จัดการเอง ไม่ต้องเคลียร์ session
    const isLoginRequest = (error.config?.url || "").includes("/auth/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      clearAuthToken();
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);

// แปลง error จาก axios ให้เป็นข้อความไทยที่แสดงให้ผู้ใช้ได้ทันที
export function getErrorMessage(error, fallback = "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง") {
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.code === "ERR_NETWORK")
    return "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ — ตรวจสอบว่า backend ทำงานอยู่ที่พอร์ต 4000";
  return error?.message || fallback;
}

// ============================================================================
// 2. จัดกลุ่ม API Endpoints
// ============================================================================

export const authApi = {
  login: (credentials) => apiClient.post("/auth/login", credentials),
  logout: () => apiClient.post("/auth/logout"),
  getMe: () => apiClient.get("/auth/me"),
  changePassword: (data) => apiClient.post("/auth/change-password", data),
};

export const uploadsApi = {
  // multipart/form-data — ปล่อยให้ browser ตั้ง Content-Type + boundary เอง
  // ถ้าตั้ง "application/json" ทับตาม default ของ client ฝั่ง server จะ parse ไม่ออก
  upload: (file, onProgress) => {
    const form = new FormData();
    form.append("file", file);
    return apiClient.post("/uploads", form, {
      headers: { "Content-Type": undefined },
      onUploadProgress: onProgress
        ? (e) => onProgress(e.total ? Math.round((e.loaded / e.total) * 100) : 0)
        : undefined,
    });
  },
};

export const sitesApi = {
  getAll: () => apiClient.get("/sites"),
  getById: (id) => apiClient.get(`/sites/${id}`),
  getOverview: (id) => apiClient.get(`/sites/${id}/overview`),
  create: (data) => apiClient.post("/sites", data),
  update: (id, data) => apiClient.put(`/sites/${id}`, data),
};

export const benchLevelsApi = {
  getBySiteId: (siteId) => apiClient.get(`/sites/${siteId}/bench-levels`),
  getById: (id) => apiClient.get(`/bench-levels/${id}`),
  create: (data) => apiClient.post("/bench-levels", data),
  update: (id, data) => apiClient.put(`/bench-levels/${id}`, data),
  delete: (id) => apiClient.delete(`/bench-levels/${id}`),
};

export const speciesApi = {
  getAll: () => apiClient.get("/species"),
  getTotalsBySite: (siteId) => apiClient.get(`/sites/${siteId}/species-totals`),
  create: (data) => apiClient.post("/species", data),
  update: (id, data) => apiClient.put(`/species/${id}`, data),
  delete: (id) => apiClient.delete(`/species/${id}`),
};

export const plantingsApi = {
  createOrUpdate: (data) => apiClient.post("/plantings", data),
  delete: (id) => apiClient.delete(`/plantings/${id}`),
};

export const activitiesApi = {
  getBySiteId: (siteId, limit = 5) =>
    apiClient.get(`/sites/${siteId}/activities`, { params: { limit } }),
  getById: (id) => apiClient.get(`/activities/${id}`),
  create: (data) => apiClient.post("/activities", data),
  update: (id, data) => apiClient.put(`/activities/${id}`, data),
  delete: (id) => apiClient.delete(`/activities/${id}`),
};

export const documentsApi = {
  getBySiteId: (siteId) => apiClient.get(`/sites/${siteId}/documents`),
  create: (data) => apiClient.post("/documents", data),
  update: (id, data) => apiClient.put(`/documents/${id}`, data),
  delete: (id) => apiClient.delete(`/documents/${id}`),
};

export const newsApi = {
  getBySiteId: (siteId, limit = 5) =>
    apiClient.get(`/sites/${siteId}/news`, { params: { limit } }),
  create: (data) => apiClient.post("/news", data),
  update: (id, data) => apiClient.put(`/news/${id}`, data),
  delete: (id) => apiClient.delete(`/news/${id}`),
};

export const snapshotsApi = {
  getBySiteId: (siteId, limit = 12) =>
    apiClient.get(`/sites/${siteId}/progress-snapshots`, { params: { limit } }),
  create: (siteId, snapshotDate) =>
    apiClient.post(`/sites/${siteId}/progress-snapshots`, { snapshotDate }),
};

// เผื่อต้องการเรียกใช้ apiClient ตรงๆ ในบางกรณี
export default apiClient;
