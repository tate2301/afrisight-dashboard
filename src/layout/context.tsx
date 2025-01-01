'use client';
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import {Theme} from '@radix-ui/themes';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AuthProvider} from '@/context/AuthContext';
import {useRouter as useAppRouter} from 'next/navigation';
import {useRouter} from 'next/router';
import type {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			retry: 1,
		},
	},
});

type GeneralLayoutContextType = {
	pageTitle: string;
	setPageTitle: (title: string) => void;
};

const GeneralLayoutContext = createContext<
	GeneralLayoutContextType | undefined
>(undefined);

const useGeneralLayoutContext = () => {
	const context = useContext(GeneralLayoutContext);
	if (!context) {
		throw new Error(
			'useGeneralLayoutContext must be used within a GeneralLayoutProvider',
		);
	}
	return context;
};

const useSetPageTitle = (title: string) => {
	const {setPageTitle} = useGeneralLayoutContext();

	useEffect(() => {
		setPageTitle(title);
	}, [title, setPageTitle]);
};

const GeneralLayoutProvider = ({
	children,
	mode = 'client',
}: {
	children: ReactNode;
	mode: 'server' | 'client';
}) => {
	const [pageTitle, setPageTitle] = useState('Dashboard');
	const useSelectedRouter = useMemo(
		() => (mode === 'client' ? useRouter : useAppRouter),
		[mode],
	);
	const router = useSelectedRouter() as AppRouterInstance;

	const value = useMemo(
		() => ({
			pageTitle,
			setPageTitle,
		}),
		[pageTitle],
	);

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider router={router}>
				<GeneralLayoutContext.Provider value={value}>
					<Theme radius="large">{children}</Theme>
				</GeneralLayoutContext.Provider>
			</AuthProvider>
		</QueryClientProvider>
	);
};

export {GeneralLayoutProvider, useGeneralLayoutContext, useSetPageTitle};
