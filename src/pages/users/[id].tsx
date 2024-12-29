import { ReactNode, Suspense, useEffect, useState } from 'react';
import { Pencil, DownloadCloud } from 'lucide-react';
import GeneralLayout from '@/layout/GeneralLayout';
import useWithStatus from '@/hooks/useWithStatus';
import { FORM_ROUTES, USER_ROUTES } from '@/lib/api-routes';
import { useRouter } from 'next/router';
import axiosInstance from '@/hooks/useApiFetcher';
import { formatDate } from 'date-fns';
import { Form, Profile } from '@/utils/types';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Box, Button, Flex, Text } from '@radix-ui/themes';
import { ChevronRight } from '@/components/icons/chevron.right';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { XFill } from '@/components/icons/x.fill';
import LoadingPage from '@/components/semantic-page/loading';
import UserActions from '@/components/users/actions';
import Breadcrumbs from '@/components/ui/breadcrumbs';

const UserManagementInterface = ({ id }: { id: string }) => {
	const fetchUserData = async (id: string) => {
		const response = await axiosInstance.get(USER_ROUTES.GET_USER_BY_ID(id));
		return response;
	};

	const {
		data: profile,
		error,
		isLoading,
	} = useSuspenseQuery<Profile, Error>({
		queryKey: ['user', id],
		queryFn: () => fetchUserData(id as string),
	});

	return (
		<GeneralLayout>
			<Suspense fallback={<LoadingPage />}>
				<Flex className="flex p-2">
					{/* Main panel */}
					<Box className="flex-1 px-4 space-y-4">
						<Breadcrumbs items={['Users', profile.user._id]} />
						<div className="flex justify-between items-center mb-8">
							<div>
								<h1 className="text-3xl font-medium text-zinc-900">
									{profile.firstname &&
										profile.firstname + ' ' + profile.surname}{' '}
									{!profile.firstname && profile.user.username}{' '}
								</h1>
								<p>{profile.user.email}</p>
							</div>
							<UserActions
								_id={id}
								status={profile.user.status}
							/>
						</div>

						{/* User details sections */}
						<div className="space-y-8">
							{profile.profileType === 'CLIENT' && (
								<>
									<GigsCreated {...profile} />
									<FormsCreated {...profile} />
								</>
							)}
							{profile.profileType === 'PARTICIPANT' && (
								<>
									<GigsParticipated {...profile} />
									<StorePurchases {...profile} />
									<Vouchers {...profile} />
									<PointsBalanceSection {...profile} />
								</>
							)}
							<SectionTitle
								title="Events"
								subtitle="Events are updated as the user interacts with the platform"
							/>
						</div>
					</Box>

					{/* Details sidebar */}
					<aside className="w-80 p-4">
						<div className="flex justify-between pb-2 border-b  mb-4 ">
							<h2 className="font-medium text-lg text-zinc-900">Details</h2>
							<button className="flex items-center justify-center size-[28px] rounded-md pressable-shadow">
								<Pencil size={16} />
							</button>
						</div>
						<UserDetails profile={profile} />
					</aside>
				</Flex>
			</Suspense>
		</GeneralLayout>
	);
};

const SectionTitle = ({
	title,
	subtitle,
	actions,
}: {
	title: string;
	subtitle?: string;
	actions?: ReactNode;
}) => (
	<div>
		<div className="flex justify-between items-center mb-2 border-b pb-2">
			<h3 className="font-medium text-zinc-900 text-lg">{title}</h3>
			<div className="flex items-center gap-4">{actions}</div>
		</div>
		{subtitle && <p className="text-[13px] text-gray-500">{subtitle}</p>}
	</div>
);

const FormsCreated = (props: Profile) => {
	const [forms, setForms] = useState([]);

	const getFormsForThisUser = async () => {
		const response = await axiosInstance.get(
			FORM_ROUTES.GET_FORMS_FOR_USER_BY_ID(props.user._id),
		);
		setForms(response);
	};

	useEffect(() => {
		if (props) {
			getFormsForThisUser();
		}
	}, [props]);

	return (
		<div className="py-4">
			<SectionTitle
				title="Forms created"
				actions={
					<>
						<button className="button">
							<DownloadCloud size={16} />
							Export
						</button>
					</>
				}
			/>
			<TablePreview
				columns={['ID', 'Name', 'Questions', 'Created']}
				data={forms.map((data: Form) => ({
					...data,
					sections: JSON.stringify(data.sections).length,
					createdAt: formatDate(data.createdAt, 'dd MMM, yyyy'),
				}))}
				fields={['_id', 'name', 'sections', 'createdAt']}
			/>
		</div>
	);
};

