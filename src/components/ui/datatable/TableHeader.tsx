import { Table } from '@tanstack/react-table';
import {
	TableHeader as UITableHeader,
	TableRow,
	TableHead,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Flex } from '@radix-ui/themes';
import FilterSortDropdown from './filter-sort-dropdown';
import { flexRender } from '@tanstack/react-table';
import { TABLE_ACTIONS_HEIGHT } from '@/components/shells/TablePageHeader';

interface TableHeaderProps<TData> {
	table: Table<TData>;
	top?: number;
}

export default function TableHeader<TData>({
	table,
	top,
}: TableHeaderProps<TData>) {
	return (
		<UITableHeader
			className="w-full sticky overflow-x-hidden z-10 bg-zinc-50 group"
			style={{ top: top ?? TABLE_ACTIONS_HEIGHT }}>
			{table.getHeaderGroups().map((headerGroup) => (
				<TableRow className='overflow-x-auto' key={headerGroup.id}>
					{headerGroup.headers.map((header, index) => (
						<TableHead
							key={header.id}
							className={cn(
								'sticky',
								index === 0 && 'px-0',
								index < 2 && 'bg-zinc-50 -hover:bg-muted/50',
							)}
							style={{
								width: index === 0 ? '40px' : header.getSize(),
								left: index === 0 ? 0 : index === 1 ? '40px' : 'initial',
								zIndex: index < 2 ? 5 : 'initial',
								height: '28px',
							}}>
							<Flex
								style={{ display: 'flex' }}
								className={cn(
									'w-full justify-between items-center line-clamp-1 text-wrap space-x-4',
									index === 0 && 'justify-center',
								)}>
								{header.isPlaceholder
									? null
									: flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
								{header.column.columnDef.id !== 'actions' && index !== 0 && (
									<FilterSortDropdown
										columnName={header.column.columnDef.id!}
										onSortAscending={() => header.column.toggleSorting(false)}
										onSortDescending={() => header.column.toggleSorting(true)}
										onHideColumn={() => header.column.toggleVisibility(false)}
									/>
								)}
							</Flex>
						</TableHead>
					))}
				</TableRow>
			))}
		</UITableHeader>
	);
}
