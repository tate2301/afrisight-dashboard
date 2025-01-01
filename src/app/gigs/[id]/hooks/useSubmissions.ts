import {useQuery} from '@tanstack/react-query';
import axiosClientInstance from '@/helpers/server/auth/axiosClientInstance';
import {keepPreviousData} from '@tanstack/react-query';

const useSubmissions = (
	_id: string,
	page: number = 1,
	limit: number = 10,
	status: boolean = false,
) => {
	return useQuery({
		queryKey: ['responses', _id, page, limit, status],
		queryFn: async () => {
			const statusPath = status ? '/pending' : '';
			const res = await axiosClientInstance.get(
				`/admin/gigs/${_id}/responses${statusPath}`,
				{
					params: {page, limit},
				},
			);
			return res.data.docs;
		},
		enabled: Boolean(_id),
		placeholderData: keepPreviousData,
	});
};

export default useSubmissions;
