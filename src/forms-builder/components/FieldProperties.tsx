import React from 'react';
import { useFormContext } from '../context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FormField, InputType } from '../types';
import { Switch } from '@radix-ui/themes';

export function FieldProperties() {
    const { form, updateField } = useFormContext();
    const selectedField = form.fields[form.fields.length - 1];

    if (!selectedField) {
        return <div>No field selected</div>;
    }

    const handleChange = (key: keyof FormField, value: any) => {
        updateField(selectedField.id, { [key]: value });
    };

    const handlePropertyChange = (key: string, value: any) => {
        updateField(selectedField.id, {
            properties: { ...selectedField.properties, [key]: value }
        });
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Field Properties</h2>
            <div>
                <Label htmlFor="fieldLabel">Label</Label>
                <Input
                    id="fieldLabel"
                    value={selectedField.label}
                    onChange={(e) => handleChange('label', e.target.value)}
                />
            </div>
            <div className="flex items-center space-x-2">
                <Switch
                    id="required"
                    checked={selectedField.required}
                    onCheckedChange={(checked) => handleChange('required', checked)}
                />
                <Label htmlFor="required">Required</Label>
            </div>
            <div>
                <Label htmlFor="placeholder">Placeholder</Label>
                <Input
                    id="placeholder"
                    value={selectedField.properties.placeholder || ''}
                    onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
                />
            </div>
            {(selectedField.type === 'shortAnswer' || selectedField.type === 'longAnswer') && (
                <>
                    <div>
                        <Label htmlFor="minLength">Min Length</Label>
                        <Input
                            id="minLength"
                            type="number"
                            value={selectedField.properties.minLength || ''}
                            onChange={(e) => handlePropertyChange('minLength', parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="maxLength">Max Length</Label>
                        <Input
                            id="maxLength"
                            type="number"
                            value={selectedField.properties.maxLength || ''}
                            onChange={(e) => handlePropertyChange('maxLength', parseInt(e.target.value))}
                        />
                    </div>
                </>
            )}
            {selectedField.type === 'multipleChoice' && (
                <div>
                    <Label>Choices</Label>
                    {selectedField.properties.choices?.map((choice, index) => (
                        <div key={index} className="flex items-center space-x-2 mt-2">
                            <Input
                                value={choice}
                                onChange={(e) => {
                                    const newChoices = [...(selectedField.properties.choices || [])];
                                    newChoices[index] = e.target.value;
                                    handlePropertyChange('choices', newChoices);
                                }}
                            />
                            <Button
                                onClick={() => {
                                    const newChoices = selectedField.properties.choices?.filter((_, i) => i !== index);
                                    handlePropertyChange('choices', newChoices);
                                }}
                                variant="destructive"
                                size="sm"
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                    <Button
                        onClick={() => {
                            const newChoices = [...(selectedField.properties.choices || []), ''];
                            handlePropertyChange('choices', newChoices);
                        }}
                        className="mt-2"
                    >
                        Add Choice
                    </Button>
                </div>
            )}
            {selectedField.type === 'npsRating' && (
                <>

                    <div>
                        <Label htmlFor="npsMaxRating">Max Rating (NPS)</Label>
                        <Input
                            id="npsMaxRating"
                            type="number"
                            value={selectedField.properties.npsMaxRating || 10}
                            onChange={(e) => handlePropertyChange('npsMaxRating', parseInt(e.target.value))}
                        />
                    </div>
                </>
            )}
            {selectedField.type === 'fileUpload' && (
                <>
                    <div>
                        <Label htmlFor="allowedFileTypes">Allowed File Types (comma-separated)</Label>
                        <Input
                            id="allowedFileTypes"
                            value={selectedField.properties.allowedFileTypes?.join(',') || ''}
                            onChange={(e) => handlePropertyChange('allowedFileTypes', e.target.value.split(','))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                        <Input
                            id="maxFileSize"
                            type="number"
                            value={selectedField.properties.maxFileSize || ''}
                            onChange={(e) => handlePropertyChange('maxFileSize', parseInt(e.target.value))}
                        />
                    </div>
                </>
            )}
        </div>
    );
}