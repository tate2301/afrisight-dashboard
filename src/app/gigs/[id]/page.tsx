import {SURVEY_ROUTES} from '@/lib/api-routes';
import {apiUrl} from '@/utils/apiUrl';
import {createAxiosServerInstanceWithPath} from '@/helpers/server/auth/axiosServerInstance';
import GigPage from './components/GigDetailPage';
import {notFound} from 'next/navigation';
import {Gig} from '@/utils/types';
import {Metadata} from 'next';

type GigPageParams = {
	id: string;
};

export async function generateMetadata({
	params: {id},
}: {
	params: GigPageParams;
}): Promise<Metadata> {
	const axiosServerInstance = createAxiosServerInstanceWithPath(`/gigs/${id}`);
	const url = `${apiUrl}${SURVEY_ROUTES.GET_SURVEY_BY_ID(id)}`;

	try {
		const gigResponse = await axiosServerInstance.get<Gig>(url);
		const gig = gigResponse.data;

		return {
			title: `Gig Details: ${gig.name}`,
			description: gig.description,
			openGraph: {
				title: gig.name,
				description: gig.description,
				type: 'website',
			},
			twitter: {
				card: 'summary_large_image',
				title: gig.name,
				description: gig.description,
			},
		};
	} catch (error) {
		return {
			title: 'Gig Details',
			description: 'View gig details',
		};
	}
}

export default async function Page({params: {id}}: {params: GigPageParams}) {
	const axiosServerInstance = createAxiosServerInstanceWithPath(`/gigs/${id}`);
	const url = `${apiUrl}${SURVEY_ROUTES.GET_SURVEY_BY_ID(id)}`;

	const gigResponse = await axiosServerInstance.get<Gig>(url);

	if (!gigResponse) throw notFound();

	return (
		<div className="flex flex-1 flex-col h-full overflow-x-auto overflow-y-hidden">
			<GigPage gig={gigResponse.data} />
		</div>
	);
}
