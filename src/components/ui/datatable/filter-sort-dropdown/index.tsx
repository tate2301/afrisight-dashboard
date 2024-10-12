import * as React from 'react';
import {ChevronDown, ChevronUp, EyeOff} from 'lucide-react';

import {Button, DropdownMenu} from '@radix-ui/themes';
import {UpDown} from '@/components/icons/up.down';

interface FilterSortDropdownProps {
	columnName: string;
	onSortAscending: () => void;
	onSortDescending: () => void;
	onHideColumn: () => void;
}

export default function FilterSortDropdown({
	columnName,
	onSortAscending,
	onSortDescending,
	onHideColumn,
}: FilterSortDropdownProps) {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button
					color="gray"
					variant="ghost"
					size="1"
					radius="large">
					<span className="sr-only">Open menu</span>
					<UpDown className="h-4 w-4" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item onClick={onSortAscending}>
					<ChevronUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
					Sort Ascending
				</DropdownMenu.Item>
				<DropdownMenu.Item onClick={onSortDescending}>
					<ChevronDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
					Sort Descending
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onClick={onHideColumn}>
					<EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
					Hide Column
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
