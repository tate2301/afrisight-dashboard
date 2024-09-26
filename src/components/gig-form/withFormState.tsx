import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    client: Yup.string().required('Client is required'),
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    closingDate: Yup.date().required('Closing date is required'),
    duration: Yup.number().required('Duration is required'),
    rewardPolicy: Yup.string(),
    location: Yup.string(),
    questionOrdering: Yup.string().oneOf(['preserve', 'shuffle']),
    difficulty: Yup.string().oneOf(['easy', 'hard', 'extreme']),
});

export const withFormState = (WrappedComponent: React.ComponentType<any>) => {
    return (props: any) => {
        const formik = useFormik({
            initialValues: {
                client: '',
                title: '',
                description: '',
                closingDate: '',
                duration: 5,
                coverImage: null,
                rewardPolicy: '',
                location: '',
                questionOrdering: 'preserve',
                difficulty: 'easy',
            },
            validationSchema,
            onSubmit: (values) => {
                // Handle form submission
                console.log(values);
            },
        });

        return <WrappedComponent {...props} formik={formik} />;
    };
};