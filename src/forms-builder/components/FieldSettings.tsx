import React from 'react';
import { useFormContext } from '../context';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function FormSettings() {
    const { form, updateForm } = useFormContext();

    const handleChange = (key: keyof typeof form, value: string) => {
        updateForm({ [key]: value });
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Form Settings</h2>
            <div>
                <Label htmlFor="formTitle">Title</Label>
                <Input
                    id="formTitle"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                />
            </div>
            <div>
                <Label htmlFor="formDescription">Description</Label>
                <Textarea
                    id="formDescription"
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                />
            </div>
            <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                    id="primaryColor"
                    type="color"
                    value={form.theme.primaryColor}
                    onChange={(e) => updateForm({ theme: { ...form.theme, primaryColor: e.target.value } })}
                />
            </div>
            <div>
                <Label htmlFor="backgroundColor">Background Color</Label>
                <Input
                    id="backgroundColor"
                    type="color"
                    value={form.theme.backgroundColor}
                    onChange={(e) => updateForm({ theme: { ...form.theme, backgroundColor: e.target.value } })}
                />
            </div>
            <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <Input
                    id="fontFamily"
                    value={form.theme.fontFamily}
                    onChange={(e) => updateForm({ theme: { ...form.theme, fontFamily: e.target.value } })}
                />
            </div>
        </div>
    );
}