const GigsCreated = (props: Profile) => {
	return (
		<div className="py-4">
			<SectionTitle
				title="Gigs"
				actions={
					<>
						<button className="button">
							<DownloadCloud size={16} />
							Export
						</button>
					</>
				}
			/>
			<TablePreview
				columns={[
					'ID',
					'Name',
					'Form',
					'Responses',
					'Reward amount',
					'Additional reward type',
					'Created',
				]}
			/>
		</div>
	);
};

const GigsParticipated = (props: Profile) => {
	return (
		<div className="py-4">
			<SectionTitle
				title="Gigs participated"
				actions={
					<>
						<button className="button">
							<DownloadCloud size={16} />
							Export
						</button>
					</>
				}
			/>
			<TablePreview
				columns={['Name', 'Reward amount', 'Points Awarded', 'Date']}
			/>
		</div>
	);
};

const Vouchers = (props: Profile) => {
	return (
		<div className="py-4">
			<SectionTitle
				title="Vouchers"
				actions={
					<>
						<button className="button">
							<DownloadCloud size={16} />
							Export
						</button>
					</>
				}
			/>
			<TablePreview columns={['Code', 'Expiry date', 'Status', 'Date']} />
		</div>
	);
};

const StorePurchases = (props: Profile) => {
	return (
		<div className="py-4">
			<SectionTitle
				title="Store purchases"
				actions={
					<>
						<button className="button">
							<DownloadCloud size={16} />
							Export
						</button>
					</>
				}
			/>
			<TablePreview columns={['Item', 'Expiry date', 'Points paid', 'Date']} />
		</div>
	);
};

const PointsBalanceSection = (props: Profile) => {
	return (
		<div className="py-4">
			<SectionTitle
				title="Points balance"
				actions={
					<>
						<button className="button">Adjust balance</button>
					</>
				}
			/>
			<div className="mt-2">
				<div className="flex gap-1 mb-1">
					<p className="font-medium text-zinc-900">24</p>
					<p>points</p>
				</div>
				<p className="text-[13px]">User can earn points by participating in gigs</p>
			</div>
		</div>
	);
};

const TablePreview = (props: {
	columns: string[];
	data?: Array<any>;
	fields?: Array<string>;
}) => {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					{props.columns.map((item) => (
						<TableHead
							className="h-[28px] text-[13px]"
							key={item}>
							{item}
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{props.data?.map((item) => (
					<TableRow key={item._id}>
						{props.fields?.map((field) => (
							<TableCell
								key={field}
								className=" text-[13px]">
								{item[field]}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
			<TableCaption>0 results</TableCaption>
		</Table>
	);
};

const UserDetails = (props: { profile: any }) => (
	<div className="space-y-4">
		<DetailItem
			label="Profile ID"
			value={props.profile._id}
		/>
		<DetailItem
			label="Created"
			value={formatDate(props.profile.createdAt, 'dd MMM, yyyy')}
		/>
		<DetailItem
			label="Role"
			value={<p className="tag w-fit mt-1">{props.profile.profileType}</p>}
		/>
		<DetailItem
			label="Email"
			value={
				<div className="flex gap-2">
					<p>{props.profile.user.email}</p>
					<div className="tag">
						{props.profile.user.isEmailVerified ? (
							<p>Verified</p>
						) : (
							<p>Not verified</p>
						)}
					</div>
				</div>
			}
		/>
	</div>
);

const DetailItem = ({
	label,
	value,
}: {
	label: string;
	value: string | ReactNode;
}) => (
	<div>
		<div className="text-zinc-900 font-medium">{label}</div>
		<div className="">{value}</div>
	</div>
);

export const getServerSideProps = async (context: any) => {
	const { id } = context.query;
	return {
		props: {
			id,
		},
	};
};

export default UserManagementInterface;
