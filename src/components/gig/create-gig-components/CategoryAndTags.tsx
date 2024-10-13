import {useState} from 'react';
import {Paragraph, Caption} from '@/components/design-sytem/typography';
import {
	Box,
	Flex,
	Select,
	Checkbox,
	Badge,
	Button,
	Skeleton,
} from '@radix-ui/themes';
import {ErrorMessage, TextInput} from './extras';
import {useQuery} from '@tanstack/react-query';
import axiosInstance from '@/hooks/useApiFetcher';
import {SURVEY_ROUTES} from '@/lib/api-routes';

type CategoryAndTagsProps = {
	formik: any;
};

const predefinedTags = [
	'Technology',
	'Fashion',
	'Food',
	'Travel',
	'Sports',
	'Music',
	'Art',
	'Health',
	'Education',
	'Finance',
];

const CategorySelectSkeleton = () => <Skeleton className="h-6 w-full" />;

export const CategoryAndTags = ({formik}: CategoryAndTagsProps) => {
	const [tagInput, setTagInput] = useState('');

	const categoriesQuery = useQuery({
		queryKey: ['categories'],
		queryFn: async () => {
			const res = await axiosInstance.get(SURVEY_ROUTES.CATEGORIES);
			return res.map((category: any) => ({
				data: {
					name: category.name,
					description: category.description,
					_id: category._id,
				},
				label: category.name,
				value: category._id,
			}));
		},
	});

	const handleAddTag = (tag: string) => {
		const newTags = [...formik.values.tags, tag];
		formik.setFieldValue('tags', newTags);
		setTagInput('');
	};

	const handleRemoveTag = (tagToRemove: string) => {
		const newTags = formik.values.tags.filter(
			(tag: string) => tag !== tagToRemove,
		);
		formik.setFieldValue('tags', newTags);
	};

	const handleToggleTag = (tag: string) => {
		if (formik.values.tags.includes(tag)) {
			handleRemoveTag(tag);
		} else {
			handleAddTag(tag);
		}
	};

	return (
		<Box className="space-y-6">
			<Paragraph weight="bold">Targeting and Requirements</Paragraph>

			<Box className="space-y-2">
				<Paragraph weight="semibold">Categories</Paragraph>
				<Select.Root
					name="category"
					defaultValue={categoriesQuery.data?.[0]?.value}
					value={formik.values.category}
					onValueChange={(value) => formik.setFieldValue('category', value)}>
					<Select.Trigger className="w-full" />
					<Select.Content>
						{categoriesQuery.data ? (
							categoriesQuery.data.map((category: any) => (
								<Select.Item
									key={category.value}
									value={category.value}
									className="flex">
									{category.data.name}
								</Select.Item>
							))
						) : (
							<CategorySelectSkeleton />
						)}
					</Select.Content>
				</Select.Root>
				{formik.touched.categories && formik.errors.categories && (
					<ErrorMessage>{formik.errors.categories}</ErrorMessage>
				)}
			</Box>

			<Box className="space-y-4">
				<Paragraph weight="semibold">Tags</Paragraph>
				<Flex
					wrap="wrap"
					gap="2">
					{formik.values.tags.map((tag: string) => (
						<Badge
							key={tag}
							color="orange"
							onClick={() => handleRemoveTag(tag)}
							className="cursor-pointer">
							{tag} ×
						</Badge>
					))}
					<TextInput
						value={tagInput}
						onChange={(e) => setTagInput(e.target.value)}
						onKeyPress={(e) => {
							if (e.key === 'Enter' && tagInput.trim()) {
								e.preventDefault();
								handleAddTag(tagInput.trim());
							}
						}}
						placeholder="Add a tag..."
						className="w-full"
					/>
				</Flex>
				<Caption color="secondary">Press Enter to add a tag</Caption>
				<Flex
					wrap="wrap"
					gap="2"
					className="mt-2">
					{predefinedTags.map((tag) => (
						<Button
							type="button"
							key={tag}
							size={'1'}
							color="orange"
							variant={formik.values.tags.includes(tag) ? 'solid' : 'surface'}
							onClick={() => handleToggleTag(tag)}>
							{tag}
						</Button>
					))}
				</Flex>
			</Box>
		</Box>
	);
};
