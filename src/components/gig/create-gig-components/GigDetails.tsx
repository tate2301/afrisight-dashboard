import {Paragraph, Caption} from '@/components/design-sytem/typography';
import {Box} from '@radix-ui/themes';
import {CameraIcon} from '@heroicons/react/24/outline';
import {ErrorMessage, TextInput} from './extras';
import {useEffect, useState} from 'react';
import {DatePicker} from '@/components/ui/aria-components/DatePicker';
import {
	CalendarDate,
	getLocalTimeZone,
	parseAbsolute,
	parseDate,
} from '@internationalized/date';
import {NumberField} from '@/components/ui/aria-components/NumberField';

type GigDetailsProps = {
	formik: any;
};

export const GigDetails = ({formik}: GigDetailsProps) => {
	const [coverImage, setCoverImage] = useState<string>('');

	useEffect(() => {
		if (formik.values.coverImage) {
			const imageUrl = URL.createObjectURL(formik.values.coverImage);

			if (imageUrl !== coverImage) {
				setCoverImage(`url(${imageUrl})`);
			}
		}
	}, [formik.values.coverImage]);

	const endDate = formik.values.endDate
		? new Date(formik.values.endDate)
		: new Date();
	return (
		<>
			<label className="space-y-2">
				<Paragraph weight="semibold">
					Title <span className="text-red-500">*</span>
				</Paragraph>
				<TextInput
					className="mb-2"
					name="name"
					value={formik.values.name}
					onChange={(value) => formik.setFieldValue('name', value)}
					onBlur={formik.handleBlur}
				/>
				{formik.touched.name && formik.errors.name && (
					<ErrorMessage>{formik.errors.name}</ErrorMessage>
				)}
				<Caption color="secondary">
					Pay attention to the title and make sure it aligns with the goals of
					the client and their brand voice.
				</Caption>
			</label>
			<label className="space-y-2">
				<Paragraph weight="semibold">
					Description <span className="text-red-500">*</span>
				</Paragraph>
				<textarea
					className="mb-2 border-2 rounded w-full p-2"
					name="description"
					value={formik.values.description}
					onChange={(e) => formik.setFieldValue('description', e.target.value)}
					onBlur={formik.handleBlur}
				/>
				{formik.touched.description && formik.errors.description && (
					<ErrorMessage>{formik.errors.description}</ErrorMessage>
				)}
			</label>
			<DatePicker
				label="End date"
				description="The closing date is the last date by which the gig can be completed."
				className="mb-2"
				errorMessage={formik.errors.endDate}
				aria-label="End date"
				name="endDate"
				onBlur={formik.handleBlur}
				value={parseDate(endDate.toISOString().split('T')[0])}
				onChange={(value) =>
					formik.setFieldValue(
						'endDate',
						value.add({days: 1}).toDate(getLocalTimeZone()).toString(),
					)
				}
			/>
			<NumberField
				label="Estimated duration (minutes)"
				description="The estimated time it takes to complete this gig."
				errorMessage={formik.errors.duration}
				isRequired
				className="mb-2"
				value={formik.values.duration}
				onChange={(value) => formik.setFieldValue('duration', value)}
				onBlur={formik.handleBlur}
			/>
			<label className="space-y-2">
				<Paragraph weight="semibold">Cover image</Paragraph>
				<Box
					style={{
						borderRadius: 16,
						minWidth: 400,
						height: 400,
						maxWidth: 512,
						alignItems: 'center',
						display: 'flex',
						justifyContent: 'center',
						flexDirection: 'column',
						zIndex: 0,
						backgroundImage: coverImage ? coverImage : undefined,
						backgroundPosition: 'center',
						backgroundSize: 'cover',
					}}
					className="py-4 relative z-0 cursor-pointer border border-zinc-400/30 bg-zinc-50">
					{!coverImage && (
						<>
							<CameraIcon className="size-4" />
							<Paragraph
								weight="medium"
								className="flex items-center gap-2">
								Click to select an image
							</Paragraph>
							<Caption color="secondary">
								Only image files are supported. (PNG, JPG, JPEG)
							</Caption>
						</>
					)}
				</Box>
				<input
					id="coverImage"
					className="hidden"
					type="file"
					accept="image/*"
					onChange={(event) => {
						const file = event.target.files?.[0];
						if (file) {
							formik.setFieldValue('coverImage', file);
						}
					}}
				/>
				{formik.values.coverImage && (
					<Caption
						className="mt-2"
						color="secondary"
						weight="bold">
						{(formik.values.coverImage as File).name}
					</Caption>
				)}
			</label>
		</>
	);
};
