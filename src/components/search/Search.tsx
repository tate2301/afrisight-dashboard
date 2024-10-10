import {MagnifyingGlassIcon} from '@heroicons/react/24/outline';
import React, {useState, useEffect} from 'react';
import Box from '../design-sytem/box';
import {Search as SearchIcon} from '@/components/icons/search';

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
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value;
		setSearchQuery(query);
		debouncedSetSearchQuery(query);
	};

	useEffect(() => {
		onChange?.(debouncedSearchQuery);
	}, [debouncedSearchQuery]);

	return (
		<Box className="flex flex-row items-center border border-zinc-400/20 group group-focus-within:border-zinc-400/30 text-sm rounded-lg space-x-2 h-[32px] w-96 relative">
			<SearchIcon
				className="text-zinc-400 absolute left-2 size-5"
				style={{
					top: '50%',
					transform: 'translateY(-50%)',
				}}
			/>
			<input
				type="text"
				onChange={handleSearchChange}
				value={searchQuery}
				className="border-none outline-none flex-1 py-2 pl-8 text-zinc-700 bg-transparent placeholder:font-medium"
				placeholder="Search"
			/>
		</Box>
	);
}

export default SearchBox;
