import {Paragraph} from '@/components/design-sytem/typography';
import {DataTable} from '@/components/ui/datatable';
import TableLink from '@/components/ui/datatable/Link';
import {useFormContext} from '@/forms-builder/context';
import {ColumnDef} from '@tanstack/react-table';
import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {memo, useCallback, useMemo, useState} from 'react';
import {isEmail, isLink} from './utils';
import submissionsColumns from './tables/submissions';
import axiosClientInstance from '@/helpers/server/auth/axiosClientInstance';
import SubmissionsTableActions from './tables/SubmissionsTableActions';
import {Response} from './types';
import {Profile, User} from '@/utils/types';
import {evaluateBooleanToYesOrNo} from '@/utils/strings';

export type GigParticipant = {
	_id: string;
	email: string;
	createdAt: string;
	user: User & {profile: Profile};
	fullName: string;
	isVerified: boolean;
	birthday: string;
	gender: string;
	language: string;
	ethnicity: string;
	education: string;
	occupation: string;
	monthlyIncome: string;
	interests: string;
	hobbies: string;
	hasChildren: string;
	drinksAlcohol: string;
	smokes: string;
	exercises: string;
};

const GigCustomViews = memo(({_id}: {_id: string}) => {
	const {form} = useFormContext();
	const [selectedRows, setSelectedRows] = useState<GigParticipant[]>([]);

	const {data: responses = []} = useQuery<
		{
			user: User & {profile: Profile};
		}[]
	>({
		queryKey: ['responses', _id],
		queryFn: async () => {
			const res = await axiosClientInstance.get(`/admin/gigs/${_id}/responses`);
			return res.data.docs;
		},
		enabled: Boolean(_id),
		placeholderData: keepPreviousData,
	});

	const participantColumns = useMemo(() => {
		if (!form?.fields) return [];

		return form.fields.map((question) => ({
			accessorKey: question.id,
			header: () => (
				<Paragraph className="line-clamp-1 font-medium">
					{question.label}
				</Paragraph>
			),
			cell: ({row}: {row: any}) => {
				const value = row.original[question.id] ?? '-';

				if (isLink(value) || isEmail(value)) {
					return (
						<TableLink
							style={{display: '-webkit-box'}}
							className="line-clamp-1 text-wrap truncate text-ellipsis inline-flex lowercase"
							href={isEmail(value) ? `mailto:${value}` : value}>
							{value}
						</TableLink>
					);
				}

				if (!isNaN(parseInt(value))) {
					return <Paragraph className="text-right w-full">{value}</Paragraph>;
				}

				return value;
			},
			size: 320,
		}));
	}, [form?.fields]);

	const columns = useMemo(
		() =>
			[...submissionsColumns, ...participantColumns] as ColumnDef<
				GigParticipant,
				any
			>[],
		[participantColumns],
	);

	const data: GigParticipant[] = useMemo(
		() =>
			responses.map((doc: {user: User & {profile: Profile}}) => ({
				_id: doc.user._id,
				email: doc.user.email,
				createdAt: doc.user.createdAt,
				user: doc.user,
				fullName: doc.user.profile.firstname + ' ' + doc.user.profile.surname,
				isVerified: doc.user.isEmailVerified,
				birthday: doc.user.profile.metadata?.dateOfBirth
					? new Date(doc.user.profile.metadata.dateOfBirth).toLocaleDateString()
					: 'N/A',
				gender: doc.user.profile.metadata?.gender ?? 'N/A',
				language: doc.user.profile.metadata?.language ?? 'N/A',
				ethnicity: doc.user.profile.metadata?.ethnicity ?? 'N/A',
				education: doc.user.profile.metadata?.education ?? 'N/A',
				occupation: doc.user.profile.metadata?.occupation ?? 'N/A',
				monthlyIncome: doc.user.profile.metadata?.monthlyIncome ?? 'N/A',
				interests: doc.user.profile.metadata?.interests
					? doc.user.profile.metadata.interests.join(', ')
					: 'N/A',
				hobbies: doc.user.profile.metadata?.hobbies
					? doc.user.profile.metadata.hobbies.join(', ')
					: 'N/A',
				hasChildren: evaluateBooleanToYesOrNo(
					doc.user.profile.metadata?.isHasChildren,
				),
				drinksAlcohol: evaluateBooleanToYesOrNo(
					doc.user.profile.metadata?.ifDrinksAlcohol,
				),
				smokes: evaluateBooleanToYesOrNo(doc.user.profile.metadata?.ifSmokes),
				exercises: evaluateBooleanToYesOrNo(
					doc.user.profile.metadata?.ifExercises,
				),
			})),
		[responses],
	);

	const handleSelect = useCallback((rows: GigParticipant[]) => {
		setSelectedRows(rows);
	}, []);

	const TableActions = () => <></>;

	return (
		<DataTable
			top={0}
			columns={columns}
			data={data}
			selectedItems={selectedRows.map((item) => item._id)}
			onSelect={handleSelect}
			tableActions={<TableActions />}
		/>
	);
});

GigCustomViews.displayName = 'GigCustomViews';

export default GigCustomViews;
