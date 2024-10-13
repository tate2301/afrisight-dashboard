import React from 'react';
import {Paragraph} from '@/components/design-sytem/typography';
import {TextInput} from '../gig/create-gig-components/extras';

interface GigLocationProps {
	values: any;
	handleChange: (e: React.ChangeEvent<any>) => void;
	handleBlur: (e: React.FocusEvent<any>) => void;
}

export const GigLocation: React.FC<GigLocationProps> = ({
	values,
	handleChange,
	handleBlur,
}) => {
	return (
		<div className="mb-4">
			<Paragraph weight={'semibold'}>Location</Paragraph>
			<TextInput
				name="location"
				value={values.location}
				onChange={handleChange}
				onBlur={handleBlur}
			/>
		</div>
	);
};
