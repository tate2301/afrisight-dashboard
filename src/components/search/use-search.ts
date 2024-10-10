import {useSearchParams} from 'next/navigation';
import {useRouter} from 'next/router';

const useSearch = () => {
	const router = useRouter();
	const query = useSearchParams();
	const s = query.get('s') || '';

	const setSearchQuery = (value: string) => {
		router.push({
			query: {
				...router.query,
				s: value,
			},
		});
	};

	const clearSearchQuery = () => {
		router.push(
			{
				query: {
					...router.query,
					s: undefined,
				},
			},
			{},
			{shallow: true},
		);
	};

	return {
		value: s,
		setSearchQuery,
		clearSearchQuery,
	};
};

export {useSearch};
