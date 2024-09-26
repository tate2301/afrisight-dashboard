import { useFormContext } from '../context';
import { FormField } from '../types';
import { CalendarIcon, CheckCircleIcon, FilePlusIcon, FileTextIcon, ListPlusIcon, MailIcon, StarIcon, TextIcon, Trash2Icon } from 'lucide-react';
import { Paragraph } from '@/components/design-sytem/typography';
import Box from '@/components/design-sytem/box';
import Button from '@/components/design-sytem/button';
import styled from '@/components/design-sytem/theme';
import Separator from '@/components/design-sytem/separator';

const fieldTypes = [
    { type: 'shortAnswer', label: 'Short Answer', icon: <TextIcon className="size-4" /> },
    { type: 'longAnswer', label: 'Long Answer', icon: <FileTextIcon className="size-4" /> },
    { type: 'email', label: 'Email', icon: <MailIcon className="size-4" /> },
    { type: 'date', label: 'Date', icon: <CalendarIcon className="size-4" /> },
    { type: 'multipleChoice', label: 'Multiple Choice', icon: <ListPlusIcon className="size-4" /> },
    { type: 'yesNo', label: 'Yes/No', icon: <CheckCircleIcon className="size-4" /> },
    { type: 'npsRating', label: 'NPS Rating', icon: <StarIcon className="size-4" /> },
    { type: 'fileUpload', label: 'File Upload', icon: <FilePlusIcon className="size-4" /> },
];

export function FieldList() {
    const { form, addField, selectedFieldId, setSelectedFieldId, removeField } = useFormContext();

    const handleAddField = (type: FormField['type']) => {
        const newField: FormField = {
            id: `field_${Date.now()}`,
            type,
            label: `${fieldTypes.find(fieldType => fieldType.type === type)?.label}`,
            required: false,
            properties: {},
        };
        addField(newField);
        setSelectedFieldId(newField.id);
    };

    return (
        <div>
            <div className="mb-4">
                <Paragraph as={"h3"} weight={"bold"} className="text-md font-semibold mb-2 px-4">Add question</Paragraph>
                <div className="grid grid-cols-2 gap-2 px-4">
                    {fieldTypes.map((fieldType) => (
                        <Button
                            key={fieldType.type}
                            onClick={() => handleAddField(fieldType.type as FormField['type'])}
                            variant="outline"
                            size="medium"
                            colorScheme={"surface"}
                            css={{
                                justifyContent: "flex-start",
                                gap: "8px"
                            }}
                            className="w-full justify-start flex items-center gap-2"
                        >
                            {fieldType.icon}
                            {fieldType.label}
                        </Button>
                    ))}
                </div>
            </div>
            <Separator className="my-4" />
            <Box>
                <Paragraph as={"h3"} weight={"bold"} className="mb-4 px-4">Questions</Paragraph>
                <ul className="space-y-2 px-1">
                    {form.fields.map((field) => (
                        <FieldListItem
                            key={field.id}
                            field={field}
                            isSelected={field.id === selectedFieldId}
                            onSelect={() => setSelectedFieldId(field.id)}
                            onDelete={() => removeField(field.id)}
                        />
                    ))}
                </ul>
            </Box>
        </div>
    );
}

const Li = styled("li", {
    height: 40,
    padding: "8px 12px",
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "&:hover": {
        backgroundColor: "$gray1"
    },
    variants: {
        selected: {
            true: {
                backgroundColor: "$gray2",
                "&:hover": {
                    backgroundColor: "$gray2"
                }
            }
        }
    }
});

const DeleteButton = styled(Button, {
    opacity: 0,
    transition: "opacity 0.2s ease-in-out",
    "&:hover": {
        opacity: 1,
    }
});

const FieldListItem = ({ field, isSelected, onSelect, onDelete }: { field: FormField; isSelected: boolean; onSelect: () => void; onDelete: () => void }) => (
    <Li
        selected={isSelected}
        onClick={onSelect}
        className="rounded flex items-center gap-2 group"
    >
        <Paragraph className="flex items-center gap-2">
            {fieldTypes.find((type) => type.type === field.type)?.icon}
            {field.label}
        </Paragraph>
        <DeleteButton
            variant="ghost"
            size="icon"
            onClick={(e) => {
                e.stopPropagation();
                onDelete();
            }}
            className="group-hover:opacity-100"
        >
            <Trash2Icon className="size-4" />
        </DeleteButton>
    </Li>
)