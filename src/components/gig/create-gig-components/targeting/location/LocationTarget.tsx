// @ts-nocheck

import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import axiosClientInstance from '@/helpers/server/auth/axiosClientInstance';
import {LocationTargetType, SelectedCity, Country} from '../types';
import {LocationTargetingOptions} from './LocationTargetingOptions';
import {LocationSelector} from './LocationSelector';
import {LocationCard} from './LocationCard';
import {ErrorMessage} from '../../extras';
import {LocationData} from '../../FormikWrapper';
import {countriesWithCodes} from '@/lib/data/countries';

interface LocationTargetProps {
	value: LocationData;
	onChange: (
		type: LocationTargetType,
		countries: string[],
		cities: SelectedCity[],
	) => void;
	error?: string | undefined;
}

const getCountryName = (code: string) => {
	const country = countriesWithCodes.find((country) => country.code === code);
	return country?.name;
};

export function LocationTarget({value, onChange, error}: LocationTargetProps) {
	const [selectedCities, setSelectedCities] = useState<SelectedCity[]>(
		value.cities.map((city) => ({
			id: city._id,
			name: '',
			country: city.country,
		})),
	);

	const countriesQuery = useQuery({
		queryKey: ['countries'],
		queryFn: async () => {
			const response = await axiosClientInstance.get<Country[]>('/countries');
			return response.data;
		},
	});

	const countriesWithNames = countriesQuery.data
		?.map((country) => {
			const name = getCountryName(country.name) ?? '';
			if (!name) return null;
			return {
				name,
				_id: country._id,
				code: country.name,
			};
		})
		.filter((country) => !!country);

	if (countriesQuery.isLoading) {
		return (
			<div className="space-y-4 animate-pulse">
				<div className="h-[120px] bg-zinc-100 rounded-lg" />
				<div className="h-[120px] bg-zinc-100 rounded-lg" />
			</div>
		);
	}

	const handleCountrySelect = (newCountries: string[]) => {
		onChange(
			value.type,
			newCountries,
			selectedCities.filter((city) => newCountries.includes(city.country)),
		);
	};

	const handleCitySelect = (country: string, newCities: SelectedCity[]) => {
		const otherCities = selectedCities.filter(
			(city) => city.country !== country,
		);
		const updatedCities = [...otherCities, ...newCities];
		setSelectedCities(updatedCities);
		onChange(value.type, value.countries, updatedCities);
	};

	return (
		<div className="space-y-8">
			{!value.countries?.length && (
				<div className="grid grid-cols-2 gap-4">
					<LocationTargetingOptions
						title="Global Access"
						description="Make your gig available to all qualified participants worldwide, maximizing reach and diversity in responses."
						isSelected={value.type === 'all'}
						onClick={() => {
							onChange('all', [], []);
							setSelectedCities([]);
						}}
						icon="public"
					/>
					<LocationTargetingOptions
						title="Targeted Regions"
						description="Specify geographic boundaries by selecting countries or cities to ensure localized, relevant participation."
						isSelected={value.type !== 'all'}
						onClick={() => onChange('country', [], [])}
						icon="location_on"
					/>
				</div>
			)}

			{value.type !== 'all' && (
				<div className="space-y-6">
					<LocationSelector
						countries={countriesWithNames || []}
						selectedCountries={value.countries}
						onSelectCountry={handleCountrySelect}
					/>

					{value.countries?.map((country) => (
						<LocationCard
							key={country}
							country={country}
							cities={selectedCities.filter((city) => city.country === country)}
							onRemove={() => {
								handleCountrySelect(
									value.countries.filter((c) => c !== country),
								);
							}}
							onCitySelect={(newCities) => handleCitySelect(country, newCities)}
						/>
					))}
				</div>
			)}

			{error && typeof error === 'string' && (
				<ErrorMessage>{error}</ErrorMessage>
			)}
		</div>
	);
}
