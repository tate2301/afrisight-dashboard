import {Button, Flex, Spinner} from '@radix-ui/themes';
import {ErrorMessage} from '../create-gig-components/extras';
import {useRouter} from 'next/router';

interface FooterProps {
	isPending?: boolean;
	disabled?: boolean;
	error?: string;
	text?: string;
	hasBack?: boolean;
}

const CreateGigFooter = ({
	disabled,
	isPending,
	error,
	text,
	hasBack: isBackEnabled,
}: FooterProps) => {
	const router = useRouter();
	return (
		<Flex
			direction="column"
			align={'start'}
			gap="2">
			<Flex gap={'2'}>
				{isBackEnabled && (
					<Button
						type="button"
						radius="full"
						color="gray"
						variant="soft"
						onClick={router.back}>
						Back
					</Button>
				)}
				<Button
					type="submit"
					radius="full"
					color="indigo"
					disabled={disabled}>
					{isPending ? (
						<>
							<Spinner /> Saving...
						</>
					) : (
						(text ?? 'Save and continue')
					)}
				</Button>
			</Flex>
			{error && (
				<ErrorMessage>
					{(error as any)?.message ?? 'An error occurred'}
				</ErrorMessage>
			)}
		</Flex>
	);
};

export {CreateGigFooter};
