"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NextRouter, } from 'next/router';
import { useRouter } from "next/navigation"
import apiClient from '@/hooks/useApiFetcher';
import { getAccessTokenFromCookies, getRefreshTokenFromCookies, setAccessTokenToCookies, setRefreshTokenToCookies } from '@/hooks/cookies';
import { AUTH_ROUTES } from '@/lib/api-routes';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface UserProfile {
    id: string;
    email: string;
    user: {
        email: string;
    }
    profilePicture: string;
    firstname: string;
    surname: string
    // Add other user profile fields as needed
}

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    userProfile: UserProfile | null;
    login: (accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
    router: NextRouter | AppRouterInstance
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, router }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = await getAccessTokenFromCookies();
            const refreshToken = await getRefreshTokenFromCookies();

            if (accessToken && refreshToken) {
                try {
                    const profile = await apiClient.get(AUTH_ROUTES.PROFILE);
                    setUserProfile(profile);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    setIsAuthenticated(false);
                    await logout();
                }
            } else {
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (accessToken: string, refreshToken: string) => {
        await setAccessTokenToCookies(accessToken);
        await setRefreshTokenToCookies(refreshToken);

        try {
            const profile = await apiClient.get(AUTH_ROUTES.PROFILE);
            setUserProfile(profile);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to fetch user profile after login:', error);
            throw error;
        }
    };

    const logout = async () => {
        setIsAuthenticated(false);
        setUserProfile(null);
        await setAccessTokenToCookies('');
        await setRefreshTokenToCookies('');
        router.push('/'); // Change this to your login page route
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, userProfile, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};