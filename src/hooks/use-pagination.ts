import {useSearchParams} from 'next/navigation';
import {useRouter} from 'next/router';
import {useState} from 'react';

const usePagination = () => {
	const router = useRouter();
	const query = useSearchParams();
	const page = query?.get('page') || '1';
	const pageSize = query?.get('pageSize') || '20';
	const [paginationNavParams, setPaginationNavParams] = useState({
		hasNextPage: false,
		hasPreviousPage: false,
	});

	const onPaginationNavParamsChange = (
		newPaginationNavParams: typeof paginationNavParams,
	) => {
		setPaginationNavParams(newPaginationNavParams);
	};

	const setPage = (page: number) => {
		router.push({
			query: {
				...router.query,
				page,
			},
		});
	};

	const next = () => {
		setPage(+page + 1);
	};

	const previous = () => {
		setPage(+page - 1);
	};

	return {
		page,
		pageSize,
		next,
		previous,
		paginationNavParams,
		onPaginationNavParamsChange,
	};
};

export {usePagination};
