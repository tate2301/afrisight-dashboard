import {Text} from '@radix-ui/themes';
import multiStageProgressItem from './multistage-progress.module.css';
import Link from 'next/link';
import {CheckFill} from '@/components/icons/check.fill';

const MultiStageProgressItem = ({
	currentIndex,
	index,
	title,
	href,
}: {
	index: number;
	href: string;
	title: string;
	currentIndex: number;
}) => {
	return (
		<Link
			href={href}
			data-active={currentIndex === index}
			data-completed={currentIndex > index}
			className={multiStageProgressItem.item}>
			{currentIndex > index && <CheckFill className="size-[24px] relative" />}
			<Text
				size="2"
				weight={'medium'}>
				{title}
			</Text>
		</Link>
	);
};

export {MultiStageProgressItem};
