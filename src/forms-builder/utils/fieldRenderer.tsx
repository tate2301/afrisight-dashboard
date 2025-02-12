import React from 'react';
import {FormField} from '../types';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Checkbox} from '@/components/ui/checkbox';
import {Paragraph} from '@/components/design-sytem/typography';
import {TextInput} from '@/components/gig/create-gig-components/extras';
import {DatePicker} from '@/components/ui/aria-components/DatePicker';

const commonLabelStyles = {
	color: 'var(--text)',
	fontWeight: '500',
} as const;

const commonInputStyles = {
	backgroundColor: 'var(--surface)',
	borderColor: 'var(--border)',
	color: 'var(--text)',
} as const;

const commonButtonStyles = {
	backgroundColor: 'var(--surface)',
	color: 'var(--text)',
} as const;

const commonButtonHoverStyles = {
	backgroundColor: 'var(--primary)',
	color: 'white',
} as const;

export function renderField(field: FormField) {
	const {id, label, required, type, properties} = field;

	const commonProps = {
		id,
		required,
		placeholder: properties.placeholder || `Enter ${label.toLowerCase()}`,
		style: commonInputStyles,
	};

	switch (type) {
		case 'shortAnswer':
			return (
				<div className="space-y-2">
					<Paragraph
						weight={'medium'}
						style={commonLabelStyles}
						as={'label'}
						htmlFor={id}>
						{label}
						{required && <span style={{color: 'var(--primary)'}}>*</span>}
					</Paragraph>

					<TextInput
						type="text"
						{...commonProps}
						minLength={properties.minLength}
						maxLength={properties.maxLength}
					/>
				</div>
			);
		case 'longAnswer':
			return (
				<div className="space-y-2">
					<Paragraph
						weight={'medium'}
						style={commonLabelStyles}
						as={'label'}
						htmlFor={id}>
						{label}
						{required && <span style={{color: 'var(--primary)'}}>*</span>}
					</Paragraph>
					<Textarea
						{...commonProps}
						minLength={properties.minLength}
						maxLength={properties.maxLength}
					/>
				</div>
			);
		case 'email':
			return (
				<div className="space-y-2">
					<Paragraph
						weight={'medium'}
						style={commonLabelStyles}
						as={'label'}
						htmlFor={id}>
						{label}
						{required && <span style={{color: 'var(--primary)'}}>*</span>}
					</Paragraph>
					<TextInput
						type="email"
						{...commonProps}
					/>
				</div>
			);
		case 'date':
			return (
				<div className="space-y-2">
					<Paragraph
						weight={'medium'}
						style={commonLabelStyles}
						as={'label'}
						htmlFor={id}>
						{label}
						{required && <span style={{color: 'var(--primary)'}}>*</span>}
					</Paragraph>
					<DatePicker {...commonProps} />
				</div>
			);
		case 'multipleChoice':
			return (
				<div className="space-y-2">
					<Paragraph
						weight={'medium'}
						style={commonLabelStyles}
						as={'label'}>
						{label}
						{required && <span style={{color: 'var(--primary)'}}>*</span>}
					</Paragraph>
					<RadioGroup>
						{properties.choices?.map((choice, index) => (
							<div
								key={index}
								className="flex items-center space-x-2">
								<RadioGroupItem
									value={choice}
									id={`${id}-${index}`}
								/>
								<Label htmlFor={`${id}-${index}`}>{choice}</Label>
							</div>
						))}
					</RadioGroup>
				</div>
			);
		case 'yesNo':
			return (
				<div className="space-y-2">
					<Paragraph
						weight={'medium'}
						style={commonLabelStyles}
						as={'label'}>
						{label}
						{required && <span style={{color: 'var(--primary)'}}>*</span>}
					</Paragraph>
					<RadioGroup>
						<div className="flex items-center space-x-2">
							<RadioGroupItem
								value="yes"
								id={`${id}-yes`}
							/>
							<Label htmlFor={`${id}-yes`}>Yes</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem
								value="no"
								id={`${id}-no`}
							/>
							<Label htmlFor={`${id}-no`}>No</Label>
						</div>
					</RadioGroup>
				</div>
			);
		case 'npsRating': {
			const maxRating = properties.npsMaxRating || 10;
			return (
				<div className="space-y-2">
					<Paragraph
						weight={'medium'}
						style={commonLabelStyles}
						as={'label'}
						htmlFor={id}>
						{label}
						{required && <span style={{color: 'var(--primary)'}}>*</span>}
					</Paragraph>
					<div
						role="radiogroup"
						aria-label={label}
						className="flex space-x-2">
						{Array.from({length: maxRating}, (_, i) => i + 1).map((value) => (
							<button
								key={value}
								type="button"
								role="radio"
								aria-checked="false"
								aria-label={`Rating ${value}`}
								className="w-8 h-8 rounded-full font-bold flex items-center justify-center transition-colors hover:bg-primary hover:text-white"
								style={commonButtonStyles}>
								{value}
							</button>
						))}
					</div>
					<div
						className="flex justify-between text-sm"
						style={{color: 'var(--text-secondary)'}}>
						<span>Not at all likely</span>
						<span>Extremely likely</span>
					</div>
				</div>
			);
		}
		case 'likertScale':
			const maxRatingScale = properties.scalePoints || 5;
			return (
				<div className="space-y-2">
					<Paragraph
						weight={'medium'}
						style={commonLabelStyles}
						as={'label'}
						htmlFor={id}>
						{label}
						{required && <span style={{color: 'var(--primary)'}}>*</span>}
					</Paragraph>
					<div className="flex space-x-2">
						{Array.from({length: maxRatingScale}, (_, i) => i + 1).map(
							(value) => (
								<button
									key={value}
									type="button"
									className="w-8 h-8 rounded-full font-bold text-content-tertiary bg-surface-secondary flex items-center justify-center hover:bg-surface-quaternary hover:text-content hover:pressable-shadow">
									{value}
								</button>
							),
						)}
					</div>
				</div>
			);
		case 'fileUpload':
			return (
				<div className="space-y-2">
					<Paragraph
						weight={'medium'}
						style={commonLabelStyles}
						as={'label'}
						htmlFor={id}>
						{label}
						{required && <span style={{color: 'var(--primary)'}}>*</span>}
					</Paragraph>
					<Input
						type="file"
						{...commonProps}
						accept={properties.allowedFileTypes?.join(',')}
					/>
					{properties.maxFileSize && (
						<p className="text-[13px] text-gray-500">
							Max file size: {properties.maxFileSize}MB
						</p>
					)}
				</div>
			);
		default:
			return <div>Unsupported field type: {type}</div>;
	}
}
