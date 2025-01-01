import {formatDate as formatDateFns} from 'date-fns';

export const formatDate = (date: string, format: string = 'd MMM, yyyy') => {
	return formatDateFns(date, format);
};

export const evaluateBooleanToYesOrNo = (value: boolean | undefined) =>
	value ? 'Yes' : 'No';
