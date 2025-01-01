import {useSearchParams} from 'next/navigation';
import {useRouter} from 'next/router';
import {useCallback, useMemo, useState} from 'react';

const usePagination = () => {
	const router = useRouter();
	const query = useSearchParams();
	const page = useMemo(() => query?.get('page') || '1', [query]);
	const pageSize = useMemo(() => query?.get('pageSize') || '20', [query]);
	const [paginationNavParams, setPaginationNavParams] = useState({
		hasNextPage: false,
		hasPreviousPage: false,
	});

	const onPaginationNavParamsChange = useCallback(
		(newPaginationNavParams: typeof paginationNavParams) => {
			setPaginationNavParams(newPaginationNavParams);
		},
		[],
	);

	const setPage = useCallback(
		(page: number) => {
			router.push({
				query: {
					...router.query,
					page,
				},
			});
		},
		[router],
	);

	const next = useCallback(() => setPage(+page + 1), [setPage, page]);
	const previous = useCallback(() => setPage(+page - 1), [setPage, page]);

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
