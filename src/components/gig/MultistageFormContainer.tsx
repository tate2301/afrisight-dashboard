import {Box, Flex, Text} from '@radix-ui/themes';
import {CreateGigHeader} from '@/components/gig/layout/CreateGigHeader';
import {CreateGigSidebar} from '@/components/gig/layout/CreateGigSidebar';
import {H2} from '../design-sytem/typography';
import {useEffect} from 'react';

interface Stage {
	title: string;
	href: string;
}

interface MultistageFormContainerProps {
	documentTitle: string;
	title: string;
	caption?: string;
	status: string;
	stages: Stage[];
	currentIndex: number;
	children: React.ReactNode;
}

export function MultistageFormContainer({
	documentTitle,
	title,
	caption,
	status,
	stages,
	currentIndex,
	children,
}: MultistageFormContainerProps) {
	return (
		<>
			<CreateGigHeader
				title={documentTitle}
				status={status}
			/>
			<Flex className="w-full h-[calc(100vh-48px)] bg-zinc-50 overflow-y-auto">
				<CreateGigSidebar
					stages={stages}
					currentIndex={currentIndex}
				/>
				<Box className="flex-1 flex justify-center">
					<Box className="max-w-lg w-full mx-auto gap-8 flex-1">
						<Box className="px-4 mb-8 mt-16">
							<H2 className="tracking-tight">{title}</H2>
							{caption && (
								<Text
									size="2"
									color="gray">
									{caption}
								</Text>
							)}
						</Box>
						<Box className="pb-16">{children}</Box>
					</Box>
				</Box>
			</Flex>
		</>
	);
}
