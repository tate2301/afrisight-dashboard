import {useRouter} from 'next/router';

const useCreateGigPagination = (
	stages: {href: string}[],
	currentIndex: number = 0,
) => {
	const router = useRouter();

	const isFinalPage = () => {
		return currentIndex === stages.length - 1;
	};

	const isFirstPage = () => {
		return currentIndex === 0;
	};

	const nextPage = () => {
		return stages[currentIndex + 1]?.href;
	};

	const prevPage = () => {
		return stages[currentIndex - 1]?.href;
	};

	const saveAndContinue = (id: string) => {
		if (isFinalPage()) {
			router.push(`/gigs/${id}`);
			return;
		}

		const nextRoute = nextPage();
		if (nextRoute) {
			router.push(`/gigs/create-gig/${id}/${nextRoute}`);
			return;
		}
	};

	return {
		isFinalPage,
		isFirstPage,
		nextPage,
		prevPage,
		saveAndContinue,
	};
};

export {useCreateGigPagination as useGigFormNavigation};
