import React from 'react';
import {FormField} from '../types';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Checkbox} from '@/components/ui/checkbox';
import {Paragraph} from '@/components/design-sytem/typography';

export function renderField(field: FormField) {
	const {id, label, required, type, properties} = field;

	const commonProps = {
		id,
		required,
		placeholder: properties.placeholder || `Enter ${label.toLowerCase()}`,
	};

	switch (type) {
		case 'shortAnswer':
			return (
				<div className="space-y-2">
					<Paragraph
						weight={'medium'}
						color={'primary'}
						as={'label'}
						htmlFor={id}>
						{label}
						{required && '*'}
					</Paragraph>
					<Input
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
						color={'primary'}
						as={'label'}
						htmlFor={id}>
						{label}
						{required && '*'}
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
						color={'primary'}
						as={'label'}
						htmlFor={id}>
						{label}
						{required && '*'}
					</Paragraph>
					<Input
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
						color={'primary'}
						as={'label'}
						htmlFor={id}>
						{label}
						{required && '*'}
					</Paragraph>
					<Input
						type="date"
						{...commonProps}
					/>
				</div>
			);
		case 'multipleChoice':
			return (
				<div className="space-y-2">
					<Paragraph
						weight={'medium'}
						color={'primary'}
						as={'label'}>
						{label}
						{required && '*'}
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
						color={'primary'}
						as={'label'}>
						{label}
						{required && '*'}
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
		case 'npsRating':
			const maxRating = properties.npsMaxRating || 10;
			return (
				<div className="space-y-2">
					<Paragraph
						weight={'medium'}
						color={'primary'}
						as={'label'}
						htmlFor={id}>
						{label}
						{required && '*'}
					</Paragraph>
					<div className="flex space-x-2">
						{Array.from({length: maxRating}, (_, i) => i + 1).map((value) => (
							<button
								key={value}
								className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
								{value}
							</button>
						))}
					</div>
					<div className="flex justify-between text-sm text-gray-500">
						<span>Not at all likely</span>
						<span>Extremely likely</span>
					</div>
				</div>
			);

		case 'likertScale':
			const maxRatingScale = properties.scalePoints || 5;
			return (
				<div className="space-y-2">
					<Paragraph
						weight={'medium'}
						color={'primary'}
						as={'label'}
						htmlFor={id}>
						{label}
						{required && '*'}
					</Paragraph>
					<div className="flex space-x-2">
						{Array.from({length: maxRatingScale}, (_, i) => i + 1).map(
							(value) => (
								<button
									key={value}
									className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
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
						color={'primary'}
						as={'label'}
						htmlFor={id}>
						{label}
						{required && '*'}
					</Paragraph>
					<Input
						type="file"
						{...commonProps}
						accept={properties.allowedFileTypes?.join(',')}
					/>
					{properties.maxFileSize && (
						<p className="text-sm text-gray-500">
							Max file size: {properties.maxFileSize}MB
						</p>
					)}
				</div>
			);
		default:
			return <div>Unsupported field type: {type}</div>;
	}
}
