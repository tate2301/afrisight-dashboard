import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { ComponentType, useEffect } from 'react';
import Spinner from './spinner/Spinner';

export function withAuth<T extends object>(WrappedComponent: ComponentType<T>) {
    return function WithAuth(props: T) {
        const { isAuthenticated, isLoading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                router.replace('/'); // Change this to your login page route
            }
        }, [isLoading, isAuthenticated, router]);

        if (isLoading) {
            return <Spinner />;
        }

        if (!isAuthenticated) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}