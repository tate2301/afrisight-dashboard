import {
	getAccessTokenFromCookies,
	getRefreshTokenFromCookies,
} from '@/hooks/cookies';
import {apiUrl} from '@/utils/apiUrl';
import axios from 'axios';
import {CookieStore} from './cookies';
import {ServerCookieStore} from './cookies/server';
import {ClientCookieStore} from './cookies/client';

const axiosClientInstance = axios.create({
	baseURL: apiUrl,
	withCredentials: true, // Send cookies with requests
});

// Request Interceptor
axiosClientInstance.interceptors.request.use(
	async (config) => {
		const accessToken = getAccessTokenFromCookies();
		if (accessToken) {
			config.headers['Authorization'] = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => Promise.reject(error),
);

// Response Interceptor
axiosClientInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status !== 401 || originalRequest._retry) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		try {
			// Call the `/api/auth/refresh` route to renew the token
			const refreshResponse = await fetch(`${apiUrl}/auth/token/refresh`, {
				method: 'POST',
				body: JSON.stringify({refreshToken: getRefreshTokenFromCookies()}),
			});

			if (!refreshResponse.ok) {
				throw new Error('Failed to refresh token');
			}

			const {access_token} = await refreshResponse.json();

			if (!access_token) throw new Error('UnAuthorized');

			document.cookie = `access_token=${access_token}; path=/`;

			// Retry the original request with the new token
			originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
			return axiosClientInstance(originalRequest);
		} catch (refreshError) {
			return Promise.reject(refreshError);
		}
	},
);

export default axiosClientInstance;
