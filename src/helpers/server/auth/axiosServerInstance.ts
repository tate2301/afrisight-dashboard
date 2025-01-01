import axios from 'axios';
import {revalidatePath} from 'next/cache';
import {cookies, headers} from 'next/headers';
import {apiUrl} from '@/utils/apiUrl';
import {ServerCookieStore} from './cookies/server';

interface AxiosServerConfig {
	currentPath?: string;
}

function getCurrentPath(fallbackPath?: string) {
	const headersList = headers();
	return headersList.get('x-invoke-path') || fallbackPath || '/';
}

function createAxiosServerInstance(config?: AxiosServerConfig) {
	const instance = axios.create({
		baseURL: apiUrl,
		withCredentials: true,
	});

	// Request Interceptor
	instance.interceptors.request.use(
		async (config) => {
			const cookieStore = new ServerCookieStore();
			const refreshToken = cookieStore.getRefreshToken();
			const accessToken = cookieStore.getAccessToken();

			// Log tokens for debugging
			console.log('Request Interceptor:', {refreshToken, accessToken});

			if (accessToken) {
				config.headers['Authorization'] = `Bearer ${accessToken}`;
			}

			return config;
		},
		(error) => Promise.reject(error),
	);

	// Response Interceptor
	instance.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config;

			if (error.response?.status !== 401 || originalRequest._retry) {
				return Promise.reject(error);
			}

			originalRequest._retry = true;

			try {
				const cookieStore = new ServerCookieStore();
				let refreshToken = cookieStore.getRefreshToken();

				// Log refresh token for debugging
				console.log('Response Interceptor - Refresh Token:', refreshToken);

				if (!refreshToken) {
					console.warn(
						'Refresh token is undefined - forcing another cookie read...',
					);
					// Optionally wait a moment
					await new Promise((res) => setTimeout(res, 50));
					const secondCookieStore = new ServerCookieStore();
					refreshToken = secondCookieStore.getRefreshToken();
					if (!refreshToken) {
						console.error('Refresh token is still undefined - aborting');
						throw new Error('No refresh token found');
					}
				}

				const refreshResponse = await fetch(`${apiUrl}/auth/token/refresh`, {
					method: 'POST',
					body: JSON.stringify({refreshToken}),
				});

				if (!refreshResponse.ok) {
					throw new Error('Failed to refresh token');
				}

				const {access_token} = await refreshResponse.json();

				if (!access_token) throw new Error('UnAuthorized');

				cookieStore.setAccessToken(access_token);

				originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
				return instance(originalRequest);
			} catch (refreshError) {
				// Revalidate the current path if provided, otherwise fallback to root
				revalidatePath(config?.currentPath ?? '/');
				return Promise.reject(refreshError);
			}
		},
	);

	return instance;
}

export function createAxiosServerInstanceWithPath(fallbackPath?: string) {
	const currentPath = getCurrentPath(fallbackPath);
	return createAxiosServerInstance({currentPath});
}

export default createAxiosServerInstance;
