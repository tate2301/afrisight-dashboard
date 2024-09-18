import React from "react";
import AutocompleteSelect from "./autocomplete-select";

interface Client {
  _id: string;
  name: string;
  email: string;
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
  const renderOption = (client: Client) => (
    <div className="flex flex-col">
      <span className="font-medium">{client.name}</span>
      <span className="text-sm text-gray-500">{client.email}</span>
    </div>
  );

  const getOptionLabel = (client: Client) => client.name;

  return (
    <AutocompleteSelect<Client>
      name={name}
      placeholder={placeholder}
      fetchUrl={fetchUrl}
      renderOption={renderOption}
      getOptionLabel={getOptionLabel}
    />
  );
};

export default ClientsAutocompleteSelect;
