import {Paragraph, Caption} from '@/components/design-sytem/typography';
import {Box, Flex, Select, Checkbox} from '@radix-ui/themes';
import {ErrorMessage, TextInput} from './extras';
import {NumberField} from '@/components/ui/aria-components/NumberField';

type TargetingAndRequirementsProps = {
	formik: any;
};

export const TargetingAndRequirements = ({
	formik,
}: TargetingAndRequirementsProps) => {
	return (
		<Box className="space-y-6">
			<Paragraph weight="bold">Targeting and Requirements</Paragraph>
			<Box className="space-y-2">
				<Paragraph weight="semibold">Location</Paragraph>
				<Select.Root
					name="location"
					value={formik.values.location}
					onValueChange={(value) => formik.setFieldValue('location', value)}>
					<Select.Trigger className="w-full select-shadow" />
					<Select.Content>
						<Select.Item value="All">All locations</Select.Item>
						<Select.Item value="harare">Harare</Select.Item>
					</Select.Content>
				</Select.Root>
			</Box>
			<Box className="space-y-2">
				<Paragraph weight="semibold">Target Gender</Paragraph>
				<Select.Root
					name="targetGender"
					value={formik.values.targetGender}
					onValueChange={(value) =>
						formik.setFieldValue('targetGender', value)
					}>
					<Select.Trigger className="w-full select-shadow" />
					<Select.Content>
						<Select.Item value="All">All</Select.Item>
						<Select.Item value="Male">Male</Select.Item>
						<Select.Item value="Female">Female</Select.Item>
						<Select.Item value="Other">Other</Select.Item>
					</Select.Content>
				</Select.Root>
			</Box>

			<Box className="space-y-2">
				<Paragraph weight="semibold">Target Age Range</Paragraph>
				<Flex
					gap="3"
					className="w-full">
					<NumberField
						label="Min"
						value={formik.values.targetAgeRange?.min || ''}
						onChange={(value: number) =>
							formik.setFieldValue('targetAgeRange.min', value)
						}
						onBlur={formik.handleBlur}
						className="flex-1"
					/>
					<NumberField
						label="Max"
						value={formik.values.targetAgeRange?.max || ''}
						onChange={(value: number) =>
							formik.setFieldValue('targetAgeRange.max', value)
						}
						onBlur={formik.handleBlur}
						className="flex-1"
					/>
				</Flex>
				{formik.touched.targetAgeRange && formik.errors.targetAgeRange && (
					<ErrorMessage>{formik.errors.targetAgeRange}</ErrorMessage>
				)}
			</Box>

			<Box className="space-y-2">
				<Paragraph weight="semibold">Language Requirements</Paragraph>
				<Select.Root
					name="languageRequirements"
					value={formik.values.languageRequirements}
					onValueChange={(value) =>
						formik.setFieldValue('languageRequirements', value)
					}>
					<Select.Trigger className="w-full select-shadow" />
					<Select.Content>
						<Select.Item value="english">English</Select.Item>
						<Select.Item value="spanish">Spanish</Select.Item>
						<Select.Item value="french">French</Select.Item>
						<Select.Item value="german">German</Select.Item>
					</Select.Content>
				</Select.Root>
			</Box>

			<Box className="space-y-2">
				<Paragraph weight="semibold">Education Level</Paragraph>
				<Select.Root
					name="educationLevel"
					value={formik.values.educationLevel}
					onValueChange={(value) =>
						formik.setFieldValue('educationLevel', value)
					}>
					<Select.Trigger className="w-full select-shadow" />
					<Select.Content>
						<Select.Item value="highSchool">High School</Select.Item>
						<Select.Item value="bachelors">Bachelor's Degree</Select.Item>
						<Select.Item value="masters">Master's Degree</Select.Item>
						<Select.Item value="phd">PhD</Select.Item>
					</Select.Content>
				</Select.Root>
			</Box>

			<Box className="space-y-2">
				<Paragraph weight="semibold">Income Range</Paragraph>
				<Flex gap="3">
					<NumberField
						label="Min"
						value={formik.values.incomeRange?.min || ''}
						onChange={(value: number) =>
							formik.setFieldValue('incomeRange.min', value)
						}
						onBlur={formik.handleBlur}
						className="flex-1"
					/>
					<NumberField
						label="Max"
						value={formik.values.incomeRange?.max || ''}
						onChange={(value: number) =>
							formik.setFieldValue('incomeRange.min', value)
						}
						onBlur={formik.handleBlur}
						className="flex-1"
					/>
				</Flex>
			</Box>
		</Box>
	);
};
