import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { UpDown } from '../icons/up.down';
import {
	Command,
	CommandList,
	CommandInput,
	CommandEmpty,
	CommandGroup,
	CommandItem,
} from './command';
import { cn } from '@/lib/utils';
import { CheckFill } from '../icons/check.fill';
import { Button } from './aria-components/Button';

export interface ComboboxItem<T> {
	value: string;
	label: string;
	data: T;
}

interface ComboboxProps<T> {
	items: ComboboxItem<T>[];
	value: string;
	placeholder: string;
	emptyMessage: string;
	onChange: (value: string) => void;
	renderItem?: (
		item: ComboboxItem<T>,
		isSelected: boolean,
		handleSelect: (value: string) => void,
	) => React.ReactNode;
	footerAction: React.ReactNode;
}

export function Combobox<T>({
	items,
	placeholder,
	emptyMessage,
	onChange,
	footerAction,
	renderItem,
	value: initialValue,
}: ComboboxProps<T>) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(initialValue);

	const handleSelect = (currentValue: string) => {
		setValue(currentValue === value ? '' : currentValue);
		onChange(currentValue === value ? '' : currentValue);
		setOpen(false);
	};

	useEffect(() => {
		if (initialValue) {
			setValue(initialValue);
		}
	}, [initialValue]);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					role="combobox"
					aria-expanded={open}

					className="w-auto min-w-[320px] pressable-shadow rounded-lg h-[32px] flex !justify-between items-center text-left hover:pressable-shadow px-4 pr-2">
					<p>
						{value
							? items.find((item) => item.value === value)?.label
							: placeholder}
					</p>
					<UpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-96 p-0">
				<Command>
					<CommandInput
						placeholder={`Search ${placeholder.toLowerCase()}...`}
					/>
					<CommandList>
						<CommandEmpty>{emptyMessage}</CommandEmpty>
						<CommandGroup className='p-0'>
							{items.map((item) =>
								renderItem ? (
									renderItem(item, value === item.value, handleSelect)
								) : (
									<CommandItem
										key={item.value}
										value={item.value}
										onSelect={handleSelect}>
										<CheckFill
											className={cn(
												'mr-2 h-4 w-4',
												value === item.value ? 'opacity-100' : 'opacity-0',
											)}
										/>
										{item.label}
									</CommandItem>
								),
							)}
						</CommandGroup>
						<CommandGroup>{footerAction}</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
