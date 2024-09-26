import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { apiUrl } from "../utils/apiUrl";
import { AUTH_ROUTES } from "@/lib/api-routes";
import {
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
  setAccessTokenToCookies,
  setRefreshTokenToCookies,
} from "./cookies";

class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
  }> = [];

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: apiUrl,
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    );

    this.axiosInstance.interceptors.response.use(
      this.handleResponse,
      this.handleResponseError
    );
  }

  private handleRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const accessToken = await getAccessTokenFromCookies();
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  };

  private handleRequestError = (error: any): Promise<never> => {
    return Promise.reject(error);
  };

  private handleResponse = (response: AxiosResponse): AxiosResponse => {
    return response;
  };

  private handleResponseError = async (error: any): Promise<any> => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return this.axiosInstance(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      try {
        const refreshToken = await getRefreshTokenFromCookies();
        const response = await this.axiosInstance.post(AUTH_ROUTES.REFRESH_TOKEN, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response as unknown as {
          accessToken: string;
          refreshToken: string;
        };

        await setAccessTokenToCookies(accessToken);
        await setRefreshTokenToCookies(newRefreshToken);

        this.axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        this.processQueue(null, accessToken);
        return this.axiosInstance(originalRequest);
      } catch (refreshError) {
        this.processQueue(refreshError, null);
        await setAccessTokenToCookies("");
        await setRefreshTokenToCookies("");
        window.location.href = "/"; // Redirect to home page on auth failure
        return Promise.reject(refreshError);
      } finally {
        this.isRefreshing = false;
      }
    }

    return Promise.reject(error);
  };

  private processQueue(error: any, token: string | null = null): void {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  public async get<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    return this.axiosInstance.get<T>(url, config).then((response) => response.data);
  }

  public async post<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> {
    return this.axiosInstance.post<T>(url, data, config).then((response) => response.data);
  }

  public async put<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> {
    return this.axiosInstance.put<T>(url, data, config).then((response) => response.data);
  }

  public async delete<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    return this.axiosInstance.delete<T>(url, config).then((response) => response.data);
  }
}

const apiClient = ApiClient.getInstance();

export default apiClient;
