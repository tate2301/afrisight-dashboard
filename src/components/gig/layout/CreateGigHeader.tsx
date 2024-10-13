import useDisclosure from '@/hooks/useDisclosure';
import {XMarkIcon} from '@heroicons/react/24/solid';
import {
	AlertDialog,
	Badge,
	Button,
	Flex,
	IconButton,
	Text,
} from '@radix-ui/themes';
import {UseMutationResult} from '@tanstack/react-query';
import {useRouter} from 'next/router';

interface CreateGigHeaderProps {
	title: string;
	status: string;
	cancel: UseMutationResult<void, Error, void, unknown>;
}

export function CreateGigHeader({title, status, cancel}: CreateGigHeaderProps) {
	const router = useRouter();

	return (
		<header className="sticky top-0 z-10 bg-white border-b border-zinc-400/30 flex items-center p-3 space-x-4 h-[48px] justify-start">
			<CloseDialog cancel={cancel} />
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

const CloseDialog = ({
	cancel,
}: {
	cancel: UseMutationResult<void, Error, void, unknown>;
}) => {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const router = useRouter();
	const onCancel = async () => {
		cancel.mutateAsync();
		router.push('/gigs');
	};

	return (
		<AlertDialog.Root
			open={isOpen || cancel.isPending}
			onOpenChange={onOpen}>
			<AlertDialog.Trigger>
				<IconButton
					color="gray"
					variant="ghost">
					<XMarkIcon className="w-4 h-4" />
				</IconButton>
			</AlertDialog.Trigger>
			<AlertDialog.Content maxWidth="450px">
				<AlertDialog.Title>Are you sure?</AlertDialog.Title>
				<AlertDialog.Description size="2">
					Are you sure? All your data will be permanently deleted.
				</AlertDialog.Description>

				<Flex
					gap="3"
					mt="4"
					justify="end">
					<AlertDialog.Cancel>
						<Button
							variant="soft"
							color="gray">
							Cancel
						</Button>
					</AlertDialog.Cancel>
					<AlertDialog.Action onClick={onCancel}>
						<Button
							loading={cancel.isPending}
							variant="solid"
							color="red">
							Delete gig
						</Button>
					</AlertDialog.Action>
				</Flex>
			</AlertDialog.Content>
		</AlertDialog.Root>
	);
};
