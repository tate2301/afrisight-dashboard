import {Flex, Text} from '@radix-ui/themes';
import Spinner from '../spinner/Spinner';

export default function LoadingPage() {
	return (
		<Flex className="h-screen w-screen fixed top-0 left-0 bg-white bg-opacity-50 z-50">
			<Flex>
				<Spinner />
				<Text>Loading...</Text>
			</Flex>
		</Flex>
	);
}
