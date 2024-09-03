import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { apiUrl } from "../utils/apiUrl";
import { AUTH_ROUTES } from "@/lib/api-routes";
import {
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
  setAccessTokenToCookies,
  setRefreshTokenToCookies,
} from "./cookies";

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await localStorage.getItem("access_token");
    console.log({ accessToken });
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Refreshing token");
      originalRequest._retry = true;

      try {
        const refreshToken = await localStorage.getItem("refresh_token");
        const response = await axiosInstance.post(AUTH_ROUTES.REFRESH_TOKEN, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        await localStorage.setItem("access_token", accessToken);
        await localStorage.setItem("refresh_token", newRefreshToken);

        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        await localStorage.removeItem("access_token");
        await localStorage.removeItem("refresh_token");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const axiosServerInstance = axios.create({
  baseURL: apiUrl,
});

axiosServerInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessTokenFromCookies();
    console.log({ accessToken });
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosServerInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Refreshing token");
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshTokenFromCookies();
        const response = await axiosInstance.post(AUTH_ROUTES.REFRESH_TOKEN, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        await setAccessTokenToCookies(accessToken);
        await setRefreshTokenToCookies(newRefreshToken);

        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        await setAccessTokenToCookies("");
        await setRefreshTokenToCookies("");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
