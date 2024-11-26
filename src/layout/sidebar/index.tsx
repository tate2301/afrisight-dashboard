import { cn } from '@/lib/utils';
import { LogOutIcon, Settings, HelpCircle } from 'lucide-react';
import Box from '../../components/design-sytem/box';
import { useRouter } from 'next/router';
import { NAVBAR_HEIGHT, SIDEBAR_WIDTH } from '../constants';
import Flex from '@/components/design-sytem/flex';
import { Caption, Paragraph } from '@/components/design-sytem/typography';
import Separator from '@/components/design-sytem/separator';
import styled from '@/components/design-sytem/theme';
import Link from 'next/link';
import AddUser from '@/components/modals/create-user';
import { Avatar, Button, Text, DropdownMenu } from '@radix-ui/themes';
import { useAuth } from '@/context/AuthContext';
import { AddTeamMember } from '@/components/icons/team.member.add';
import {
	BuildingStorefrontIcon,
	ChevronDownIcon,
	GiftTopIcon,
	Square2StackIcon,
	Square3Stack3DIcon,
	UserCircleIcon,
} from '@heroicons/react/24/solid';
import { ChevronRight } from '@/components/icons/chevron.right';

import * as React from "react"
import {
	AudioWaveform,
	BookOpen,
	Bot,
	Command,
	Frame,
	GalleryVerticalEnd,
	Map,
	PieChart,
	Settings2,
	SquareTerminal,
} from "lucide-react"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./app-switcher"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar"
// This is sample data.
const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
		{
			name: "Acme Inc",
			logo: GalleryVerticalEnd,
			plan: "Enterprise",
		},
		{
			name: "Acme Corp.",
			logo: AudioWaveform,
			plan: "Startup",
		},
		{
			name: "Evil Corp.",
			logo: Command,
			plan: "Free",
		},
	],
	navMain: [
		{
			title: "Playground",
			url: "#",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: "History",
					url: "#",
				},
				{
					title: "Starred",
					url: "#",
				},
				{
					title: "Settings",
					url: "#",
				},
			],
		},
		{
			title: "Models",
			url: "#",
			icon: Bot,
			items: [
				{
					title: "Genesis",
					url: "#",
				},
				{
					title: "Explorer",
					url: "#",
				},
				{
					title: "Quantum",
					url: "#",
				},
			],
		},
		{
			title: "Documentation",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Introduction",
					url: "#",
				},
				{
					title: "Get Started",
					url: "#",
				},
				{
					title: "Tutorials",
					url: "#",
				},
				{
					title: "Changelog",
					url: "#",
				},
			],
		},
		{
			title: "Settings",
			url: "#",
			icon: Settings2,
			items: [
				{
					title: "General",
					url: "#",
				},
				{
					title: "Team",
					url: "#",
				},
				{
					title: "Billing",
					url: "#",
				},
				{
					title: "Limits",
					url: "#",
				},
			],
		},
	],
	projects: [
		{
			name: "Design Engineering",
			url: "#",
			icon: Frame,
		},
		{
			name: "Sales & Marketing",
			url: "#",
			icon: PieChart,
		},
		{
			name: "Travel",
			url: "#",
			icon: Map,
		},
	],
}

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

const WorkspaceCard = () => {
	const { userProfile, isAuthenticated, logout } = useAuth();
	const fullName = `${userProfile?.firstname ?? ''} ${userProfile?.surname ?? ''}`;
	return (
		<Flex
			className="relative items-center p-2 px-1 space-x-2 bg-white elevated-shadow m-2 rounded-xl"
			css={{ height: NAVBAR_HEIGHT }}>
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

const _AppSidebar = () => {
	const { userProfile, isAuthenticated, logout } = useAuth();
	console.log({ userProfile, isAuthenticated });
	const fullName = `${userProfile?.firstname ?? ''} ${userProfile?.surname ?? ''}`;
	return (
		<Flex
			direction={'column'}
			className="bg-zinc-100 sticky top-0 h-screen flex-shrink-0"
			css={{
				borderRight: '1px solid $gray2',
				width: SIDEBAR_WIDTH,
				gap: 0,
			}}>
			<WorkspaceCard />
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
const SidebarNavItem = ({ Icon, text, href }: SidebarNavItemProps) => {
	const router = useRouter();
	const pathname = router.pathname;
	const active = pathname.includes(href);

	return (
		<Link
			href={href}
			legacyBehavior>
			<a>
				<ListItem
					className={cn(
						'rounded-md hover:bg-zinc-400/20',
						active && 'bg-zinc-400/15 hover:bg-white',
					)}>
					<Icon className="w-4 h-4 mr-4" />
					{text}
					{active && (
						<Caption
							color="tertiary"
							className="ml-auto">
							<ChevronRight className="size-4" />
						</Caption>
					)}
				</ListItem>
			</a>
		</Link>
	);
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}

export default AppSidebar;
