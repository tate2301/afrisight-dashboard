import React, { ReactNode } from 'react';
import Navbar from './navbar';
import AppSidebar from '@/layout/sidebar';
import Separator from '@/components/design-sytem/separator';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@radix-ui/themes';

interface Props {
	children: ReactNode;
}

function GeneralLayout({ children }: Props) {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					onReset={reset}
					fallbackRender={({ resetErrorBoundary }) => (
						<div>
							There was an error!
							<Button onClick={() => resetErrorBoundary()}>Try again</Button>
						</div>
					)}>
					<main className="flex">
						<AppSidebar />
						<div className="flex-1 h-screen relative flex flex-col overflow-y-auto">
							{children}
						</div>
					</main>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}

export default GeneralLayout;
