import {Flex, Text} from '@radix-ui/themes';
import {motion} from 'framer-motion';
import {ReactNode} from 'react';

type TableActionsProps = {
	selectedItems: string[];
	actions: ReactNode;
};

const AnimatedFlex = motion(Flex);
const variants = {
	hidden: {
		opacity: 0,
		bottom: -100,
		scale: 0.7,
		transition: {duration: 0.2},
	},
	visible: {
		opacity: 1,
		bottom: 32,
		scale: 1,
		transition: {duration: 0.2},
	},
};

export default function TableActions(props: TableActionsProps) {
	return (
		<AnimatedFlex
			variants={variants}
			initial="hidden"
			animate="visible"
			exit="hidden"
			style={{
				padding: '12px 6px',
				paddingLeft: 20,
				position: 'fixed',
				bottom: 32,
				borderRadius: 22,
				backdropFilter: 'blur',
				zIndex: 1000,
				height: 44,
				alignItems: 'center',
				backgroundColor: '#000',
			}}
			className="inset-x-0 mx-auto max-w-lg w-full pressable-shadow justify-between">
			<Text className="text-white flex-1 font-medium">
				{props.selectedItems.length} selected
			</Text>
			<Flex
				gap={'2'}
				className="text-white">
				{props.actions}
			</Flex>
		</AnimatedFlex>
	);
}
