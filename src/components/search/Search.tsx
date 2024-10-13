import {MagnifyingGlassIcon} from '@heroicons/react/24/outline';
import React, {useState, useEffect} from 'react';
import Box from '../design-sytem/box';
import {Search as SearchIcon} from '@/components/icons/search';
import {TextField} from '@radix-ui/themes';
import {SearchField} from '../ui/aria-components/SearchField';

type SearchProps = {
	value: string;
	onChange: (query: string) => void;
};

function SearchBox({value, onChange}: SearchProps) {
	const [searchQuery, setSearchQuery] = useState(value ?? '');
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

	// Custom debounce function
	const debounce = (func: any, delay: number) => {
		let timer: NodeJS.Timeout;
		return (...args: any[]) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				// @ts-ignore
				func.apply(this, args);
			}, delay);
		};
	};

	// Debounce setSearchQuery function
	const debouncedSetSearchQuery = debounce((query: string) => {
		setDebouncedSearchQuery(query);
	}, 300);

	// Handle search input change
	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
		debouncedSetSearchQuery(value);
	};

	useEffect(() => {
		onChange?.(debouncedSearchQuery);
	}, [debouncedSearchQuery]);

	return (
		<SearchField
			value={searchQuery}
			onChange={handleSearchChange}
		/>
	);
}

export default SearchBox;
