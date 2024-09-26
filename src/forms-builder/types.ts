export type GigForm = {
    _id: string;
    gig: string | any;
}

export type InputType = 'shortAnswer' | 'longAnswer' | 'email' | 'date' | 'multipleChoice' | 'yesNo' | 'npsRating' | 'fileUpload';

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
    };
}

export interface Form {
    id: string;
    title: string;
    description: string;
    theme: {
        primaryColor: string;
        backgroundColor: string;
        fontFamily: string;
    };
    fields: FormField[];
}