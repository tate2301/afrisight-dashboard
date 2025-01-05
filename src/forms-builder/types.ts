export interface ColorPalette {
	primary: string;
	secondary: string;
	accent: string;
	background: string;
	surface: string;
	text: string;
}

export interface FormTheme {
	id: string;
	name: string;
	description: string;
	colors: ColorPalette;
	font: string;
}

export type InputType =
	| 'shortAnswer'
	| 'longAnswer'
	| 'email'
	| 'date'
	| 'multipleChoice'
	| 'yesNo'
	| 'npsRating'
	| 'fileUpload'
	| 'likertScale';

export type GigForm = {
	_id: string;
	gig: string | any;
};

export interface FormField {
	id: string;
	type: InputType;
	label: string;
	required: boolean;
	properties: {
		placeholder?: string;
		minLength?: number;
		maxLength?: number;
		choices?: string[];
		npsMaxRating?: number; // Default will be 10 for NPS
		allowedFileTypes?: string[];
		maxFileSize?: number;
		scalePoints?: number;
	};
}

export interface Form {
	id: string;
	title: string;
	description: string;
	theme: FormTheme;
	fields: FormField[];
}
