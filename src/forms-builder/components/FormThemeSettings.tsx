import React from 'react';
import {useFormContext} from '../context';
import {Label} from '@/components/ui/label';
import {TextField, Select} from '@radix-ui/themes';
import {HexColorPicker} from 'react-colorful';
import Box from '@/components/design-sytem/box';
import {Paragraph} from '@/components/design-sytem/typography';
import Separator from '@/components/design-sytem/separator';

const fontFamilies = [
	{value: 'Inter, sans-serif', label: 'Inter'},
	{value: 'Arial, sans-serif', label: 'Arial'},
	{value: 'Georgia, serif', label: 'Georgia'},
	{value: 'Helvetica, sans-serif', label: 'Helvetica'},
	{value: 'Times New Roman, serif', label: 'Times New Roman'},
];

export function FormThemeSettings() {
	const {form, updateForm} = useFormContext();
	const [showColorPicker, setShowColorPicker] = React.useState<
		'primary' | 'background' | null
	>(null);

	const handleThemeChange = (key: keyof typeof form.theme, value: string) => {
		updateForm({
			theme: {
				...form.theme,
				[key]: value,
			},
		});
	};

	return (
		<div className="space-y-4">
			<Paragraph
				weight={'bold'}
				color={'primary'}
				className="text-lg">
				Theme Settings
			</Paragraph>
			<Separator className="my-4" />

			<div>
				<div>
					<Label htmlFor="fontFamily">Font Family</Label>
					<Select.Root
						value={form.theme.font}
						onValueChange={(value) => handleThemeChange('font', value)}>
						<Select.Trigger />
						<Select.Content>
							{fontFamilies.map((font) => (
								<Select.Item
									key={font.value}
									value={font.value}>
									{font.label}
								</Select.Item>
							))}
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</div>
	);
}
