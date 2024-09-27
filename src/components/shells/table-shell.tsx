import {H3, Paragraph} from '../design-sytem/typography';
import {CreateSurvey} from '../add/survey';
import Separator from '../design-sytem/separator';
import SearchBox from '../search/Search';
import Flex from '../design-sytem/flex';
import {IconButton, Section, TabNav, Text} from '@radix-ui/themes';
import SelectWithOptions from '../filter-button';
import {ChevronRight} from '../icons/chevron.right';
import {ChevronLeft} from '../icons/chevron.left';
import Link from 'next/link';
import {GigShellProps} from '.';
import {useRouter} from 'next/router';
import {useCallback} from 'react';
import Box from '../design-sytem/box';
import Button from '../design-sytem/button';

export default function PageWithTableShell({
	children,
	fetchSurveys,
	total,
	currentPage,
	pageSize,
	tabs,
	activeTab,
	title,
	actions,
}: GigShellProps) {
	const router = useRouter();
	const handleTabChange = useCallback(
		(tab: string) => {
			const currentQuery = new URLSearchParams(window.location.search);
			currentQuery.set('tab', tab.toLowerCase().replaceAll(' ', '-'));

			router.push({
				query: {
					tab: currentQuery.get('tab'),
				},
			});
		},
		[router],
	);

	return (
		<Box>
			<TabNav.Root>
				<Flex className="flex-1">
					{tabs.map((tab) => (
						<TabNav.Link
							active={activeTab === tab.toLowerCase().replaceAll(' ', '-')}
							onClick={() => handleTabChange(tab)}>
							{tab}
						</TabNav.Link>
					))}
				</Flex>
				<Flex
					css={{gap: 8}}
					alignItems={'center'}
					className="px-4 py-1">
					{actions}
				</Flex>
			</TabNav.Root>
			{false && (
				<Flex
					css={{padding: '8px 12px'}}
					justifyContent={'between'}
					alignItems={'center'}>
					<SearchBox />
					<Flex
						css={{gap: 8}}
						alignItems={'center'}>
						<SelectWithOptions
							options={['Date created', 'Questions', 'Responses']}
							label="Sort by"
						/>
						<Paragraph className="mx-4">
							Showing {currentPage} to {pageSize} of {total}
						</Paragraph>
						<Button
							size={'icon'}
							colorScheme={'surface'}
							variant={'outline'}>
							<ChevronLeft />
						</Button>
						<Button
							size={'icon'}
							colorScheme={'surface'}
							variant={'outline'}>
							<ChevronRight />
						</Button>
					</Flex>
				</Flex>
			)}
			{children}
		</Box>
	);
}
