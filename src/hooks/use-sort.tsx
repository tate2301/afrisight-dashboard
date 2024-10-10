import {SortState} from '@/utils/types';
import {useCallback, useState} from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {ArrowUpDown, ArrowUp, ArrowDown} from 'lucide-react';

export function useSort(initialSort?: SortState) {
	const [sort, setSort] = useState<SortState | undefined>(initialSort);

	const toggleSort = useCallback((column: string) => {
		setSort((current) => {
			if (!current || current.column !== column) {
				return {column, direction: 'asc'};
			}
			if (current.direction === 'asc') {
				return {column, direction: 'desc'};
			}
			return undefined;
		});
	}, []);

	const SortButton = useCallback(
		({column, children}: {column: string; children: React.ReactNode}) => {
			const isActive = sort?.column === column;

			return (
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild>
						<button className="inline-flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded">
							{children}
							{isActive ? (
								sort.direction === 'asc' ? (
									<ArrowUp className="h-4 w-4" />
								) : (
									<ArrowDown className="h-4 w-4" />
								)
							) : (
								<ArrowUpDown className="h-4 w-4 text-gray-400" />
							)}
						</button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Portal>
						<DropdownMenu.Content className="bg-white rounded-md shadow-lg p-1 z-50">
							<DropdownMenu.Item
								className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
								onClick={() => toggleSort(column)}>
								<ArrowUp className="h-4 w-4" />
								Sort ascending
							</DropdownMenu.Item>
							<DropdownMenu.Item
								className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
								onClick={() => toggleSort(column)}>
								<ArrowDown className="h-4 w-4" />
								Sort descending
							</DropdownMenu.Item>
							{isActive && (
								<DropdownMenu.Item
									className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
									onClick={() => setSort(undefined)}>
									Clear sort
								</DropdownMenu.Item>
							)}
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
			);
		},
		[sort, toggleSort],
	);

	const getSortQuery = useCallback(() => {
		if (!sort) return undefined;
		return `${sort.column}:${sort.direction}`;
	}, [sort]);

	return {sort, setSort, toggleSort, SortButton, getSortQuery};
}
