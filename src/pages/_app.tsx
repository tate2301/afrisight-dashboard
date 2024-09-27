import {AppProps} from 'next/app';
import Head from 'next/head';
import '@radix-ui/themes/styles.css';
import './styles.css';
import {StoreProvider} from '../context/Store';
import {Theme} from '@radix-ui/themes';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AuthProvider} from '@/context/AuthContext';
import {GeneralLayoutProvider} from '@/layout/context';

const queryClient = new QueryClient();

function CustomApp({Component, pageProps}: AppProps) {
	return (
		<Theme radius="large">
			<GeneralLayoutProvider>
				<Head>
					<title>CX Mappers Admin</title>
				</Head>
				<AuthProvider>
					<QueryClientProvider client={queryClient}>
						<StoreProvider>
							<Component {...pageProps} />
						</StoreProvider>
					</QueryClientProvider>
				</AuthProvider>
			</GeneralLayoutProvider>
		</Theme>
	);
}

export default CustomApp;
