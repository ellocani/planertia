import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh");
        if (refreshToken) {
          const response = await axios.post("http://127.0.0.1:8000/api/users/token/refresh/", {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;
          localStorage.setItem("access", newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("토큰 재발급 실패:", refreshError);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

export const fetchCategories = async () => {
  const response = await axiosInstance.get("/categories/");
  return response.data;
};

export const createCategory = async (name: string) => {
  const response = await axiosInstance.post("/categories/", { name });
  return response.data;
};

export const deleteCategory = async (id: number) => {
  const response = await axiosInstance.delete(`/categories/${id}/`);
  return response.data;
};
