import { Table, ColumnDef } from '@tanstack/react-table';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Flex } from '@radix-ui/themes';
import { flexRender } from '@tanstack/react-table';
import { AnimatePresence } from 'framer-motion';
import { AnimatedTableRow } from '@/components/ui/table';

interface TableContentProps<TData, TValue> {
    table: Table<TData>;
    columns: ColumnDef<TData, TValue>[];
}

export default function TableContent<TData, TValue>({
    table,
    columns,
}: TableContentProps<TData, TValue>) {
    return (
        <TableBody>
            {table.getRowModel().rows?.length ? (
                <AnimatePresence initial={false}>
                    {table.getRowModel().rows.map((row) => (
                        <AnimatedTableRow
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            key={row.id}
                            className="group"
                            data-state={row.getIsSelected() && 'selected'}
                        >
                            {row.getVisibleCells().map((cell, index) => (
                                <TableCell
                                    key={cell.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className={cn(
                                        'sticky',
                                        index === 0 && 'px-0',
                                        index < 2 && 'bg-zinc-50 -hover:bg-muted/50',
                                    )}
                                    style={{
                                        left: index === 0 ? 0 : index === 1 ? '40px' : 'initial',
                                        zIndex: index < 2 ? 5 : 'initial',
                                        height: '28px',
                                    }}
                                >
                                    <Flex
                                        className={cn(
                                            'w-full justify-between relative',
                                            index === 0 && 'justify-center',
                                        )}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </Flex>
                                </TableCell>
                            ))}
                        </AnimatedTableRow>
                    ))}
                </AnimatePresence>
            ) : (
                <TableRow>
                    <TableCell colSpan={columns.length}>No data</TableCell>
                </TableRow>
            )}
        </TableBody>
    );
}

