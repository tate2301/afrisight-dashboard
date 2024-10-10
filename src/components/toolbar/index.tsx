import {Button, Flex, Text} from '@radix-ui/themes';

export default function Toolbar() {
	return (
		<Flex className="fixed top-0 z-[2000] bg-white justify-center items-center h-[48px] w-screen select-shadow">
			<Flex className="container mx-auto px-4 justify-between items-center">
				<Text>Quick actions</Text>
				<Flex
					gap="2"
					className="items-center">
					<Button color="red">Delete</Button>
					<Button
						color="gray"
						variant="surface">
						Edit
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
}
