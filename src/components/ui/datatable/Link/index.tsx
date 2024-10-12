import Link, {LinkProps} from 'next/link';
import {ReactNode} from 'react';
import TableLinkStyles from './link.module.css';
import {cn} from '@/lib/utils';

const TableLink = ({
	children,
	className,
	style,
	...rest
}: {children: ReactNode; className?: string; style?: any} & LinkProps) => {
	return (
		<Link
			{...rest}
			style={style}
			className={cn(TableLinkStyles.link, className)}>
			{children}
		</Link>
	);
};

export default TableLink;
