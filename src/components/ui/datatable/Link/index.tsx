import Link, {LinkProps} from 'next/link';
import {ReactNode} from 'react';
import TableLinkStyles from './link.module.css';

const TableLink = ({children, ...rest}: {children: ReactNode} & LinkProps) => {
	return (
		<Link
			{...rest}
			className={TableLinkStyles.link}>
			{children}
		</Link>
	);
};

export default TableLink;
