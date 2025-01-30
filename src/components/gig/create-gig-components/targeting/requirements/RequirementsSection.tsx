import { Select } from '@radix-ui/themes';
import { Label } from '@/components/ui/aria-components/Field';
import { MultiSelect } from '@/components/ui/multi-select';
import type { FormikProps } from 'formik';
import { ErrorMessage } from '../../extras';
import { cn } from '@/lib/utils';
import { TBaseGig } from '../../FormikWrapper';

const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
];

interface RequirementsSectionProps {
    formik: FormikProps<TBaseGig>;
    showHeader?: boolean
}

export function RequirementsSection({ formik, showHeader = true }: RequirementsSectionProps) {
    return (
        <section className="space-y-6" aria-labelledby="requirements">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Language */}
                <div className="space-y-2">
                    <Label htmlFor="language">Language Requirements</Label>
                    <MultiSelect
                        label="Select languages"
                        value={formik.values.languageRequirements || []}
                        onChange={(values) =>
                            formik.setFieldValue('languageRequirements', values)
                        }
                        options={languageOptions}
                    />
                    {formik.touched.languageRequirements && formik.errors.languageRequirements && (
                        <ErrorMessage>{formik.errors.languageRequirements}</ErrorMessage>
                    )}
                </div>

                {/* Education */}
                <div className="space-y-2">
                    <Label htmlFor="education">Education Level</Label>
                    <Select.Root
                        name="educationLevel"
                        value={formik.values.educationLevel}
                        onValueChange={(value) =>
                            formik.setFieldValue('educationLevel', value)
                        }>
                        <Select.Trigger
                            id="education"
                            className={cn(
                                'w-full h-[38px] px-3 py-2 text-sm',
                                'bg-white border border-zinc-200 rounded-md',
                                'hover:bg-zinc-50 transition-colors',
                                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500',
                                formik.errors.educationLevel &&
                                formik.touched.educationLevel &&
                                'border-red-500'
                            )}
                        />
                        <Select.Content className="bg-white rounded-md shadow-lg border border-zinc-200">
                            <div className="p-1">
                                <Select.Item value="highSchool">High School</Select.Item>
                                <Select.Item value="bachelors">Bachelor's Degree</Select.Item>
                                <Select.Item value="masters">Master's Degree</Select.Item>
                                <Select.Item value="phd">PhD</Select.Item>
                            </div>
                        </Select.Content>
                    </Select.Root>
                    {formik.touched.educationLevel && formik.errors.educationLevel && (
                        <ErrorMessage>{formik.errors.educationLevel}</ErrorMessage>
                    )}
                </div>
            </div>
        </section>
    );
} 