import Box from '@/components/design-sytem/box';
import Separator from '@/components/design-sytem/separator';
import { Paragraph, H3 } from '@/components/design-sytem/typography';
import { RadioCards, Text } from '@radix-ui/themes';
import { ListOrdered, ShuffleIcon } from 'lucide-react';
import styles from './gig-behavior.module.css';
import { cn } from '@/lib/utils';

type GigBehaviorProps = {
	formik: any;
};

export const GigBehavior = ({ formik }: GigBehaviorProps) => (
	<>
		<Box css={{ maxWidth: 800 }}>
			<Box className="mb-4">
				<Text
					weight="medium"
					size="4">
					Question ordering
				</Text>
				<Paragraph className="mb-4 text-[13px]">
					Configure how questions are presented to participants of this gig.
				</Paragraph>
			</Box>
			<RadioCards.Root
				name="questionOrdering"
				value={formik.values.questionOrdering}
				onValueChange={(value) =>
					formik.setFieldValue('questionOrdering', value)
				}
				defaultValue="preserve">
				<RadioCards.Item
					value="preserve"
					className={cn('flex flex-col items-start')}>
					<Paragraph color={'secondary'}>
						<ListOrdered className="size-5" />
					</Paragraph>
					<Paragraph
						weight="bold"
						color="primary">
						Preserve order
					</Paragraph>
					<Paragraph>
						Questions will be presented in the order they were added.
					</Paragraph>
				</RadioCards.Item>
				<RadioCards.Item
					value="shuffle"
					className="flex flex-col items-start">
					<Paragraph color={'secondary'}>
						<ShuffleIcon className="size-5" />
					</Paragraph>
					<Paragraph
						weight="bold"
						color="primary">
						Shuffle mode
					</Paragraph>
					<Paragraph>
						Shuffle the questions every time they're presented.
					</Paragraph>
				</RadioCards.Item>
			</RadioCards.Root>
		</Box>
		<Separator />
		<Box css={{ maxWidth: 800 }}>
			<Box className="mb-4">
				<Text
					weight="medium"
					size="4">
					Difficulty
				</Text>
			</Box>

			<RadioCards.Root
				name="difficulty"
				value={formik.values.difficulty}
				onValueChange={(value) => formik.setFieldValue('difficulty', value)}
				defaultValue="easy"
				className="flex flex-col">
				<RadioCards.Item
					value="easy"
					className={cn('flex justify-start items-start gap-4', styles.radio)}>
					<Box className="flex flex-col items-start">
						<Paragraph
							weight="bold"
							color="primary">
							Easy
						</Paragraph>
						<Paragraph>
							Pretty straightforward, no domain experience required.
						</Paragraph>
					</Box>
				</RadioCards.Item>
				<RadioCards.Item
					value="hard"
					className={cn('flex justify-start items-start gap-4', styles.radio)}>
					<Box className="flex flex-col items-start">
						<Paragraph
							weight="bold"
							color="primary">
							Hard
						</Paragraph>
						<Paragraph>Domain experience might be required</Paragraph>
					</Box>
				</RadioCards.Item>
				<RadioCards.Item
					value="extreme"
					className={cn('flex justify-start items-start gap-4', styles.radio)}>
					<Box className="flex flex-col items-start">
						<Paragraph
							weight="bold"
							color="primary">
							Extreme
						</Paragraph>
						<Paragraph>
							Requires in-depth knowledge of the subject-matter.
						</Paragraph>
					</Box>
				</RadioCards.Item>
			</RadioCards.Root>
		</Box>
	</>
);
