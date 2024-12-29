
import { cookies } from 'next/headers';

export const setTokens = async (accessToken: string, refreshToken: string) => {
    'use server';
    const cookieStore = cookies();

    // Set Access Token
    cookieStore.set('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
    });

    // Set Refresh Token
    cookieStore.set('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
    });
};


export const clearTokens = async () => {
    'use server';
    const cookieStore = cookies();

    // Clear Access Token
    cookieStore.delete('access_token');

    // Clear Refresh Token
    cookieStore.delete('refresh_token');
};

