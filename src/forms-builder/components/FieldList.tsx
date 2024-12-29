import { useFormContext } from '../context';
import { FormField } from '../types';
import {
	CalendarIcon,
	CheckCircleIcon,
	FilePlusIcon,
	FileTextIcon,
	ListPlusIcon,
	MailIcon,
	StarIcon,
	TextIcon,
	Trash2Icon,
} from 'lucide-react';
import { Paragraph } from '@/components/design-sytem/typography';
import Box from '@/components/design-sytem/box';
import styled from '@/components/design-sytem/theme';
import Separator from '@/components/design-sytem/separator';
import { Button, IconButton, Text } from '@radix-ui/themes';
import { cn } from '@/lib/utils';
import Symbol from '@/components/icons/symbol';

const fieldTypes = [
	{
		type: 'shortAnswer',
		label: 'Short Answer',
		icon: "text_fields",
	},
	{
		type: 'longAnswer',
		label: 'Long Answer',
		icon: "segment",
	},
	{ type: 'email', label: 'Email', icon: "mail" },
	{ type: 'date', label: 'Date', icon: "calendar_month" },
	{
		type: 'multipleChoice',
		label: 'Multiple Choice',
		icon: "checklist",
	},
	{
		type: 'yesNo',
		label: 'Yes/No',
		icon: "arrow_split",
	},
	{
		type: 'npsRating',
		label: 'NPS Rating',
		icon: "star_half",
	},
	{
		type: 'likertScale',
		label: 'Likert Scale',
		icon: "star",
	},
	{
		type: 'fileUpload',
		label: 'File Upload',
		icon: "cloud_upload",
	},
];

export function FieldList() {
	const { form, addField, selectedFieldId, setSelectedFieldId, removeField } =
		useFormContext();

	const handleAddField = (type: FormField['type']) => {
		const newField: FormField = {
			id: `field_${Date.now()}`,
			type,
			label: `${fieldTypes.find((fieldType) => fieldType.type === type)?.label}`,
			required: false,
			properties: {},
		};
		addField(newField);
		setSelectedFieldId(newField.id);
	};

	return (
		<div>
			<div className="mb-4">
				<Box className="mb-4 px-4">
					<p
						className="font-semibold uppercase text-content-tertiary">
						Field types
					</p>
					<p className='text-content-tertiary'>
						Click an item to add to the form
					</p>
				</Box>
				<Separator className='mb-2' />
				<div className="grid grid-cols-2 gap-2 px-4">
					{fieldTypes.map((fieldType) => (
						<button
							key={fieldType.type}
							onClick={() =>
								handleAddField(fieldType.type as FormField['type'])
							}
							style={{
								justifyContent: 'flex-start',
								gap: '8px',
							}}
							className="w-full justify-start font-medium text-content-secondary flex items-center gap-2 py-2 bg-surface-secondary px-2 rounded-lg hover:bg-surface-tertiary">
							<Symbol>
								{fieldType.icon}
							</Symbol>
							{fieldType.label}
						</button>
					))}
				</div>
			</div>
			<Separator className="my-4" />
			<Box>
				<Paragraph
					as={'h3'}
					weight={'bold'}
					className="mb-4 px-4">
					Questions
				</Paragraph>
				<ul className="space-y-2 px-1">
					{form.fields.map((field) => (
						<FieldListItem
							key={field.id}
							field={field}
							isSelected={field.id === selectedFieldId}
							onSelect={() => setSelectedFieldId(field.id)}
							onDelete={() => removeField(field.id)}
						/>
					))}
				</ul>
			</Box>
		</div>
	);
}

const Li = styled('li', {
	backgroundColor: 'transparent',
	cursor: 'pointer',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
});

const DeleteButton = styled(Button, {
	opacity: 0,
	transition: 'opacity 0.2s ease-in-out',
	'&:hover': {
		opacity: 1,
	},
});

const FieldListItem = ({
	field,
	isSelected,
	onSelect,
	onDelete,
}: {
	field: FormField;
	isSelected: boolean;
	onSelect: () => void;
	onDelete: () => void;
}) => (
	<Li
		onClick={onSelect}
		className="relative group">
		<button
			className={cn(
				'flex-1 flex items-center justify-start py-2 px-3 gap-4 text-zinc-600 rounded-xl h-[40px] bg-zinc-50',
				isSelected && 'bg-indigo-600 text-white',
			)}>
			<Symbol>{fieldTypes.find((type) => type.type === field.type)?.icon}</Symbol>
			<Text
				size="2"
				weight={'medium'}
				className="line-clamp-1 w-full flex-1 text-left">
				{field.label}
			</Text>
		</button>
		<DeleteButton
			variant="ghost"
			color="red"
			onClick={(e) => {
				e.stopPropagation();
				onDelete();
			}}
			className="absolute right-4 opacity-0 group-hover:opacity-100 bg-white pressable-shadow">
			<Trash2Icon className="size-4" />
		</DeleteButton>
	</Li>
);
