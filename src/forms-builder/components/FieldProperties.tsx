import React, { KeyboardEvent } from 'react';
import { useFormContext } from '../context';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FormField, InputType } from '../types';
import { Switch, TextField, Select } from '@radix-ui/themes';
import { Caption, Paragraph } from '@/components/design-sytem/typography';
import Box from '@/components/design-sytem/box';
import Separator from '@/components/design-sytem/separator';
import styled from '@/components/design-sytem/theme';

const fieldTypes = [
	{ value: 'shortAnswer', label: 'Short Answer' },
	{ value: 'longAnswer', label: 'Long Answer' },
	{ value: 'email', label: 'Email' },
	{ value: 'date', label: 'Date' },
	{ value: 'multipleChoice', label: 'Multiple Choice' },
	{ value: 'yesNo', label: 'Yes/No' },
	{ value: 'npsRating', label: 'NPS Rating' },
	{ value: 'fileUpload', label: 'File Upload' },
	{ value: 'likertScale', label: 'Likert Scale' },
];

const Label = styled(Caption, {
	fontWeight: '600',
	marginBottom: '4px',
});

export function FieldProperties() {
	const { form, updateField, selectedFieldId } = useFormContext();
	const selectedField = form.fields?.find(
		(field) => field.id === selectedFieldId,
	);

	if (!selectedField) {
		return <div>No field selected</div>;
	}

	const handleChange = (key: keyof FormField, value: any) => {
		updateField(selectedField.id, { [key]: value });
	};

	const handlePropertyChange = (key: string, value: any) => {
		updateField(selectedField.id, {
			properties: { ...selectedField.properties, [key]: value },
		});
	};

	const handleTypeChange = (newType: InputType) => {
		updateField(selectedField.id, {
			type: newType,
			properties: {}, // Reset properties when changing type
		});
	};

	const handleChoiceKeyDown = (
		event: KeyboardEvent<HTMLInputElement>,
		index: number,
	) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			const newChoices = [...(selectedField.properties.choices || []), ''];
			handlePropertyChange('choices', newChoices);
		}
	};

	return (
		<div className="space-y-4">
			<Paragraph
				weight={'bold'}
				color={'primary'}
				className="text-lg font-medium">
				Field Properties
			</Paragraph>

			<Box className="flex flex-col gap-2">
				<Label
					as="label"
					htmlFor="fieldType">
					Field Type
				</Label>
				<Select.Root
					value={selectedField.type}
					onValueChange={(value) => handleTypeChange(value as InputType)}>
					<Select.Trigger />
					<Select.Content>
						{fieldTypes.map((type) => (
							<Select.Item
								key={type.value}
								value={type.value}>
								{type.label}
							</Select.Item>
						))}
					</Select.Content>
				</Select.Root>
			</Box>
			<Separator className="my-4" />

			<div>
				<Label
					as="label"
					htmlFor="fieldLabel">
					Label
				</Label>
				<TextField.Root
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
				<Label
					as="label"
					htmlFor="required">
					Required
				</Label>
			</div>

			<div>
				<Label
					as="label"
					htmlFor="placeholder">
					Placeholder
				</Label>
				<TextField.Root
					id="placeholder"
					value={selectedField.properties.placeholder || ''}
					onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
				/>
			</div>

			{/* Render type-specific properties */}
			{(selectedField.type === 'shortAnswer' ||
				selectedField.type === 'longAnswer') && (
					<>
						<div>
							<Label
								as="label"
								htmlFor="minLength">
								Min Length
							</Label>
							<TextField.Root
								id="minLength"
								type="number"
								value={selectedField.properties.minLength || ''}
								onChange={(e) =>
									handlePropertyChange('minLength', parseInt(e.target.value))
								}
							/>
						</div>
						<div>
							<Label
								as="label"
								htmlFor="maxLength">
								Max Length
							</Label>
							<TextField.Root
								id="maxLength"
								type="number"
								value={selectedField.properties.maxLength || ''}
								onChange={(e) =>
									handlePropertyChange('maxLength', parseInt(e.target.value))
								}
							/>
						</div>
					</>
				)}

			{selectedField.type === 'multipleChoice' && (
				<div>
					<Label>Choices</Label>
					{selectedField.properties.choices?.map((choice, index) => (
						<div
							key={index}
							className="flex items-center space-x-2 mt-2">
							<TextField.Root
								value={choice}
								onChange={(e) => {
									const newChoices = [
										...(selectedField.properties.choices || []),
									];
									newChoices[index] = e.target.value;
									handlePropertyChange('choices', newChoices);
								}}
								onKeyDown={(e) => handleChoiceKeyDown(e, index)}
							/>
							<Button
								onClick={() => {
									const newChoices = selectedField.properties.choices?.filter(
										(_, i) => i !== index,
									);
									handlePropertyChange('choices', newChoices);
								}}
								variant="destructive"
								size="sm">
								Remove
							</Button>
						</div>
					))}
					<Button
						onClick={() => {
							const newChoices = [
								...(selectedField.properties.choices || []),
								'',
							];
							handlePropertyChange('choices', newChoices);
						}}
						className="mt-2">
						Add Choice
					</Button>
				</div>
			)}

			{selectedField.type === 'npsRating' && (
				<div>
					<Label
						as="label"
						htmlFor="npsMaxRating">
						Max Rating (NPS)
					</Label>
					<TextField.Root
						id="npsMaxRating"
						type="number"
						value={selectedField.properties.npsMaxRating || 10}
						onChange={(e) =>
							handlePropertyChange('npsMaxRating', parseInt(e.target.value))
						}
					/>
				</div>
			)}

			{selectedField.type === 'fileUpload' && (
				<>
					<div>
						<Label
							as="label"
							htmlFor="allowedFileTypes">
							Allowed File Types (comma-separated)
						</Label>
						<TextField.Root
							id="allowedFileTypes"
							value={selectedField.properties.allowedFileTypes?.join(',') || ''}
							onChange={(e) =>
								handlePropertyChange(
									'allowedFileTypes',
									e.target.value.split(','),
								)
							}
						/>
					</div>
					<div>
						<Label
							as="label"
							htmlFor="maxFileSize">
							Max File Size (MB)
						</Label>
						<TextField.Root
							id="maxFileSize"
							type="number"
							value={selectedField.properties.maxFileSize || ''}
							onChange={(e) =>
								handlePropertyChange('maxFileSize', parseInt(e.target.value))
							}
						/>
					</div>
				</>
			)}

			{selectedField.type === 'likertScale' && (
				<div>
					<Label
						as="label"
						htmlFor="likertScalePoints">
						Number of Scale Points
					</Label>
					<TextField.Root
						id="likertScalePoints"
						type="number"
						value={selectedField.properties.scalePoints || 5}
						onChange={(e) =>
							handlePropertyChange('scalePoints', parseInt(e.target.value))
						}
					/>
				</div>
			)}

		</div>
	);
}
