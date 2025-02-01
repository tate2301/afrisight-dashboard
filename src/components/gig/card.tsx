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
import {Form} from '@/forms-builder/types';

type GigStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'COMPLETED';

interface GigProps {
	_id: string;
	title: string;
	views: number;
	createdDate: string;
	status: GigStatus;
	coverImage?: string;
	form: string;
	gig_submissions: any[];
}

const GigCard = ({
	title,
	views,
	createdDate,
	status,
	_id,
	coverImage = '/gig-placeholder.png',
	form,
	gig_submissions,
}: GigProps) => {
	const isPending = status === 'DRAFT';
	const isPublished = status === 'ACTIVE';
	const isArchived = status === 'PAUSED';
	coverImage = coverImage === 'null' ? '/gig-placeholder.png' : coverImage;
	const parsedForm: Form = JSON.parse(form ?? '{}');

	return (
		<Link
			href={`/gigs/${_id}`}
			className="py-2 flex">
			<Flex className="items-center px-4 gap-8 w-full">
				<div className="w-[48px] h-[48px] relative">
					<Image
						src={coverImage ? coverImage : '/gig-placeholder.png'}
						alt="Gig Image"
						layout="fill"
						objectFit="cover"
						className="rounded-lg border border-zinc-400/30"
					/>
				</div>
				<Flex
					className="flex-1 ml-4 h-[48px]"
					alignItems={'start'}>
					<div className="flex-1 flex flex-col h-full">
						<Box className="flex flex-col flex-1 items-start">
							<Flex>
								{title && (
									<Paragraph
										color={'primary'}
										weight={'bold'}>
										{title}
									</Paragraph>
								)}
								{!title && (
									<Paragraph
										color={'tertiary'}
										weight={'medium'}
										className="italic">
										Missing title
									</Paragraph>
								)}
							</Flex>
							<div className="text-[13px] text-gray-500">
								{parsedForm.fields?.length ?? 0} questions •{' '}
								{gig_submissions.length} responses • {views} views
							</div>
						</Box>
					</div>
					<Flex className="ml-4 gap-4 flex items-center h-full">
						<GigStatus status={status} />
						<Caption
							color={'secondary'}
							weight={'medium'}
							className="ml-4">
							Created {formatDate(createdDate)}
						</Caption>
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
			className={`pr-4 h-[24px] text-[13px] font-medium flex items-center`}>
			<StatusIcon className="size-4" />
			{statusText[status] ?? ''}
		</Badge>
	);
};

export default GigCard;
