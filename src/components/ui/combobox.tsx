import {useEffect, useState} from 'react';
import {Popover, PopoverContent, PopoverTrigger} from './popover';
import Button from '../design-sytem/button';
import {UpDown} from '../icons/up.down';
import {
	Command,
	CommandList,
	CommandInput,
	CommandEmpty,
	CommandGroup,
	CommandItem,
} from './command';
import {cn} from '@/lib/utils';
import {CheckFill} from '../icons/check.fill';

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
				<Button
					variant="outline"
					colorScheme={'surface'}
					role="combobox"
					aria-expanded={open}
					css={{
						justifyContent: 'space-between',
						'&:hover': {
							boxShadow: 'var(--pressable-shadow)',
						},
					}}
					className="w-full justify-between text-left hover:pressable-shadow">
					<span>
						{value
							? items.find((item) => item.value === value)?.label
							: placeholder}
					</span>
					<UpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-96 p-0">
				<Command>
					<CommandInput
						placeholder={`Search ${placeholder.toLowerCase()}...`}
					/>
					<CommandList className="p-1">
						<CommandEmpty>{emptyMessage}</CommandEmpty>
						<CommandGroup>
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
