import { Select, Text } from "@radix-ui/themes"
import { useState } from "react";

type FilterButtonProps = {
    options: string[];
    label: string;
    value?: string;
    onChange?: (value: string) => void;
}

const SelectWithOptions = ({ options, label, value, onChange }: FilterButtonProps) => {
    const [selectedValue, setSelectedValue] = useState(value ?? options[0]);

    const handleChange = (value: string) => {
        setSelectedValue(value);
        onChange?.(value);
    }

    return (
        <Select.Root defaultValue={options[0]} value={selectedValue} onValueChange={handleChange}>
            <Select.Trigger className="pressable-shadow" style={{ borderRadius: 12 }}>
                <Text>{label}</Text>: <Text weight={"medium"}>{selectedValue}</Text>

            </Select.Trigger>
            <Select.Content>
                <Select.Group>
                    <Select.Label>{label}</Select.Label>
                    {
                        options.map((option) => (
                            <Select.Item value={option}>{option}</Select.Item>
                        ))
                    }
                </Select.Group>

            </Select.Content>
        </Select.Root>
    )
}

export default SelectWithOptions;