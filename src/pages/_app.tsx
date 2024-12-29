import { AppProps } from 'next/app';
import Head from 'next/head';
import '@radix-ui/themes/styles.css';
import './styles.css';
import { StoreProvider } from '../context/Store';
import { Theme } from '@radix-ui/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { GeneralLayoutProvider } from '@/layout/context';

const queryClient = new QueryClient();

function CustomApp({ Component, pageProps }: AppProps) {
	return (
		<Theme radius="large">
			<GeneralLayoutProvider mode='client'>
				<Head>
					<title>CX Mappers Admin</title>
				</Head>
				<QueryClientProvider client={queryClient}>
					<StoreProvider>
						<Component {...pageProps} />
					</StoreProvider>
				</QueryClientProvider>
			</GeneralLayoutProvider>
		</Theme>
	);
}

export default CustomApp;
