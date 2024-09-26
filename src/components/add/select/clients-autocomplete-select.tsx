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

interface Client {
  _id: string;
  name: string;
  email: string;
  user: {
    email: string;
    _id: string;
  };
}

interface ClientsAutocompleteSelectProps {
  name: string;
  placeholder?: string;
  fetchUrl: string;
}

const ClientsAutocompleteSelect: React.FC<ClientsAutocompleteSelectProps> = ({
  name,
  placeholder = "Select a client",
  fetchUrl,
}) => {
  const [field, , helpers] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `${fetchUrl}?search=${debouncedSearchTerm}`,
        );
        const data = await response.profiles;
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
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
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div className="pb-1 pt-1 border-b border-zinc-400/30 mb-2">
          <Input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={handleSearch}
            className="mb-2 w-full"
          />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          clients.map((client) => (
            <SelectItem key={client.user._id} value={client.user._id}>
              <div className="flex flex-row items-center">
                <div className="size-8 rounded-full mr-4 bg-zinc-400/10" />
                <div className="flex gap-2">
                  <span className="font-medium">{client.user.email}</span>
                  <span className="text-sm text-gray-500 truncate text-ellipsis">
                    {client.user.email}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default ClientsAutocompleteSelect;
