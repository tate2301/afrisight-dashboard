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
                                    style={{
                                        width: index === 0 ? '40px' : cell.column.getSize(),
                                        position: index < 2 ? 'sticky' : 'initial',
                                        left: index === 0 ? 0 : index === 1 ? '40px' : 'initial',
                                        zIndex: index < 2 ? 1 : 'initial',
                                        height: '32px',
                                    }}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className={cn(
                                        index === 0 && 'sticky left-0 z-10 px-0',
                                        'border-r border-zinc-400/20 overflow-hidden',
                                        index < 2 &&
                                        'bg-white data-[state=selected]:bg-muted group-hover:bg-muted/50',
                                    )}
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

