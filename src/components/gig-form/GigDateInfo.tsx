import React from 'react';
import {Paragraph, Caption} from '@/components/design-sytem/typography';
import {ErrorMessage, TextInput} from '../gig/create-gig-components/extras';

interface GigDateInfoProps {
	values: any;
	errors: any;
	touched: any;
	handleChange: (e: React.ChangeEvent<any>) => void;
	handleBlur: (e: React.FocusEvent<any>) => void;
}

export const GigDateInfo: React.FC<GigDateInfoProps> = ({
	values,
	errors,
	touched,
	handleChange,
	handleBlur,
}) => {
	return (
		<>
			<div className="mb-4">
				<Paragraph weight={'semibold'}>
					Closing date <span className="text-red-500">*</span>
				</Paragraph>
				<TextInput
					name="closingDate"
					type="date"
					value={values.closingDate}
					onChange={handleChange}
					onBlur={handleBlur}
				/>
				{touched.closingDate && errors.closingDate && (
					<ErrorMessage>{errors.closingDate}</ErrorMessage>
				)}
				<Caption color={'tertiary'}>
					The closing date is the last date by which the gig can be completed.
				</Caption>
			</div>
			<div className="mb-4">
				<Paragraph weight={'semibold'}>
					Estimated duration <span className="text-red-500">*</span>
				</Paragraph>
				<TextInput
					name="duration"
					type="number"
					value={values.duration}
					onChange={handleChange}
					onBlur={handleBlur}
				/>
				{touched.duration && errors.duration && (
					<ErrorMessage>{errors.duration}</ErrorMessage>
				)}
				<Caption color={'tertiary'}>
					Estimated time to complete the gig in minutes.
				</Caption>
			</div>
		</>
	);
};
