import {useSearchParams} from 'next/navigation';

export type GigShellProps = {
	title: string;
	actions?: React.ReactNode;
	activeTab: string;
	total: number;
	currentPage: number;
	pageSize: number;
	children: React.ReactNode;
	tabs: string[];
	fetchSurveys: () => Promise<any>;
};

export const useGetCurrentTabFromQuery = (tabs: string[]) => {
	const searchParams = useSearchParams();
	const currentTab =
		searchParams.get('tab') || tabs[0].toLowerCase().replaceAll(' ', '-');
	return currentTab;
};