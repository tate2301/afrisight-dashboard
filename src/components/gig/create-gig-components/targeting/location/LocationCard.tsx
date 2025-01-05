import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/aria-components/Button';
import { MultiSelect } from '@/components/ui/multi-select';
import axiosClientInstance from '@/helpers/server/auth/axiosClientInstance';
import type { SelectedCity, City } from '../types';

interface LocationCardProps {
    country: string;
    cities: SelectedCity[];
    onRemove: () => void;
    onCitySelect: (cities: SelectedCity[]) => void;
}

export function LocationCard({
    country,
    cities,
    onRemove,
    onCitySelect,
}: LocationCardProps) {
    const [showCitySelector, setShowCitySelector] = useState(false);

    const citiesQuery = useQuery({
        queryKey: ['cities', country],
        queryFn: async () => {
            const response = await axiosClientInstance.get<City[]>(
                `/countries/${country}/cities`
            );
            return response.data;
        },
    });

    return (
        <div className="rounded-lg border border-zinc-200 overflow-hidden bg-white">
            <div className="p-4 bg-zinc-50 flex items-center justify-between">
                <div>
                    <p className="font-medium">{country}</p>
                    <p className="text-sm text-zinc-600">
                        {cities.length} cities selected
                    </p>
                </div>
                <div className="space-x-2 flex">
                    <Button
                        variant="secondary"
                        onPress={() => setShowCitySelector(!showCitySelector)}>
                        {showCitySelector ? 'Hide Cities' : 'Add Cities'}
                    </Button>
                    <Button
                        variant="secondary"
                        onPress={onRemove}>
                        Remove
                    </Button>
                </div>
            </div>

            {showCitySelector && (
                <div className="p-4 border-t border-zinc-200 space-y-4">
                    <MultiSelect
                        label={`Select cities in ${country}`}
                        value={cities.map((city) => city.id)}
                        onChange={(values: string[]) => {
                            const newCities = values
                                .map((value) => {
                                    const cityData = citiesQuery.data?.find(
                                        (c) => c._id === value
                                    );
                                    return cityData
                                        ? {
                                            id: cityData._id,
                                            name: cityData.name,
                                            country: country,
                                        }
                                        : null;
                                })
                                .filter((city): city is SelectedCity => city !== null);

                            onCitySelect(newCities);
                        }}
                        options={
                            citiesQuery.data?.map((city) => ({
                                value: city._id,
                                label: city.name,
                            })) || []
                        }
                    />

                    {cities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {cities.map((city) => (
                                <div
                                    key={city.id}
                                    className="bg-zinc-100 px-2 py-1 rounded-md flex items-center gap-2">
                                    <span>{city.name}</span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onCitySelect(cities.filter((c) => c.id !== city.id))
                                        }
                                        className="hover:text-red-500">
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 