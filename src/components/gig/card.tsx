import Image from 'next/image';
import icons from '../icons';
import Flex from '../design-sytem/flex';
import { Caption, Paragraph, } from '../design-sytem/typography';
import Link from '../design-sytem/link';
import Box from '../design-sytem/box';
import { formatDate } from '@/utils/strings';
import { Button, IconButton } from '@radix-ui/themes';
import { ChevronRight } from '../icons/chevron.right';
import { ArrowRight } from '../icons/arrow.right';

type GigStatus = "pending" | "approved" | "archived";

interface GigProps {
    title: string;
    questions: number;
    responses: number;
    views: number;
    createdDate: string;
    status: GigStatus;
}

const GigCard = ({ title, questions, responses, views, createdDate, status }: GigProps) => {
    const isPending = status === "pending";
    const isPublished = status === "approved";
    const isArchived = status === "archived";
    return (
        <Flex className="items-start px-4 gap-8">
            <div className="w-[100px] h-[100px] relative">
                <Image
                    src="/gig-placeholder.png"
                    alt="Gig Image"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl border border-zinc-400/30"
                />
            </div>
            <Flex className="flex-1 ml-4" alignItems={"start"} css={{ borderBottom: "1px solid $gray2", height: "120px" }}>
                <div className="flex-1 flex flex-col h-[100px]">
                    <Box className="flex flex-col flex-1">
                        <Flex>
                            <Paragraph color={"primary"} weight={"semibold"}>{title}</Paragraph>
                            <GigStatus status={status} />
                        </Flex>
                        <div className="text-sm text-gray-500">
                            {questions} questions • {responses} responses • {views} views
                        </div>
                    </Box>
                    <Caption color={"secondary"} weight={"medium"}>
                        Created {formatDate(createdDate)}
                    </Caption>
                </div>
                <Flex className="ml-4 gap-4 flex items-center">
                    {isPending && <Button variant={"ghost"}>Publish Gig</Button>}
                    <Link css={{ alignItems: "center", display: "flex", gap: 8 }} href="#" className='ml-4'>View
                        <IconButton variant="ghost">
                            <ArrowRight />
                        </IconButton>
                    </Link>
                </Flex>
            </Flex>
        </Flex>
    );
}

const GigStatus = ({ status }: { status: GigStatus }) => {
    const statusIcons = {
        pending: icons.inProgress,
        approved: icons.check_fill,
        archived: icons.x_fill
    }
    const statusText = {
        pending: "Pending approval",
        approved: "Approved",
        archived: "Archived"
    }

    const statusColor = {
        pending: "bg-blue-50 text-blue-700",
        approved: "bg-green-50 text-green-700",
        archived: "bg-gray-50 text-gray-700"
    }

    const StatusIcon = statusIcons[status];

    return (
        <span className={`px-2 pr-4 h-[24px] text-sm font-medium ${statusColor[status]} rounded-full flex items-center`}>
            <StatusIcon className="mr-2 size-4" />
            {statusText[status]}
        </span>
    );
}

export default GigCard;