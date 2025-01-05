import Symbol from '@/components/icons/symbol';
import {Flex, RadioCards} from '@radix-ui/themes';

import {Box} from '@radix-ui/themes';

const DifficultySection = ({formik}: {formik: any}) => (
	<Box>
		<RadioCards.Root
			name="difficulty"
			value={formik.values.difficulty}
			onValueChange={(value) => formik.setFieldValue('difficulty', value)}
			defaultValue="easy"
			className="flex gap-8"
			columns={{initial: '1', sm: '3'}}>
			<RadioCards.Item
				value="easy"
				className="p-4 rounded-xl bg-surface-secondary text-left">
				<Flex
					direction="column"
					className="flex flex-col gap-2">
					<p className="text-content-tertiary">
						<Symbol>star</Symbol>
					</p>
					<p
						className="text-base font-bold"
						color={'primary'}>
						Easy
					</p>
					<p className="text-content-secondary">
						Pretty straightforward, no domain experience required.
					</p>
				</Flex>
			</RadioCards.Item>
			<RadioCards.Item
				value="hard"
				className="p-4 rounded-xl bg-surface-secondary text-left">
				<Flex
					direction="column"
					className="flex flex-col gap-2">
					<p className="text-content-tertiary">
						<Symbol>star_half</Symbol>
					</p>
					<p
						className="text-base font-bold"
						color={'primary'}>
						Hard
					</p>
					<p className="text-content-secondary">
						Domain experience might be required, but at the general level
					</p>
				</Flex>
			</RadioCards.Item>
			<RadioCards.Item
				value="extreme"
				className="p-4 rounded-xl bg-surface-secondary text-left">
				<Flex
					direction="column"
					className="flex flex-col gap-2">
					<p className="text-content-tertiary">
						<Symbol>hotel_class</Symbol>
					</p>
					<p
						className="text-base font-bold"
						color={'primary'}>
						Extreme
					</p>
					<p className="text-content-secondary">
						Requires in-depth knowledge of the subject-matter.
					</p>
				</Flex>
			</RadioCards.Item>
		</RadioCards.Root>
	</Box>
);

export default DifficultySection;
