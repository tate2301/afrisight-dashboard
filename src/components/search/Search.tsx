import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Custom debounce function
  const debounce = (func: any, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
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
  return (
    <div className="flex flex-row items-center space-x-4 w-full bg-zinc-400/10 px-2 group rounded-xl h-[40px] max-w-96">
      <div className="flex flex-row items-center flex-1 main-border text-sm rounded-lg px-2 space-x-2">
        <MagnifyingGlassIcon height={20} width={20} className="text-zinc-400" />
        <input
          type="text"
          onChange={handleSearchChange}
          value={searchQuery}
          className="border-none outline-none flex-1 py-2 text-zinc-700 bg-transparent placeholder:font-semibold"
          placeholder="Search"
        />
      </div>
    </div>
  );
}

export default Search;
