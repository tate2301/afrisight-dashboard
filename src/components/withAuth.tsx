import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { ComponentType, useEffect } from 'react';

export function withAuth<T extends object>(WrappedComponent: ComponentType<T>) {
    return function WithAuth(props: T) {
        const { isAuthenticated, isLoading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                router.replace('/');
            }
        }, [isLoading, isAuthenticated, router]);

        if (isLoading) {
            return <div>Loading...</div>; // You can replace this with a proper loading component
        }

        if (!isAuthenticated) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}