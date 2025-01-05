import {Flex} from '@radix-ui/themes';

import {Paragraph} from '@/components/design-sytem/typography';
import {Box, RadioCards} from '@radix-ui/themes';
import Symbol from '@/components/icons/symbol';

const QuestionOrderingSection = ({formik}: {formik: any}) => (
	<Box
		className="mb-6"
		style={{maxWidth: 800}}>
		<RadioCards.Root
			name="questionOrdering"
			value={formik.values.questionOrdering}
			onValueChange={(value) => formik.setFieldValue('questionOrdering', value)}
			defaultValue="preserve"
			className="flex gap-8"
			columns={{initial: '1', sm: '3'}}>
			<RadioCards.Item
				value="preserve"
				className="p-4 rounded-xl bg-surface-secondary">
				<Flex
					direction="column"
					className="text-left flex flex-col gap-2">
					<p className="text-content-tertiary">
						<Symbol>low_priority</Symbol>
					</p>
					<p
						className="text-base font-bold"
						color={'primary'}>
						Preserve order
					</p>
					<p className="text-content-secondary">
						Questions will be presented in the order they were added.
					</p>
				</Flex>
			</RadioCards.Item>
			<RadioCards.Item
				value="shuffle"
				className="p-4 rounded-xl bg-surface-secondary">
				<Flex
					direction="column"
					className="text-left flex flex-col gap-2">
					<p className="text-content-tertiary">
						<Symbol>shuffle</Symbol>
					</p>
					<p
						className="text-base font-bold"
						color={'primary'}>
						Shuffle mode
					</p>
					<p className="text-content-secondary">
						Shuffle the questions every time they're presented.
					</p>
				</Flex>
			</RadioCards.Item>
		</RadioCards.Root>
	</Box>
);

export default QuestionOrderingSection;
