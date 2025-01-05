import React from 'react';
import {Separator as RACSeparator, SeparatorProps} from 'react-aria-components';
import {tv} from 'tailwind-variants';

const styles = tv({
	base: 'bg-gray-400/30 dark:bg-zinc-600',
	variants: {
		orientation: {
			horizontal: 'h-px w-full',
			vertical: 'w-px',
		},
	},
	defaultVariants: {
		orientation: 'horizontal',
	},
});

export function Separator(props: SeparatorProps) {
	return (
		<RACSeparator
			{...props}
			className={styles({
				orientation: props.orientation,
				className: props.className,
			})}
		/>
	);
}
