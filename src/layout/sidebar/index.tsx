import {cn} from '@/lib/utils';
import {
	Building,
	FileText,
	Gift,
	Home,
	Inbox,
	LogOutIcon,
	PersonStanding,
	Store,
	Users,
	Settings,
	HelpCircle,
} from 'lucide-react';
import {usePathname} from 'next/navigation';
import Box from '../../components/design-sytem/box';
import {useRouter} from 'next/router';
import {NAVBAR_HEIGHT, SIDEBAR_WIDTH} from '../constants';
import Image from 'next/image';
import Flex from '@/components/design-sytem/flex';
import {Caption, Paragraph} from '@/components/design-sytem/typography';
import Separator from '@/components/design-sytem/separator';
import styled from '@/components/design-sytem/theme';
import Link from 'next/link';
import {PlusIcon, PlusSmallIcon} from '@heroicons/react/24/outline';
import {TeamMember} from '@/components/icons/team.member';
import AddUser from '@/components/modals/create-user';
import {Avatar, Button, Text, DropdownMenu} from '@radix-ui/themes';
import {useAuth} from '@/context/AuthContext';
import {AddTeamMember} from '@/components/icons/team.member.add';
import {ChevronDownIcon} from '@heroicons/react/24/solid';
import {ChevronRight} from '@/components/icons/chevron.right';

interface UserProfile {
	firstName?: string;
	lastName?: string;
	email: string;
	profilePicture?: string;
}

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
	const {userProfile, isAuthenticated, logout} = useAuth();
	console.log({userProfile, isAuthenticated});
	const fullName = `${userProfile?.firstname ?? ''} ${userProfile?.surname ?? ''}`;
	return (
		<Flex
			direction={'column'}
			className="bg-zinc-50 sticky top-0 h-screen flex-shrink-0"
			css={{
				borderRight: '1px solid $gray2',
				width: SIDEBAR_WIDTH,
				gap: 0,
			}}>
			<Flex
				className="relative items-center p-2 px-1 space-x-2 bg-white shadow-sm border border-zinc-400/30 m-2 rounded-xl"
				css={{height: NAVBAR_HEIGHT}}>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Flex className="items-center space-x-2 cursor-pointer w-full">
							<Avatar
								fallback={(userProfile?.user.email[0] ?? '').toUpperCase()}
								src={userProfile?.profilePicture}
								alt="profile"
								radius="large"
								className="shadow-sm border border-white"
							/>
							<Box className="flex-1">
								<Paragraph
									weight={'bold'}
									color={'primary'}
									className="tracking-tight">
									{fullName.trim() ? fullName : 'CX Mappers Admin'}
								</Paragraph>
								<Caption
									weight={'bold'}
									color={'tertiary'}
									className="tracking-tight">
									{userProfile?.user.email}
								</Caption>
							</Box>
							<Button
								variant="ghost"
								color="gray">
								<ChevronDownIcon className="w-4 h-4" />
							</Button>
						</Flex>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content className="w-64 p-0">
						<DropdownMenu.Item>
							<Link href="/settings">
								<Flex alignItems="center">
									<Settings className="w-4 h-4 mr-2" />
									Settings
								</Flex>
							</Link>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<Link href="/help">
								<Flex alignItems="center">
									<HelpCircle className="w-4 h-4 mr-2" />
									Get Help
								</Flex>
							</Link>
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							color="red"
							onClick={logout}>
							<Flex alignItems="center">
								<LogOutIcon className="w-4 h-4 mr-2" />
								Sign Out
							</Flex>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Flex>
			<Flex
				direction={'column'}
				className="p-2 space-y-2">
				<AddUser
					trigger={
						<Button
							color={'gray'}
							variant={'soft'}
							radius="full">
							<AddTeamMember className="size-5 mr-2" />
							Invite an administrator
						</Button>
					}
				/>
			</Flex>
			<Separator />
			<Box className="mt-4">
				<div className="px-4 py-2 text-sm font-medium text-gray-500">
					<Text
						size={'1'}
						className="uppercase">
						Platform NAVIGATION
					</Text>
				</div>
				<ul className="flex flex-col gap-1 p-2 flex-1">
					{sidebarNavItems.map((item, index) => (
						<SidebarNavItem
							key={index}
							{...item}
							Icon={item.Icon}
						/>
					))}
				</ul>
			</Box>
		</Flex>
	);
};

const ListItem = styled('li', {
	display: 'flex',
	alignItems: 'center',
	padding: '$2 $3',
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
					active && 'bg-zinc-100 hover:bg-white',
				)}>
				<Icon className="w-4 h-4 mr-2" />
				{text}
				{active && (
					<Caption
						color="tertiary"
						className="ml-auto">
						<ChevronRight className="size-4" />
					</Caption>
				)}
			</ListItem>
		</Link>
	);
};

export default Sidebar;
