'use client';
import {cn} from '@/lib/utils';
import {LogOutIcon, Settings, HelpCircle} from 'lucide-react';
import Box from '../../components/design-sytem/box';
import {NAVBAR_HEIGHT, SIDEBAR_WIDTH} from '../constants';
import Flex from '@/components/design-sytem/flex';
import {Caption, Paragraph} from '@/components/design-sytem/typography';
import styled from '@/components/design-sytem/theme';
import Link from 'next/link';
import {Avatar, DropdownMenu} from '@radix-ui/themes';
import {useAuth} from '@/context/AuthContext';
import {
	BuildingStorefrontIcon,
	ChevronDownIcon,
	GiftTopIcon,
	Square3Stack3DIcon,
	UserCircleIcon,
} from '@heroicons/react/24/solid';

const sidebarNavItems: SidebarNavItemProps[] = [
	// {
	//     Icon: Home,
	//     text: "Home",
	//     href: "/home"
	// },
	{
		Icon: Square3Stack3DIcon,
		text: 'Gigs',
		href: '/gigs',
	},
	{
		Icon: UserCircleIcon,
		text: 'Administrators',
		href: '/users',
	},
	{
		Icon: BuildingStorefrontIcon,
		text: 'Clients',
		href: '/clients',
	},
	{
		Icon: GiftTopIcon,
		text: 'Rewards',
		href: '/rewards',
	},
];

const WorkspaceCard = () => {
	const {userProfile, isAuthenticated, logout} = useAuth();
	const fullName = `${userProfile?.firstname ?? ''} ${userProfile?.surname ?? ''}`;
	return (
		<Flex
			className="relative items-center py-2 pl-4 px-2 space-x-2 bg-white pressable-shadow m-2 rounded-xl"
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
						<button className="p-2">
							<ChevronDownIcon className="w-4 h-4" />
						</button>
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
	);
};

const Sidebar = () => {
	const {userProfile, isAuthenticated, logout} = useAuth();
	console.log({userProfile, isAuthenticated});
	const fullName = `${userProfile?.firstname ?? ''} ${userProfile?.surname ?? ''}`;
	return (
		<Flex
			direction={'column'}
			className="sticky top-0 h-screen flex-shrink-0"
			css={{
				borderRight: '1px solid $gray2',
				width: SIDEBAR_WIDTH,
				gap: 0,
				backgroundColor: '#FAF9F7',
			}}>
			<WorkspaceCard />

			<Box className="mt-4">
				<div className="px-4 py-2 text-gray-500">
					<p className="text-xs uppercase font-semibold">NAVIGATION</p>
				</div>
				<ul className="flex flex-col gap-1 p-1 flex-1">
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
	padding: '8px 12px',
	borderRadius: '8px',
	fontWeight: '500',
	lineHeight: '1.5',
	fontSize: '14px',
	'&:hover': {
		backgroundColor: '$gray2',
	},
	height: 32,
});

type SidebarNavItemProps = {
	Icon: React.ElementType;
	text: string;
	href: string;
};
const SidebarNavItem = ({Icon, text, href}: SidebarNavItemProps) => {
	return (
		<Link href={href}>
			<ListItem
				className={cn('rounded-md hover:bg-zinc-400/20 p-2 text-zinc-800')}>
				<Icon className="w-4 h-4 mr-4" />
				{text}
			</ListItem>
		</Link>
	);
};

export default Sidebar;
