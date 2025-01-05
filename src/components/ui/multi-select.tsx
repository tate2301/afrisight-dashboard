import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, Search, ChevronDown, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface MultiSelectProps {
	label: string;
	value: string[];
	onChange: (value: string[]) => void;
	options: Array<{ value: string; label: string }>;
	children?: React.ReactNode;
}

function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number,
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout;

	return function executedFunction(...args: Parameters<T>) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

export const MultiSelect = ({
	label,
	value,
	onChange,
	options,
}: MultiSelectProps) => {
	const [search, setSearch] = React.useState('');
	const [isOpen, setIsOpen] = React.useState(false);
	const [activeIndex, setActiveIndex] = React.useState(0);
	const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0 });

	const triggerRef = React.useRef<HTMLDivElement>(null);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const containerRef = React.useRef<HTMLDivElement>(null);
	const dropdownRef = React.useRef<HTMLDivElement>(null);

	const updatePosition = React.useCallback(() => {
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			setPosition({
				top: rect.bottom + window.scrollY,
				left: rect.left + window.scrollX,
				width: rect.width,
			});
		}
	}, []);

	React.useEffect(() => {
		if (isOpen) {
			updatePosition();
			window.addEventListener('scroll', updatePosition, true);
			window.addEventListener('resize', updatePosition);

			return () => {
				window.removeEventListener('scroll', updatePosition, true);
				window.removeEventListener('resize', updatePosition);
			};
		}
	}, [isOpen, updatePosition]);

	const selectedItems = value
		.map((v) => options.find((opt) => opt.value === v))
		.filter(Boolean);

	const filteredOptions = options.filter(
		(option) =>
			option.label.toLowerCase().includes(search.toLowerCase()) &&
			!value.includes(option.value),
	);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (
			isOpen &&
			(e.key === 'Enter' || e.key === 'ArrowUp' || e.key === 'ArrowDown')
		) {
			e.preventDefault(); // Prevent form submission
		}

		switch (e.key) {
			case 'Backspace':
				if (search === '') {
					// Remove last item even if it's the only one
					const newValues = value.slice(0, -1);
					onChange(newValues);
				}
				break;
			case 'Enter':
				if (filteredOptions[activeIndex]) {
					onChange([...value, filteredOptions[activeIndex].value]);
					setSearch('');
					setActiveIndex(0);
				}
				break;
			case 'ArrowDown':
				e.preventDefault();
				setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
				break;
			case 'ArrowUp':
				e.preventDefault();
				setActiveIndex((i) => Math.max(i - 1, 0));
				break;
			case 'Escape':
				setIsOpen(false);
				break;
		}
	};

	const removeItem = (itemValue: string) => {
		// Remove only the last occurrence, even if there are duplicates
		const idx = value.lastIndexOf(itemValue);
		if (idx !== -1) {
			const newValues = [...value];
			newValues.splice(idx, 1);
			onChange(newValues);
		}
	};

	React.useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Node;
			const isClickInside =
				(triggerRef.current && triggerRef.current.contains(target)) ||
				(dropdownRef.current && dropdownRef.current.contains(target));

			if (!isClickInside) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	React.useEffect(() => {
		setActiveIndex(0);
	}, [filteredOptions.length]);

	// 4. Add scroll into view
	React.useEffect(() => {
		const activeElement = dropdownRef.current?.querySelector(
			`[data-index="${activeIndex}"]`,
		);
		activeElement?.scrollIntoView({ block: 'nearest' });
	}, [activeIndex]);

	// 5. Debounce position updates
	const debouncedUpdatePosition = React.useCallback(
		debounce(() => {
			updatePosition();
		}, 100),
		[updatePosition],
	);

	return (
		<div
			ref={containerRef}
			className="relative">
			<div
				ref={triggerRef}
				className={cn(
					'min-h-[38px] px-2 py-1.5 flex flex-wrap gap-1.5 items-center',
					'bg-white border border-zinc-200 rounded-md cursor-text',
					'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500',
					isOpen && 'ring-2 ring-offset-2 ring-teal-500',
				)}
				onClick={() => inputRef.current?.focus()}>
				{selectedItems.map(
					(item) =>
						item && (
							<span
								key={item.value}
								className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-100 rounded text-sm">
								{item.label}
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										removeItem(item.value);
									}}
									className="hover:text-red-500 p-0.5">
									<X className="w-3 h-3" />
								</button>
							</span>
						),
				)}
				<input
					ref={inputRef}
					className={cn(
						'flex-1 min-w-[80px] outline-none text-sm bg-transparent',
						'placeholder:text-zinc-400',
					)}
					placeholder={value.length === 0 ? label : ''}
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						setIsOpen(true);
					}}
					onFocus={() => setIsOpen(true)}
					onKeyDown={handleKeyDown}
				/>
			</div>

			{isOpen &&
				filteredOptions.length > 0 &&
				createPortal(
					<div
						ref={dropdownRef}
						className={cn(
							'fixed z-[999] bg-white rounded-md shadow-lg border border-zinc-200',
							'max-h-[300px] overflow-hidden',
						)}
						style={{
							position: 'fixed',
							top: `${position.top}px`,
							left: `${position.left}px`,
							width: `${position.width}px`,
						}}
						onClick={(e) => {
							e.stopPropagation();
						}}>
						<div className="sticky top-0 z-10 px-2 py-2 border-b border-zinc-200 bg-white">
							<div
								className="flex items-center gap-2 px-2 h-8 bg-zinc-50 rounded"
								onClick={(e) => e.stopPropagation()}>
								<Search className="w-4 h-4 text-zinc-400" />
								<input
									className={cn(
										'w-full bg-transparent text-sm',
										'border-none outline-none',
										'placeholder:text-zinc-400',
										'focus:ring-0',
									)}
									placeholder="Search..."
									value={search}
									onChange={(e) => {
										e.stopPropagation();
										setSearch(e.target.value);
									}}
									onClick={(e) => e.stopPropagation()}
								/>
							</div>
						</div>
						<div className="overflow-y-auto max-h-[232px]">
							{filteredOptions.map((option, index) => (
								<div
									key={option.value}
									className={cn(
										'flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer',
										'hover:bg-zinc-50',
										activeIndex === index && 'bg-zinc-50',
									)}
									onClick={(e) => {
										e.stopPropagation();
										onChange([...value, option.value]);
										setSearch('');
										setActiveIndex(0);
										inputRef.current?.focus();
									}}>
									<div className="flex items-center gap-2 flex-1">
										<div className="w-4 h-4 border rounded flex items-center justify-center shrink-0 border-zinc-300">
											{value.includes(option.value) && (
												<Check className="w-3 h-3 text-teal-500" />
											)}
										</div>
										<span className="truncate">{option.label}</span>
									</div>
								</div>
							))}
						</div>
					</div>,
					document.body,
				)}
		</div>
	);
};
