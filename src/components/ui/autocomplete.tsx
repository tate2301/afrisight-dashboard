import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface Option {
    value: string;
    label: string;
}

interface AutocompleteSelectProps {
    name: string;
    options: Option[];
    renderOption?: (option: Option) => React.ReactNode;
    placeholder?: string;
    defaultValue?: string;
    onChange: (value: string) => void

}

const AutocompleteSelect: React.FC<AutocompleteSelectProps> = ({
    name,
    options,
    renderOption,
    placeholder,
    defaultValue,
    onChange
}) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        const filtered = options.filter(option =>
            option.label.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredOptions(filtered);
    };

    return (
        <Select name={name} defaultValue={defaultValue} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <div className="pb-1 pt-1 border-b border-zinc-400/30 mb-2">
                    <input
                        autoComplete='off'
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="mb-2 w-full px-2 outline-none ring-0 text-sm"

                    />
                </div>
                {filteredOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {renderOption ? renderOption(option) : option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default AutocompleteSelect;