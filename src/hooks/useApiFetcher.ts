import axios, {
	AxiosInstance,
	InternalAxiosRequestConfig,
	AxiosResponse,
} from 'axios';
import { apiUrl } from '../utils/apiUrl';
import { AUTH_ROUTES } from '@/lib/api-routes';
import {
	getAccessTokenFromCookies,
	getRefreshTokenFromCookies,
	setAccessTokenToCookies,
	setRefreshTokenToCookies,
} from './cookies';
import { useAuth } from '@/context/AuthContext';

interface ApiError {
	error?: string;
	message?: string;
	statusCode?: number;
}

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
			this.handleRequestError,
		);

		this.axiosInstance.interceptors.response.use(
			this.handleResponse,
			this.handleResponseError,
		);
	}

	private handleRequest = async (
		config: InternalAxiosRequestConfig,
	): Promise<InternalAxiosRequestConfig> => {
		const accessToken = await getAccessTokenFromCookies();
		if (accessToken) {
			config.headers = config.headers || {};
			config.headers['Authorization'] = `Bearer ${accessToken}`;
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
				})
					.then((token) => {
						originalRequest.headers['Authorization'] = `Bearer ${token}`;
						return this.axiosInstance(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			originalRequest._retry = true;
			this.isRefreshing = true;

			try {
				const refreshToken = await getRefreshTokenFromCookies();
				if (!refreshToken) {
					throw new Error('No refresh token available');
				}

				const response = await this.axiosInstance.post(
					AUTH_ROUTES.REFRESH_TOKEN,
					{
						refreshToken,
					},
				);

				const { accessToken, refreshToken: newRefreshToken } = response.data;

				await setAccessTokenToCookies(accessToken);
				await setRefreshTokenToCookies(newRefreshToken);

				this.axiosInstance.defaults.headers.common['Authorization'] =
					`Bearer ${accessToken}`;
				this.processQueue(null, accessToken);
				return this.axiosInstance(originalRequest);
			} catch (refreshError) {
				this.processQueue(refreshError, null);
				await this.handleLogout();
				return Promise.reject(refreshError);
			} finally {
				this.isRefreshing = false;
			}
		}

		const errorResponse = error.response?.data as ApiError;
		const errorMessage = errorResponse?.error ||
			errorResponse?.message ||
			this.getDefaultErrorMessage(error.response?.status) ||
			'An unexpected error occurred';

		const enhancedError = new Error(errorMessage);
		enhancedError.statusCode = error.response?.status;
		enhancedError.data = error.response?.data;

		switch (error.response?.status) {
			case 403:
				await this.handleLogout();
				break;
			case 404:
				break;
			case 500:
				break;
		}

		return Promise.reject(enhancedError);
	};

	private getDefaultErrorMessage(status?: number): string {
		switch (status) {
			case 400:
				return 'Bad request';
			case 401:
				return 'Unauthorized';
			case 403:
				return 'Access forbidden';
			case 404:
				return 'Resource not found';
			case 500:
				return 'Internal server error';
			default:
				return '';
		}
	}

	private async handleLogout(): Promise<void> {
		await setAccessTokenToCookies('');
		await setRefreshTokenToCookies('');
		const { logout } = useAuth();
		await logout();
	}

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

	public async getAndReturnHeaders<T = any>(
		url: string,
		config?: InternalAxiosRequestConfig,
	): Promise<AxiosResponse<T, any>> {
		return this.axiosInstance.get<T>(url, config).then((response) => response);
	}

	public async get<T = any>(
		url: string,
		config?: InternalAxiosRequestConfig,
	): Promise<T> {
		const response = await this.axiosInstance.get<T>(url, config);
		return response.data;
	}

	public async post<T = any>(
		url: string,
		data?: any,
		config?: InternalAxiosRequestConfig,
	): Promise<T> {
		const response = await this.axiosInstance.post<T>(url, data, config);
		return response.data;
	}

	public async put<T = any>(
		url: string,
		data?: any,
		config?: InternalAxiosRequestConfig,
	): Promise<T> {
		const response = await this.axiosInstance.put<T>(url, data, config);
		return response.data;
	}

	public async delete<T = any>(
		url: string,
		config?: InternalAxiosRequestConfig,
	): Promise<T> {
		const response = await this.axiosInstance.delete<T>(url, config);
		return response.data;
	}
}

const apiClient = ApiClient.getInstance();

export default apiClient;
