import React from 'react';
import {useFormContext} from '../context';
import {Label} from '@/components/ui/label';
import {Paragraph} from '@/components/design-sytem/typography';
import {TextArea, TextField} from '@radix-ui/themes';
import {predefinedThemes, ensureCompleteTheme} from '../utils/themeUtils';
import {DEFAULT_THEME} from '../constants';

export function FormSettings() {
	const {form, updateForm} = useFormContext();
	const theme = form.theme || DEFAULT_THEME;

	console.log({predefinedThemes});

	const handleChange = (key: keyof typeof form, value: string) => {
		updateForm({[key]: value});
	};

	const handleThemeSelect = (themeId: string) => {
		const selectedTheme = predefinedThemes.find(
			(theme) => theme.id === themeId,
		);
		if (selectedTheme) {
			const newTheme = selectedTheme;
			updateForm({
				theme: newTheme,
			});
		}
	};

	return (
		<div className="space-y-8 p-4">
			{/* Basic Settings */}
			<section className="space-y-4">
				<Paragraph
					weight={'bold'}
					color={'primary'}>
					Basic Settings
				</Paragraph>
				<div className="space-y-4">
					<div>
						<Label htmlFor="formTitle">Form Title</Label>
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
				</div>
			</section>

			{/* Theme Settings */}
			<section className="space-y-4">
				<Paragraph
					weight={'bold'}
					color={'primary'}>
					Theme
				</Paragraph>

				{/* Theme Palettes Grid */}
				<div className="grid grid-cols-2 gap-3">
					{predefinedThemes.map((theme) => (
						<button
							key={theme.id}
							onClick={() => handleThemeSelect(theme.id)}
							className={`p-4 rounded-lg border transition-all ${
								theme.id === theme.id ? 'ring-2 ring-primary' : ''
							}`}
							style={{
								background: theme.colors.background,
								color: theme.colors.text,
							}}>
							<div className="space-y-2">
								<h3 className="font-medium text-sm">{theme.name}</h3>
								<div className="flex gap-1.5">
									{Object.values(theme.colors).map((color, i) => (
										<div
											key={i}
											className="w-4 h-4 rounded-full"
											style={{backgroundColor: color}}
										/>
									))}
								</div>
							</div>
						</button>
					))}
				</div>

				{/* Custom Color Controls */}
				<div className="space-y-4 mt-6">
					<Paragraph weight={'medium'}>Customize Colors</Paragraph>
					<div className="space-y-3">
						<div>
							<Label htmlFor="primaryColor">Primary Color</Label>
							<div className="flex gap-2">
								<div
									className="w-10 h-10 rounded border"
									style={{
										backgroundColor:
											theme.colors?.background ||
											DEFAULT_THEME.colors.background,
									}}
								/>
								<TextField.Root
									id="primaryColor"
									value={theme.colors?.primary || DEFAULT_THEME.colors.primary}
									onChange={(e) =>
										updateForm({
											theme: {
												...theme,
												colors: {
													...theme.colors,
													primary: e.target.value,
												},
											},
										})
									}
								/>
							</div>
						</div>

						<div>
							<Label htmlFor="backgroundColor">Background Color</Label>
							<div className="flex gap-2">
								<div
									className="w-10 h-10 rounded border"
									style={{
										backgroundColor:
											theme.colors?.background ||
											DEFAULT_THEME.colors.background,
									}}
								/>
								<TextField.Root
									id="backgroundColor"
									value={
										theme.colors?.background || DEFAULT_THEME.colors.background
									}
									onChange={(e) =>
										updateForm({
											theme: {
												...theme,
												colors: {
													...theme.colors,
													background: e.target.value,
												},
											},
										})
									}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
