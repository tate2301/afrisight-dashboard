import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function focusRing() {
	return {
		'&:focus': {
			boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.5)',
		},
	};
}

export function composeTailwindRenderProps(
	className: string | undefined,
	twClasses: string,
) {
	return cn(className, twClasses);
}
