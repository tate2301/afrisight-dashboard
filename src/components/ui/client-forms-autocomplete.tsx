import React from "react";
import AutocompleteSelect from "./autocomplete-select";
import { formatDate } from "date-fns";

interface ClientForm {
  _id: string;
  name: string;
  createdAt: string;
}

interface ClientFormsAutocompleteProps {
  name: string;
  placeholder?: string;
  fetchUrl: string;
}

const ClientFormsAutocomplete: React.FC<ClientFormsAutocompleteProps> = ({
  name,
  placeholder = "Select a client form",
  fetchUrl,
}) => {
  const renderOption = (form: ClientForm) => (
    <div className="flex flex-col">
      <span className="font-medium">{form.name}</span>
      <span className="text-sm text-gray-500">
        Created: {formatDate(form.createdAt, "dd MMM, yyyy")}
      </span>
    </div>
  );

  const getOptionLabel = (form: ClientForm) => form.name;

  return (
    <AutocompleteSelect<ClientForm>
      name={name}
      placeholder={placeholder}
      fetchUrl={fetchUrl}
      renderOption={renderOption}
      getOptionLabel={getOptionLabel}
    />
  );
};

export default ClientFormsAutocomplete;
