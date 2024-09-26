import React, { useState, useEffect } from "react";
import { useField, useFormikContext } from "formik";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import axiosInstance from "@/hooks/useApiFetcher";

interface AutocompleteOption {
  _id: string;
  [key: string]: any;
}

interface AutocompleteSelectProps<T extends AutocompleteOption> {
  name: string;
  placeholder?: string;
  fetchUrl: string;
  renderOption: (option: T) => React.ReactNode;
  getOptionLabel: (option: T) => string;
}

function AutocompleteSelect<T extends AutocompleteOption>({
  name,
  placeholder = "Select an option",
  fetchUrl,
  renderOption,
  getOptionLabel,
}: AutocompleteSelectProps<T>) {
  const [field, , helpers] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [options, setOptions] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `${fetchUrl}?search=${debouncedSearchTerm}`,
        );
        const data = await response;
        setOptions(data);
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [debouncedSearchTerm, fetchUrl]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelect = (value: string) => {
    setFieldValue(name, value);
  };

  return (
    <Select name={name} value={field.value} onValueChange={handleSelect}>
      <SelectTrigger className="w-full">
        <SelectValue className="h-fit" placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div className="pb-1 pt-1 border-b border-zinc-400/30 mb-2">
          <Input
            type="text"
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            value={searchTerm}
            onChange={handleSearch}
            className="mb-2 w-full"
          />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : options.length > 0 ? (
          options.map((option) => (
            <SelectItem key={option._id} value={option._id}>
              {renderOption(option)}
            </SelectItem>
          ))
        ) : (
          <div className="flex items-center justify-center pb-2">
            <p className="italic text-sm text-zinc-600">No items found</p>
          </div>
        )}
      </SelectContent>
    </Select>
  );
}

export default AutocompleteSelect;
