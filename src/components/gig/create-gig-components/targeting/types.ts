export interface City {
    _id: string;
    name: string;
    country: {
        _id: string;
        name: string;
    };
    admin1: string;
    lat: string;
    lon: string;
    pop: string;
}

export interface Country {
    _id: string;
    name: string;
}

export type LocationTargetType = 'all' | 'country' | 'city';

// For UI components
export interface SelectedCity {
    id: string;
    name: string;
    country: string;
}

export interface GigFormValues {
    targetGender: string;
    targetAgeRange: {
        min: number;
        max: number;
    };
    location: Location;
    languageRequirements: string[];
    educationLevel: string;
} 