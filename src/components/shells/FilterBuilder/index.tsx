import {ChevronDown, CloudDownload, Columns, FilterIcon} from 'lucide-react';
import {Label} from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {Input} from '@/components/ui/input';
import {TrashIcon, ViewColumnsIcon, XMarkIcon} from '@heroicons/react/24/solid';
import {Badge, Box, Button, Popover} from '@radix-ui/themes';
import {useState} from 'react';
import {FilterColumnConfig} from '..';
import {Paragraph} from '@/components/design-sytem/typography';

interface FilterProps {
	clause: 'WHERE' | 'AND' | 'OR';
	field: string;
	operator: string;
	value: string;
	onDelete: () => void;
	columns: FilterColumnConfig[];
	onUpdate: (field: string, value: any) => void;
}

const operators = {
	string: ['CONTAINS', '==', 'STARTS WITH', 'ENDS WITH'],
	number: ['==', '>', '<', 'BETWEEN'],
	boolean: ['Is'],
	date: ['Is', 'Is before', 'Is after', 'Is between'],
};

function Filter({
	clause,
	field,
	operator,
	value,
	onDelete,
	columns,
	onUpdate,
}: FilterProps) {
	const selectedColumn = columns.find((col) => col.label === field);

	return (
		<div className="flex items-center space-x-2 mb-2">
			<Select
				value={clause}
				onValueChange={(value) => onUpdate('clause', value)}>
				<SelectTrigger className="w-[150px]">
					<SelectValue placeholder="Select clause" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="WHERE">WHERE</SelectItem>
					<SelectItem value="AND">AND</SelectItem>
					<SelectItem value="OR">OR</SelectItem>
				</SelectContent>
			</Select>
			<Select
				value={field}
				onValueChange={(value) => onUpdate('field', value)}>
				<SelectTrigger className="w-[200px]">
					<SelectValue placeholder="Select field" />
				</SelectTrigger>
				<SelectContent>
					{columns.map((col) => (
						<SelectItem
							key={col.label}
							value={col.label}>
							{col.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				value={operator}
				onValueChange={(value) => onUpdate('operator', value)}>
				<SelectTrigger className="w-[160px]">
					<SelectValue placeholder="Select operator" />
				</SelectTrigger>
				<SelectContent>
					{selectedColumn &&
						operators[selectedColumn.type].map((op) => (
							<SelectItem
								key={op}
								value={op}>
								{op}
							</SelectItem>
						))}
				</SelectContent>
			</Select>
			{selectedColumn?.type === 'boolean' ? (
				<Select
					value={value}
					onValueChange={(value) => onUpdate('value', value)}>
					<SelectTrigger className="w-24">
						<SelectValue placeholder="Select value" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="true">True</SelectItem>
						<SelectItem value="false">False</SelectItem>
					</SelectContent>
				</Select>
			) : (
				<Input
					type={selectedColumn?.type === 'number' ? 'number' : 'text'}
					value={value}
					onChange={(e) => onUpdate('value', e.target.value)}
					className="w-[320px]"
				/>
			)}
			<Button
				variant="ghost"
				color="red"
				radius="full"
				size="1"
				onClick={onDelete}>
				<TrashIcon className="size-4" />
			</Button>
		</div>
	);
}

interface FilterBuilderProps {
	columns: FilterColumnConfig[];
}

export function FilterBuilder({columns}: FilterBuilderProps) {
	const [filters, setFilters] = useState<
		Omit<FilterProps, 'columns' | 'onUpdate' | 'onDelete'>[]
	>([]);
	const [open, setOpen] = useState(false);

	const addFilter = () => {
		setFilters([
			...filters,
			{
				clause: 'AND',
				field: columns[0].label,
				operator: operators[columns[0].type][0],
				value: '',
			},
		]);
	};

	const deleteFilter = (index: number) => {
		setFilters(filters.filter((_, i) => i !== index));
	};

	const updateFilter = (index: number, field: string, value: any) => {
		const newFilters = [...filters];
		newFilters[index] = {...newFilters[index], [field]: value};
		setFilters(newFilters);
	};

	return (
		<Popover.Root
			open={open}
			onOpenChange={setOpen}>
			<Popover.Trigger>
				<Button
					variant="soft"
					color="gray"
					radius="full">
					<FilterIcon className="size-4" />
					Filters
					{filters.length > 0 && <Badge>{filters.length}</Badge>}
					<ChevronDown className="ml-2 h-4 w-4" />
				</Button>
			</Popover.Trigger>
			<Popover.Content className="max-w-[800px]">
				{filters.map((filter, index) => (
					<Filter
						key={index}
						{...filter}
						columns={columns}
						onDelete={() => deleteFilter(index)}
						onUpdate={(field, value) => updateFilter(index, field, value)}
					/>
				))}
				{!filters.length && (
					<Box className="w-96">
						<Paragraph>No filters applied</Paragraph>
					</Box>
				)}
				<div className="flex justify-between items-center mt-4">
					<Button
						color="indigo"
						radius="full"
						onClick={addFilter}>
						+ Add filter
					</Button>
				</div>
			</Popover.Content>
		</Popover.Root>
	);
}
