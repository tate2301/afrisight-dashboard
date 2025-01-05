import { Caption } from '@/components/design-sytem/typography';
import { MultiSelect } from '@/components/ui/multi-select';
import type { Country } from '../types';

interface LocationSelectorProps {
    countries: Country[];
    selectedCountries: string[];
    onSelectCountry: (countries: string[]) => void;
}

export function LocationSelector({
    countries,
    selectedCountries,
    onSelectCountry,
}: LocationSelectorProps) {
    return (
        <div className="rounded-lg border border-zinc-200 p-4 space-y-4">
            <div className="flex items-center justify-between">
                <Caption>Add Country</Caption>
                {selectedCountries.length > 0 && (
                    <span className="text-xs text-zinc-500">
                        {selectedCountries.length} selected
                    </span>
                )}
            </div>
            <MultiSelect
                label="Select a country"
                value={selectedCountries}
                onChange={onSelectCountry}
                options={countries.map((country) => ({
                    value: country.name,
                    label: country.name,
                }))}
            />
        </div>
    );
} 