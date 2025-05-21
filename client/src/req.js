import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config._retry
    ) {
      error.config._retry = true;

      try {
        const refreshToken = sessionStorage.getItem("refresh");
        if (refreshToken) {
          const res = await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            {
              refresh: refreshToken,
            },
          );

          const newAccessToken = res.data.access;
          sessionStorage.setItem("access", newAccessToken);

          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(error.config);
        }
      } catch (refreshError) {
        sessionStorage.removeItem("access");
        sessionStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
