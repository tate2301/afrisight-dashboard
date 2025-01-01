import {Avatar} from '@radix-ui/themes';
import ProfilePopoverCard from '@/components/ProfilePopoverCard';
import TableLink from '@/components/ui/datatable/Link';
import {Paragraph} from '@/components/design-sytem/typography';
import {ColumnDef} from '@tanstack/react-table';
import {Response} from '../types';
import {Checkbox} from '@/components/ui/aria-components/Checkbox';
import {GigParticipant} from '../GigCustomViews';
import {evaluateBooleanToYesOrNo} from '@/utils/strings';
import {Badge} from '@/components/ui/badge';

const participantsColumns: ColumnDef<GigParticipant>[] = [
	{
		id: 'select',
		header: ({table}) => (
			<Checkbox
				isSelected={
					table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()
				}
				onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({row}) => (
			<div className="flex items-center justify-center sticky-column">
				<Checkbox
					isSelected={row.getIsSelected()}
					onChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			</div>
		),
		enableSorting: false,
		size: 44,
	},
	{
		id: 'email',
		accessorKey: 'email',
		header: 'Email',
		cell: ({row}) => (
			<div className="gap-4 flex items-center sticky-column">
				<ProfilePopoverCard
					{...row.original.user}
					id={row.original.user._id}>
					<Avatar
						className="rounded-full bg-zinc-400/30 w-[24px] h-[24px] flex item-center justify-center"
						fallback={row.original.email.substring(0, 1)}
						src={row.original.user.profile.profilePic}
						alt={'client profile'}
					/>
				</ProfilePopoverCard>
				<TableLink href={`/participants/${row.original._id}`}>
					<Paragraph>{row.original.email}</Paragraph>
				</TableLink>
			</div>
		),
		size: 320,
	},
	{
		id: 'fullName',
		accessorKey: 'fullName',
		header: 'Full Name',
		cell: ({row}) => <Paragraph>{row.original.fullName}</Paragraph>,
		size: 300,
	},
	{
		id: 'isVerified',
		accessorKey: 'isVerified',
		header: 'Verified',
		cell: ({row}) => (
			<Badge>{evaluateBooleanToYesOrNo(row.original.isVerified)}</Badge>
		),
		size: 100,
	},
	{
		id: 'birthday',
		accessorKey: 'birthday',
		header: 'Birthday',
		cell: ({row}) => <Paragraph>{row.original.birthday}</Paragraph>,
		size: 150,
	},
	{
		id: 'gender',
		accessorKey: 'gender',
		header: 'Gender',
		cell: ({row}) => (
			<Paragraph className="capitalize">{row.original.gender}</Paragraph>
		),
		size: 100,
	},
	{
		id: 'language',
		accessorKey: 'language',
		header: 'Language',
		cell: ({row}) => <Paragraph>{row.original.language}</Paragraph>,
		size: 150,
	},
	{
		id: 'ethnicity',
		accessorKey: 'ethnicity',
		header: 'Ethnicity',
		cell: ({row}) => <Paragraph>{row.original.ethnicity}</Paragraph>,
		size: 300,
	},
	{
		id: 'education',
		accessorKey: 'education',
		header: 'Education',
		cell: ({row}) => <Paragraph>{row.original.education}</Paragraph>,
		size: 200,
	},
	{
		id: 'occupation',
		accessorKey: 'occupation',
		header: 'Occupation',
		cell: ({row}) => <Paragraph>{row.original.occupation}</Paragraph>,
		size: 200,
	},
	{
		id: 'monthlyIncome',
		accessorKey: 'monthlyIncome',
		header: 'Monthly Income',
		cell: ({row}) => <Paragraph>{row.original.monthlyIncome}</Paragraph>,
		size: 150,
	},
	{
		id: 'interests',
		accessorKey: 'interests',
		header: 'Interests',
		cell: ({row}) => <Paragraph>{row.original.interests}</Paragraph>,
		size: 300,
	},
	{
		id: 'hobbies',
		accessorKey: 'hobbies',
		header: 'Hobbies',
		cell: ({row}) => <Paragraph>{row.original.hobbies}</Paragraph>,
		size: 300,
	},
	{
		id: 'hasChildren',
		accessorKey: 'hasChildren',
		header: 'Has Children',
		cell: ({row}) => <Badge>{row.original.hasChildren}</Badge>,
		size: 180,
	},
	{
		id: 'drinksAlcohol',
		accessorKey: 'drinksAlcohol',
		header: 'Drinks Alcohol',
		cell: ({row}) => <Badge>{row.original.drinksAlcohol}</Badge>,
		size: 180,
	},
	{
		id: 'smokes',
		accessorKey: 'smokes',
		header: 'Smokes',
		cell: ({row}) => <Badge>{row.original.smokes}</Badge>,
		size: 180,
	},
	{
		id: 'exercises',
		accessorKey: 'exercises',
		header: 'Exercises',
		cell: ({row}) => <Badge>{row.original.exercises}</Badge>,
		size: 180,
	},
];

export default participantsColumns;
