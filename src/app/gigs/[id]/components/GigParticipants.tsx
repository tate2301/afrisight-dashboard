import {DataTable} from '@/components/ui/datatable';
import {memo, useCallback, useMemo, useState} from 'react';
import {Response} from './types';
import {evaluateBooleanToYesOrNo} from '@/utils/strings';
import {Profile, User} from '@/utils/types';
import participantsColumns from './tables/participants';

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

const GigParticipants = memo(
	({_id, responses}: {_id: string; responses: Response[]}) => {
		const [selectedRows, setSelectedRows] = useState<GigParticipant[]>([]);

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
						? new Date(
								doc.user.profile.metadata.dateOfBirth,
							).toLocaleDateString()
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
				columns={participantsColumns}
				data={data}
				selectedItems={selectedRows.map((item) => item._id)}
				onSelect={handleSelect}
				tableActions={<TableActions />}
			/>
		);
	},
);

GigParticipants.displayName = 'GigParticipants';

export default GigParticipants;
