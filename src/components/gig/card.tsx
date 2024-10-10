import Image from 'next/image';
import icons from '../icons';
import Flex from '../design-sytem/flex';
import {Caption, Paragraph} from '../design-sytem/typography';
import Link from '../design-sytem/link';
import Box from '../design-sytem/box';
import {formatDate} from '@/utils/strings';
import {Badge, Button, IconButton} from '@radix-ui/themes';
import {ChevronRight} from '../icons/chevron.right';
import {ArrowRight} from '../icons/arrow.right';

type GigStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'COMPLETED';

interface GigProps {
	_id: string;
	title: string;
	questions: number;
	responses: number;
	views: number;
	createdDate: string;
	status: GigStatus;
	coverImage?: string;
}

const GigCard = ({
	title,
	questions,
	responses,
	views,
	createdDate,
	status,
	_id,
	coverImage = '/gig-placeholder.png',
}: GigProps) => {
	const isPending = status === 'DRAFT';
	const isPublished = status === 'ACTIVE';
	const isArchived = status === 'PAUSED';
	return (
		<Link
			href={`/gigs/${_id}`}
			className="mb-4 block">
			<Flex className="items-start px-4 gap-8">
				<div className="w-[100px] h-[100px] relative">
					<Image
						src={coverImage}
						alt="Gig Image"
						layout="fill"
						objectFit="cover"
						className="rounded-xl border border-zinc-400/30"
					/>
				</div>
				<Flex
					className="flex-1 ml-4"
					alignItems={'start'}
					css={{borderBottom: '1px solid $gray2', height: '120px'}}>
					<div className="flex-1 flex flex-col h-[100px]">
						<Box className="flex flex-col flex-1">
							<Flex>
								<Paragraph
									color={'primary'}
									weight={'semibold'}>
									{title}
								</Paragraph>
							</Flex>
							<div className="text-sm text-gray-500">
								{questions} questions • {responses} responses • {views} views
							</div>
						</Box>
						<Caption
							color={'secondary'}
							weight={'medium'}>
							Created {formatDate(createdDate)}
						</Caption>
					</div>
					<Flex className="ml-4 gap-4 flex items-center">
						<GigStatus status={status} />
					</Flex>
				</Flex>
			</Flex>
		</Link>
	);
};

const GigStatus = ({status}: {status: GigStatus}) => {
	const statusIcons = {
		DRAFT: icons.inProgress,
		ACTIVE: icons.check_fill,
		CLOSED: icons.x_fill,
		PAUSED: icons.x_fill,
		COMPLETED: icons.check_fill,
	};
	const statusText = {
		DRAFT: 'Pending approval',
		ACTIVE: 'Ongoing',
		CLOSED: 'Closed',
		PAUSED: 'Paused',
		COMPLETED: 'Completed',
	};

	const statusColor = {
		DRAFT: 'gray',
		ACTIVE: 'green',
		CLOSED: 'yellow',
		PAUSED: 'red',
		COMPLETED: 'green',
	};

	const StatusIcon = statusIcons[status];

	return (
		<Badge
			// @ts-ignore
			color={statusColor[status]}
			className={`pr-4 h-[24px] text-sm font-medium flex items-center`}>
			<StatusIcon className="size-4" />
			{statusText[status] ?? ''}
		</Badge>
	);
};

export default GigCard;
