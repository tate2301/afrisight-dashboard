import { Location } from "@/utils/types";
import { LocationData } from "../FormikWrapper";

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

export interface SelectedCity {
    id: string;
    name: string;
    country: string;
} 