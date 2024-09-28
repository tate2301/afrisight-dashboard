import {AlertDialog, Button, Flex} from '@radix-ui/themes';
import {ReactNode, useEffect, useState} from 'react';

const ActionAlertDialog = ({
	callback,
	trigger,
	title,
	description,
	actionLabel,
	isLoading,
	color,
}: {
	title: string;
	description: string;
	actionLabel: string;
	callback: () => Promise<void>;
	isLoading?: boolean;
	trigger: ReactNode;
	color: 'green' | 'red' | 'blue';
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const onSubmit = async () => {
		callback();
	};

	useEffect(() => {
		if (!isLoading && isOpen) {
			setIsOpen(false);
		}
	}, [isLoading]);

	return (
		<AlertDialog.Root
			open={isOpen}
			onOpenChange={setIsOpen}>
			<AlertDialog.Trigger>{trigger}</AlertDialog.Trigger>
			<AlertDialog.Content maxWidth="450px">
				<AlertDialog.Title>{title}</AlertDialog.Title>
				<AlertDialog.Description size="2">
					{description}
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
					<Button
						onClick={onSubmit}
						disabled={isLoading}
						loading={isLoading}
						variant="solid"
						color={color}>
						{actionLabel}
					</Button>
				</Flex>
			</AlertDialog.Content>
		</AlertDialog.Root>
	);
};

export default ActionAlertDialog;
