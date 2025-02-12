// @ts-nocheck

import * as React from 'react';

import {cn} from '@/lib/utils';
import {motion} from 'framer-motion';

const Table = React.forwardRef<
	HTMLTableElement,
	React.HTMLAttributes<HTMLTableElement>
>(({className, ...props}, ref) => (
	<div className="table-container">
		<table
			ref={ref}
			className={cn('w-full table-fixed caption-bottom text-[13px]', className)}
			{...props}
		/>
	</div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({className, ...props}, ref) => (
	<thead
		ref={ref}
		className={cn('sticky top-0 bg-white z-10', className)}
		{...props}
	/>
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({className, ...props}, ref) => (
	<tbody
		ref={ref}
		className={cn('[&_tr:last-child]:border-0', className)}
		{...props}
	/>
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({className, ...props}, ref) => (
	<tfoot
		ref={ref}
		className={cn(
			'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
			className,
		)}
		{...props}
	/>
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<
	HTMLTableRowElement,
	React.HTMLAttributes<HTMLTableRowElement>
>(({className, ...props}, ref) => (
	<tr
		ref={ref}
		className={cn(
			'transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-[40px]',
			className,
		)}
		{...props}
	/>
));

const AnimatedTableRow = motion(TableRow);
AnimatedTableRow.displayName = 'AnimatedTableRow';

const TableHead = React.forwardRef<
	HTMLTableCellElement,
	React.ThHTMLAttributes<HTMLTableCellElement>
>(({className, ...props}, ref) => (
	<th
		ref={ref}
		className={cn(
			'h-[32px] px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
			className,
		)}
		{...props}
	/>
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
	HTMLTableCellElement,
	React.TdHTMLAttributes<HTMLTableCellElement>
>(({className, style, ...props}, ref) => (
	<td
		ref={ref}
		className={cn(
			'px-4 py-1 align-middle [&:has([role=checkbox])]:pr-0 bg-surface',
			className,
		)}
		style={style}
		{...props}
	/>
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
	HTMLTableCaptionElement,
	React.HTMLAttributes<HTMLTableCaptionElement>
>(({className, ...props}, ref) => (
	<caption
		ref={ref}
		className={cn('mt-4 text-[13px] text-muted-foreground', className)}
		{...props}
	/>
));
TableCaption.displayName = 'TableCaption';

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
	AnimatedTableRow,
};
