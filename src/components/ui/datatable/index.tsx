import { ColumnDef, useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { Table } from '@/components/ui/table';
import Box from '@/components/design-sytem/box';
import { cn } from '@/lib/utils';
import { ReactNode, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import Separator from '@/components/design-sytem/separator';
import TableActions from './TableActions';
import { TABLE_ACTIONS_HEIGHT } from '@/components/shells/TablePageHeader';
import datatableStyles from './index.module.css';
import TableHeader from './TableHeader';
import TableContent from './TableContent';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	top?: number;
	header?: ReactNode;
	onSelect?: (selectedItems: TData[]) => void;
	tableActions: ReactNode;
	selectedItems: string[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
	header,
	top,
	onSelect,
	tableActions,
	selectedItems,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const _selectedItems = useMemo(
		() => table.getSelectedRowModel().rows.map((row) => row.original),
		[table.getSelectedRowModel().rows],
	);

	useEffect(() => {
		onSelect?.(_selectedItems);
	}, [_selectedItems, onSelect]);

	return (
		<Box className="max-w-full w-full h-full flex-1 overflow-auto">
			<AnimatePresence>
				{selectedItems?.length > 0 && (
					<TableActions
						selectedItems={selectedItems}
						actions={tableActions}
					/>
				)}
			</AnimatePresence>
			<Box className="w-full sticky top-0 left-0 z-10 bg-white">{header}</Box>
			<Table
				style={{
					tableLayout: 'fixed',
				}}
				className={cn(
					'overflow-x-auto border-spacing-0 border-none w-full',
					datatableStyles.datatable,
				)}>
				<TableHeader top={top} table={table} />
				<TableContent
					table={table}
					columns={columns}
				/>
			</Table>
			<Separator />
		</Box>
	);
}
