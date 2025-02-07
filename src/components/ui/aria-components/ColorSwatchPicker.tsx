import React from 'react';
import {
	ColorSwatchPicker as AriaColorSwatchPicker,
	ColorSwatchPickerItem as AriaColorSwatchPickerItem,
	ColorSwatchPickerItemProps,
	ColorSwatchPickerProps,
} from 'react-aria-components';
import {ColorSwatch} from './ColorSwatch';
import {composeTailwindRenderProps, focusRing} from '@/lib/utils';
import {tv} from 'tailwind-variants';

export function ColorSwatchPicker({
	children,
	...props
}: Omit<ColorSwatchPickerProps, 'layout'>) {
	return (
		<AriaColorSwatchPicker
			{...props}
			className={composeTailwindRenderProps(
				props.className as string,
				'flex gap-1',
			)}>
			{children}
		</AriaColorSwatchPicker>
	);
}

const itemStyles = tv({
	extend: focusRing,
	base: 'relative rounded',
});

export function ColorSwatchPickerItem(props: ColorSwatchPickerItemProps) {
	return (
		<AriaColorSwatchPickerItem
			{...props}
			className={itemStyles}>
			{({isSelected}) => (
				<>
					<ColorSwatch />
					{isSelected && (
						<div className="absolute top-0 left-0 w-full h-full border border-2 border-black dark:border-white outline outline-2 outline-white dark:outline-black -outline-offset-4 rounded forced-color-adjust-none" />
					)}
				</>
			)}
		</AriaColorSwatchPickerItem>
	);
}
