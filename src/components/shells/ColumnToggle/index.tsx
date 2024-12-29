import { ChevronDown, Columns } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button, Popover, Switch, Text } from '@radix-ui/themes';
import { useState } from 'react';
import { Paragraph } from '@/components/design-sytem/typography';

interface ColumnToggleProps {
	label: string;
	enabled: boolean;
	onToggle: (enabled: boolean) => void;
}

function ColumnToggle({ label, enabled, onToggle }: ColumnToggleProps) {
	return (
		<div className="flex items-center justify-between py-2">
			<Paragraph
				as={'label'}
				color={'secondary'}
				htmlFor={`${label}-toggle`}
				className="text-[13px] ">
				{label}
			</Paragraph>
			<Switch
				id={`${label}-toggle`}
				checked={enabled}
				onCheckedChange={onToggle}
			/>
		</div>
	);
}

interface ColumnVisibilityToggleProps {
	columns: { label: string; enabled: boolean }[];
	onToggle: (label: string, enabled: boolean) => void;
}

export function ColumnVisibilityToggle({
	columns,
	onToggle,
}: ColumnVisibilityToggleProps) {
	const [open, setOpen] = useState(false);

	return (
		<Popover.Root
			open={open}
			onOpenChange={setOpen}>
			<Popover.Trigger>
				<Button
					variant="soft"
					color="gray"
					radius="full">
					<Columns className="size-4" />
					Columns
					<ChevronDown className="ml-2 h-4 w-4" />
				</Button>
			</Popover.Trigger>
			<Popover.Content className="w-72 flex flex-col">
				<Text
					size="2"
					className="mb-4 font-medium text-zinc-900">
					Toggle columns to show or hide
				</Text>
				{columns.map((column) => (
					<ColumnToggle
						key={column.label}
						label={column.label}
						enabled={column.enabled}
						onToggle={(enabled) => onToggle(column.label, enabled)}
					/>
				))}
			</Popover.Content>
		</Popover.Root>
	);
}
