import {useSearchParams} from 'next/navigation';

export type GigShellProps = {
	title: string;
	actions?: React.ReactNode;
	activeTab: string;
	isLoading?: boolean;
	tabs: string[];
	total: number;
	currentPage: number;
	pageSize: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	nextPage: () => void;
	previousPage: () => void;
	fetch: () => Promise<any>;
	onSelect?: (selected: any) => void;
};

export type FilterColumnConfig = {
	label: string;
	type: 'string' | 'number' | 'boolean' | 'date';
	enabled: boolean;
};

export const useGetCurrentTabFromQuery = (tabs: string[]) => {
	const searchParams = useSearchParams();
	const currentTab =
		searchParams?.get('tab') || tabs[0].toLowerCase().replaceAll(' ', '-');
	return currentTab;
};
