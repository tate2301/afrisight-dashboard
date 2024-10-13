import Link, {LinkProps} from 'next/link';
import {ReactNode} from 'react';
import TableLinkStyles from './link.module.css';
import {cn} from '@/lib/utils';
import {Text} from '@radix-ui/themes';

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
			<Text
				className="link-text"
				size="2">
				{children}
			</Text>
		</Link>
	);
};

export default TableLink;
