import {cn} from '@/lib/utils';
import {ReactNode} from 'react';
import {motion} from 'framer-motion';

type NavTabListProps = {
	className?: string;
	children: ReactNode;
};

const NavTabList = ({className, children}: NavTabListProps) => {
	return (
		<nav
			className={cn(
				'w-full px-4 py-2 bg-white border-b border-zinc-400/30 flex',
				className,
			)}>
			{children}
		</nav>
	);
};

const NavTab = ({
	children,
	className,
	isActive,
	onClick,
}: {
	children: ReactNode;
	className?: string;
	isActive?: boolean;
	onClick?: () => void;
}) => {
	return (
		<div
			onClick={onClick}
			className={cn(
				'flex text-zinc-600 relative items-center justify-center py-2 rounded-lg px-4 text-sm font-medium cursor-pointer',
				isActive && 'text-zinc-900',
				className,
			)}>
			<p className="relative z-10">{children}</p>
			{isActive && (
				<motion.div
					layoutId="nav-tab"
					className="absolute top-0 w-full h-full rounded-lg bg-zinc-400/30 z-0"
				/>
			)}
		</div>
	);
};

export {NavTabList, NavTab};
