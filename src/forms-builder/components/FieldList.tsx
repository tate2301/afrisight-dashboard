import { useFormContext } from '../context';
import { FormField } from '../types';
import { CalendarIcon, CheckCircleIcon, FilePlusIcon, FileTextIcon, ListPlusIcon, MailIcon, StarIcon, TextIcon } from 'lucide-react';
import { Paragraph } from '@/components/design-sytem/typography';
import Box from '@/components/design-sytem/box';
import Button from '@/components/design-sytem/button';
import styled from '@/components/design-sytem/theme';

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
    const { form, addField } = useFormContext();

    const handleAddField = (type: FormField['type']) => {
        const newField: FormField = {
            id: `field_${Date.now()}`,
            type,
            label: `New ${type} field`,
            required: false,
            properties: {},
        };
        addField(newField);
    };

    return (
        <div>
            <div className="mb-4">
                <Paragraph as={"h3"} weight={"bold"} className="text-md font-semibold mb-2 px-4">Add Field</Paragraph>
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
            <Box>
                <Paragraph as={"h3"} weight={"bold"} className="mb-4 px-4">Fields</Paragraph>
                <ul className="space-y-2 px-1">
                    {form.fields.map((field) => (
                        <FieldListItem {...field} />
                    ))}
                </ul>
            </Box>
        </div>
    );
}

const Li = styled("li", {
    height: 40,
    padding: "16px 12px",
    backgroundColor: "transparent",
    "&:hover": {
        backgroundColor: "$gray1"
    }
})

const FieldListItem = (field: FormField) => (
    <Li key={field.id} className="p-2 bg-gray-100 rounded flex items-center gap-2">
        {fieldTypes.find((type) => type.type === field.type)?.icon}
        {field.label}
    </Li>
)