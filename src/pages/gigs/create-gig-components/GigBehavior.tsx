import Box from '@/components/design-sytem/box';
import { Paragraph, H3 } from '@/components/design-sytem/typography';
import { RadioCards } from '@radix-ui/themes';

type GigBehaviorProps = {
    formik: any;
};

export const GigBehavior = ({ formik }: GigBehaviorProps) => (
    <>
        <H3 className="mb-2">Gig behaviour and options</H3>
        <Box css={{ maxWidth: 800 }}>
            <Paragraph weight="medium" color="primary">
                Question ordering
            </Paragraph>
            <Paragraph className="mb-4">
                Configure how questions are presented to participants of this gig.
            </Paragraph>
            <RadioCards.Root
                name="questionOrdering"
                value={formik.values.questionOrdering}
                onValueChange={(value) => formik.setFieldValue('questionOrdering', value)}
                defaultValue="preserve"
            >
                <RadioCards.Item value="preserve">
                    <Paragraph weight="bold" color="primary">
                        Preserve order
                    </Paragraph>
                    <Paragraph>
                        Questions will be presented in the order they were added.
                    </Paragraph>
                </RadioCards.Item>
                <RadioCards.Item value="shuffle">
                    <Paragraph weight="bold" color="primary">
                        Shuffle mode
                    </Paragraph>
                    <Paragraph>
                        Shuffle the questions every time they're presented.
                    </Paragraph>
                </RadioCards.Item>
            </RadioCards.Root>
        </Box>
        <Box css={{ maxWidth: 800 }}>
            <Paragraph weight="bold" color="primary">
                Difficulty
            </Paragraph>
            <Paragraph className="mb-4">
                How difficult is it to complete this gig for an average person
            </Paragraph>
            <RadioCards.Root
                name="difficulty"
                value={formik.values.difficulty}
                onValueChange={(value) => formik.setFieldValue('difficulty', value)}
                defaultValue="easy"
            >
                <RadioCards.Item value="easy">
                    <Paragraph weight="bold" color="primary">
                        Easy
                    </Paragraph>
                    <Paragraph>
                        Pretty straightforward, no domain experience required.
                    </Paragraph>
                </RadioCards.Item>
                <RadioCards.Item value="hard">
                    <Paragraph weight="bold" color="primary">
                        Hard
                    </Paragraph>
                    <Paragraph>
                        Domain experience might be required, but at the general level
                    </Paragraph>
                </RadioCards.Item>
                <RadioCards.Item value="extreme">
                    <Paragraph weight="bold" color="primary">
                        Extreme
                    </Paragraph>
                    <Paragraph>
                        Requires in-depth knowledge of the subject-matter.
                    </Paragraph>
                </RadioCards.Item>
            </RadioCards.Root>
        </Box>
    </>
);
