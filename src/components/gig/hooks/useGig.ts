import {SurveyGig} from '@/pages/gigs';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import axiosInstance from '@/hooks/useApiFetcher';
import {SURVEY_ROUTES} from '@/lib/api-routes';
import {AxiosRequestHeaders} from 'axios';
import {Gig} from '@/utils/types';
import {TBaseGig} from '../create-gig-components/FormikWrapper';

export type PartialGig = Partial<TBaseGig>;
// Create a typed FormData object
export type CustomFormData<T> = Omit<FormData, 'get' | 'entries'> & {
	get(key: Extract<keyof T, string>): FormDataEntryValue | null;
	entries(): IterableIterator<[Extract<keyof T, string>, FormDataEntryValue]>;
};

export function createCustomFormData<T extends Record<string, any>>(
	data: Partial<T>,
): CustomFormData<Partial<T>> {
	const formData = new FormData();

	Object.entries(data).forEach(([key, value]) => {
		if (value !== undefined) {
			if (value instanceof File) {
				formData.append(key, value);
			} else if (Array.isArray(value)) {
				value.forEach((item) => formData.append(key, item?.toString() ?? ''));
			} else if (typeof value === 'object' && value !== null) {
				formData.append(key, JSON.stringify(value));
			} else {
				if (value !== null) {
					formData.append(key, String(value));
				}
			}
		}
	});

	return formData as CustomFormData<Partial<T>>;
}

export const createTypedObjectFromFormData = <T extends Record<string, any>>(
	formData: CustomFormData<T>,
): Partial<T> => {
	const data: Partial<T> = {};
	const entries = formData.entries();
	let result = entries.next();

	while (!result.done) {
		const [key, value] = result.value;
		try {
			// Attempt to parse JSON strings
			data[key as keyof T] = JSON.parse(value as string) as T[keyof T];
		} catch {
			// If parsing fails, use the value as-is
			data[key as keyof T] = value as T[keyof T];
		}
		result = entries.next();
	}

	return data;
};

const useGig = (id: string, initialData: PartialGig = {}) => {
	const [storedGig, setStoredGig] = useState<PartialGig>(initialData);

	const gigMutation = useMutation({
		mutationKey: [id],
		mutationFn: async (
			payload: CustomFormData<PartialGig>,
		): Promise<PartialGig> => {
			const data = await axiosInstance.put(
				SURVEY_ROUTES.SAVE_SURVEY(id),
				payload,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					} as AxiosRequestHeaders,
				},
			);
			return data;
		},
	});

	const gigQuery = useQuery<PartialGig>({
		queryKey: [id],
		queryFn: async () => {
			const data = await axiosInstance.get(SURVEY_ROUTES.GET_SURVEY_BY_ID(id));
			return data;
		},
	});

	const mutate = async (
		data: CustomFormData<PartialGig>,
	): Promise<PartialGig> => {
		const response = await gigMutation.mutateAsync(data);
		setStoredGig(response);
		return response;
	};

	useEffect(() => {
		if (gigQuery.data) {
			setStoredGig(gigQuery.data);
		}
	}, [gigQuery.data]);

	return {
		data: gigQuery.data,
		query: {
			...gigQuery,
			data: undefined,
		},
		mutation: {
			...gigMutation,
			mutate,
		},
	};
};

export {useGig};
