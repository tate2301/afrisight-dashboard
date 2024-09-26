import { useFormContext } from '../context';
import { Label } from '@/components/ui/label';
import { Paragraph } from '@/components/design-sytem/typography';
import { TextArea, TextField } from '@radix-ui/themes';

export function FormSettings() {
    const { form, updateForm } = useFormContext();

    const handleChange = (key: keyof typeof form, value: string) => {
        updateForm({ [key]: value });
    };

    return (
        <div className="space-y-4">
            <Paragraph weight={"bold"} color={"primary"} className="text-lg font-semibold">Form Settings</Paragraph>
            <div>
                <Label htmlFor="formTitle">Title</Label>
                <TextField.Root
                    id="formTitle"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                />
            </div>
            <div>
                <Label htmlFor="formDescription">Description</Label>
                <TextArea
                    id="formDescription"
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                />
            </div>
            <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <TextField.Root
                    id="fontFamily"
                    value={form.theme.fontFamily}
                    onChange={(e) => updateForm({ theme: { ...form.theme, fontFamily: e.target.value } })}
                />
            </div>
        </div>
    );
}