import {Select} from '@radix-ui/themes';
import {Label} from '@/components/ui/aria-components/Field';
import type {FormikProps} from 'formik';
import {ErrorMessage} from '../../extras';
import {cn} from '@/lib/utils';
import {NumberField} from '@/components/ui/aria-components/NumberField';
import {TBaseGig} from '../../FormikWrapper';

interface DemographicsSectionProps {
	formik: FormikProps<TBaseGig>;
	showHeader?: boolean
}

export function DemographicsSection({formik, showHeader = true}: DemographicsSectionProps) {
	return (
		<section
			className="space-y-6"
			aria-labelledby="demographics">
			<div className="grid grid-cols-1  gap-6">
				{/* Gender */}
				<div className="space-y-2">
					<Label htmlFor="targetGender">Target Gender</Label>
					<Select.Root
						name="targetGender"
						value={formik.values.targetGender}
						onValueChange={(value) =>
							formik.setFieldValue('targetGender', value)
						}>
						<Select.Trigger
							id="targetGender"
							className={cn(
								'w-full h-[38px] px-3 py-2 text-sm',
								'bg-white border border-zinc-200 rounded-md',
								'hover:bg-zinc-50 transition-colors',
								'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500',
								formik.errors.targetGender &&
									formik.touched.targetGender &&
									'border-red-500',
							)}
						/>
						<Select.Content>
							<div className="p-1">
								<Select.Item value="All">All Genders</Select.Item>
								<Select.Item value="Male">Male</Select.Item>
								<Select.Item value="Female">Female</Select.Item>
								<Select.Item value="Other">Other</Select.Item>
							</div>
						</Select.Content>
					</Select.Root>
					{formik.touched.targetGender && formik.errors.targetGender && (
						<ErrorMessage>{formik.errors.targetGender}</ErrorMessage>
					)}
				</div>

				{/* Age Range */}
				<div className="space-y-4">
					<Label>Age Range</Label>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<NumberField
								label="Minimum Age"
								value={formik.values.targetAgeRange?.min}
								onChange={(value) =>
									formik.setFieldValue('targetAgeRange.min', Number(value))
								}
								onBlur={formik.handleBlur}
								name="targetAgeRange.min"
								minValue={13}
								maxValue={100}
								className="w-full"
								inputClassName={cn(
									'h-[38px] w-full px-3 py-2 text-sm',
									'bg-white border border-zinc-200 rounded-md',
									'hover:bg-zinc-50 transition-colors',
									'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500',
									formik.errors.targetAgeRange &&
										formik.touched.targetAgeRange &&
										'border-red-500',
								)}
							/>
							{formik.touched.targetAgeRange &&
								formik.errors.targetAgeRange && (
									<ErrorMessage>{formik.errors.targetAgeRange}</ErrorMessage>
								)}
						</div>
						<div>
							<NumberField
								label="Maximum Age"
								value={formik.values.targetAgeRange?.max}
								onChange={(value) =>
									formik.setFieldValue('targetAgeRange.max', Number(value))
								}
								onBlur={formik.handleBlur}
								name="targetAgeRange.max"
								minValue={13}
								maxValue={100}
								className="w-full"
								inputClassName={cn(
									'h-[38px] w-full px-3 py-2 text-sm',
									'bg-white border border-zinc-200 rounded-md',
									'hover:bg-zinc-50 transition-colors',
									'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500',
									formik.errors.targetAgeRange &&
										formik.touched.targetAgeRange &&
										'border-red-500',
								)}
							/>
							{formik.touched.targetAgeRange &&
								formik.errors.targetAgeRange && (
									<ErrorMessage>{formik.errors.targetAgeRange}</ErrorMessage>
								)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
