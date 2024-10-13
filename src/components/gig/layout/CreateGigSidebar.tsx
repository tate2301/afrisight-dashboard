import {Box} from '@radix-ui/themes';
import {MultiStageProgressItem} from '@/components/gig/create-gig-components/MultistageProgressItem';

interface Stage {
	title: string;
	href: string;
}

interface CreateGigSidebarProps {
	stages: Stage[];
	currentIndex: number;
}

export function CreateGigSidebar({
	stages,
	currentIndex,
}: CreateGigSidebarProps) {
	return (
		<Box className="w-[300px] h-full sticky top-0 p-4 space-y-[28px] pt-16">
			{stages.map((stage, index) => (
				<MultiStageProgressItem
					key={stage.href}
					title={stage.title}
					href={`/gigs/create-gig/${stage.href}`}
					currentIndex={currentIndex}
					index={index}
				/>
			))}
		</Box>
	);
}
