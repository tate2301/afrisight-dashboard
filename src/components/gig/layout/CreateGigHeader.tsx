import {ArrowLeft} from '@/components/icons/arrow.left';
import {XMarkIcon} from '@heroicons/react/24/solid';
import {Badge, Button, Text} from '@radix-ui/themes';
import {useRouter} from 'next/router';

interface CreateGigHeaderProps {
	title: string;
	status: string;
}

export function CreateGigHeader({title, status}: CreateGigHeaderProps) {
	const router = useRouter();

	const onClose = () => {
		router.back();
	};

	return (
		<header className="sticky top-0 z-10 bg-white border-b border-zinc-400/30 flex items-center p-3 space-x-4 h-[48px] justify-start">
			<Button
				onClick={onClose}
				type="button"
				radius="full"
				variant="ghost"
				color="gray">
				<XMarkIcon className="size-5" />
			</Button>
			<div className="h-full w-px bg-zinc-400/20" />
			<Text
				size={'2'}
				style={{fontWeight: 500}}>
				{title}
			</Text>
			<Badge color="gray">{status}</Badge>
		</header>
	);
}
