import {Response} from '../types';

export interface ResponseTableActionsProps {
	selectedItems: Response[];
	gigId: string;
}

export type ResponseActionVariant =
	| 'primary'
	| 'secondary'
	| 'destructive'
	| 'ghost';

export type ResponseAction = {
	label: string;
	icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
	onClick: () => void;
	variant: ResponseActionVariant;
};

export type SeparatorAction = {
	type: 'separator';
};

export type ResponseActionItem = ResponseAction | SeparatorAction;
