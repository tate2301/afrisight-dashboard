import {useSearchParams} from 'next/navigation';

export type GigShellProps = {
	title: string;
	actions?: React.ReactNode;
	activeTab: string;
	total: number;
	currentPage: number;
	pageSize: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	isLoading?: boolean;
	children: React.ReactNode;
	tabs: string[];
	nextPage: () => void;
	previousPage: () => void;
	fetch: () => Promise<any>;
};

export const useGetCurrentTabFromQuery = (tabs: string[]) => {
	const searchParams = useSearchParams();
	const currentTab =
		searchParams.get('tab') || tabs[0].toLowerCase().replaceAll(' ', '-');
	return currentTab;
};
