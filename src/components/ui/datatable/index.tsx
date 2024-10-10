import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {Checkbox} from '@/components/ui/checkbox';
import Box from '../../design-sytem/box';
import {cn} from '@/lib/utils';

export function DataTable<TData, TValue>({
	columns,
	data,
}: {
	columns: ColumnDef<TData>[];
	data: TData[];
}) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<Box className="overflow-x-auto max-w-full">
			<Table className="table-fixed overflow-x-auto border-collapse ">
				<TableHeader className="w-full sticky top-0 z-50 bg-zinc-100">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header, index) => {
								return (
									<TableHead
										className="border-r border-zinc-400/20"
										style={{
											width: index === 0 ? '28px' : header.getSize(),
											position: index < 2 ? 'sticky' : 'initial',
											left: index === 0 ? 0 : index === 1 ? '40px' : 'initial', // Adjust '100px' to the width of the first column
											zIndex: index < 2 ? 5 : 'initial',
											height: '28px',
										}}
										key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								className="border-b border-zinc-400/20"
								data-state={row.getIsSelected() && 'selected'}>
								{row.getVisibleCells().map((cell, index) => (
									<TableCell
										style={{
											width: index === 0 ? '40px' : cell.column.getSize(),
											position: index < 2 ? 'sticky' : 'initial',
											left: index === 0 ? 0 : index === 1 ? '40px' : 'initial', // Adjust '100px' to the width of the first column
											zIndex: index < 2 ? 1 : 'initial',
											height: '50px', // Set a fixed height for each column
										}}
										key={cell.id}
										className={cn(
											index === 0 && 'sticky left-0 z-10',
											'border-r border-zinc-400/20',
										)}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length}>No data</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</Box>
	);
}
