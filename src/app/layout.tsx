import {GeneralLayoutProvider} from '@/layout/context';
import {StoreProvider} from '@/context/Store';
import {ReactNode} from 'react';
import {Inter} from 'next/font/google';
import '../styles/globals.css';

export default function Layout({children}: {children: ReactNode}) {
	return (
		<html>
			<head>
				<link
					rel="preconnect"
					href="https://fonts.googleapis.com"
				/>
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded"
					rel="stylesheet"
				/>
			</head>
			<body className={`subpixel-antialised `}>
				<GeneralLayoutProvider mode="server">
					<StoreProvider>{children}</StoreProvider>
				</GeneralLayoutProvider>
			</body>
		</html>
	);
}
