import { Paragraph, Caption } from '@/components/design-sytem/typography';
import { Card } from '@radix-ui/themes';
import { CameraIcon } from '@heroicons/react/24/outline';
import { ErrorMessage, TextInput } from './extras';

type GigDetailsProps = {
    formik: any;
    setPreviewImage: (previewImage: string) => void;
}

export const GigDetails = ({ formik, setPreviewImage }: GigDetailsProps) => (
    <>
        <label className="space-y-2">
            <Paragraph weight="semibold">
                Title <span className="text-red-500">*</span>
            </Paragraph>
            <TextInput
                className="mb-2"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.title && formik.errors.title && (
                <ErrorMessage>{formik.errors.title}</ErrorMessage>
            )}
            <Caption color="secondary">
                Pay attention to the title and make sure it aligns with the goals of the client and their brand voice.
            </Caption>
        </label>
        <label className="space-y-2">
            <Paragraph weight="semibold">
                Description <span className="text-red-500">*</span>
            </Paragraph>
            <TextInput
                className="mb-2"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.description && formik.errors.description && (
                <ErrorMessage>{formik.errors.description}</ErrorMessage>
            )}
        </label>
        <label className="space-y-2">
            <Paragraph weight="semibold">
                Closing date <span className="text-red-500">*</span>
            </Paragraph>
            <TextInput
                className="mb-2"
                name="closingDate"
                type="date"
                value={formik.values.closingDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.closingDate && formik.errors.closingDate && (
                <ErrorMessage>{formik.errors.closingDate}</ErrorMessage>
            )}
            <Caption color="secondary">
                The closing date is the last date by which the gig can be completed.
            </Caption>
        </label>
        <label className="space-y-2">
            <Paragraph weight="semibold">
                Estimated duration <span className="text-red-500">*</span>
            </Paragraph>
            <TextInput
                className="mb-2"
                name="duration"
                type="number"
                value={formik.values.duration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.closingDate && formik.errors.duration && (
                <ErrorMessage>{formik.errors.duration}</ErrorMessage>
            )}
            <Caption color="secondary">
                The estimated time it takes to complete this gig.
            </Caption>
        </label>
        <label className="space-y-2">
            <Paragraph weight="semibold">Cover image</Paragraph>
            <Card
                style={{
                    minWidth: 400,
                    maxWidth: 512,
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    zIndex: 0,
                }}
                className="py-4 relative z-0 cursor-pointer"
            >
                <CameraIcon className="size-4" />
                <Paragraph weight="medium" className="flex items-center gap-2">
                    Click to select an image
                </Paragraph>
                <Caption color="secondary">
                    Only image files are supported. (PNG, JPG, JPEG)
                </Caption>
            </Card>
            <input
                id="coverImage"
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                        formik.setFieldValue('coverImage', file);
                        setPreviewImage(URL.createObjectURL(file));
                    }
                }}
            />
            {formik.values.coverImage && (
                <Caption className="mt-2" color="secondary" weight="bold">
                    {(formik.values.coverImage as File).name}
                </Caption>
            )}
        </label>
    </>
);