import {cn} from '@/lib/utils';
import {
	Building,
	FileText,
	Gift,
	Home,
	Inbox,
	PersonStanding,
	Store,
	Users,
} from 'lucide-react';
import {usePathname} from 'next/navigation';
import Box from '../../components/design-sytem/box';
import {useRouter} from 'next/router';
import {NAVBAR_HEIGHT, SIDEBAR_WIDTH} from '../constants';
import Image from 'next/image';
import Flex from '@/components/design-sytem/flex';
import {Paragraph} from '@/components/design-sytem/typography';
import Separator from '@/components/design-sytem/separator';
import styled from '@/components/design-sytem/theme';
import Link from 'next/link';
import Button from '@/components/design-sytem/button';
import {PlusIcon, PlusSmallIcon} from '@heroicons/react/24/outline';
import {TeamMember} from '@/components/icons/team.member';
import AddUser from '@/components/modals/create-user';

const sidebarNavItems: SidebarNavItemProps[] = [
	// {
	//     Icon: Home,
	//     text: "Home",
	//     href: "/home"
	// },
	{
		Icon: FileText,
		text: 'Gigs',
		href: '/gigs',
	},
	{
		Icon: Users,
		text: 'Administrators',
		href: '/users',
	},
	{
		Icon: Building,
		text: 'Clients',
		href: '/clients',
	},
	{
		Icon: Gift,
		text: 'Rewards',
		href: '/rewards',
	},
	// {
	//     Icon: PersonStanding,
	//     text: "Participants",
	//     href: "/participants"
	// },
	// {
	//     Icon: Store,
	//     text: "Store",
	//     href: "/store"
	// },
	// {
	//     Icon: Inbox,
	//     text: "Payout requests",
	//     href: "/payout-requests"
	// }
];

const Sidebar = () => {
	return (
		<Flex
			direction={'column'}
			className="bg-zinc-50 sticky top-0 h-screen"
			css={{
				borderRight: '1px solid $gray2',
				width: SIDEBAR_WIDTH,
				gap: 0,
				backgroundColor: '$gray1',
			}}>
			<Flex
				className="relative items-center"
				css={{height: NAVBAR_HEIGHT}}>
				<Image
					src={'/cx_mappers_logo.svg'}
					width={44}
					height={44}
					alt="CX Mappers Logo"
					className="mr-2"
				/>
				<Paragraph
					weight={'bold'}
					color={'primary'}
					className="tracking-tight">
					CX Mappers
				</Paragraph>
			</Flex>
			<Separator />
			<ul className="flex flex-col gap-1 p-2 flex-1">
				{sidebarNavItems.map((item, index) => (
					<SidebarNavItem
						key={index}
						{...item}
						Icon={item.Icon}
					/>
				))}
			</ul>
			<Flex
				direction={'column'}
				className="p-2 space-y-2">
				<AddUser
					trigger={
						<Button
							colorScheme={'surface'}
							variant={'outline'}
							css={{backgroundColor: '$white'}}>
							<TeamMember className="size-5 mr-2" />
							Add a team member
						</Button>
					}
				/>
			</Flex>
		</Flex>
	);
};

const ListItem = styled('li', {
	display: 'flex',
	alignItems: 'center',
	padding: '$1 $3',
	borderRadius: '8px',
	fontWeight: '500',
	fontSize: '14px',
	lineHeight: '1.5',
	'&:hover': {
		backgroundColor: '$gray2',
	},
});

type SidebarNavItemProps = {
	Icon: React.ElementType;
	text: string;
	href: string;
};
const SidebarNavItem = ({Icon, text, href}: SidebarNavItemProps) => {
	const router = useRouter();
	const pathname = router.pathname;
	const active = pathname.includes(href);

	return (
		<Link href={href}>
			<ListItem
				className={cn(
					'rounded-md hover:bg-zinc-400/20',
					active && 'bg-zinc-400/20 hover:bg-zinc-100',
				)}>
				<Icon className="w-4 h-4 mr-2" />
				{text}
			</ListItem>
		</Link>
	);
};

export default Sidebar;
