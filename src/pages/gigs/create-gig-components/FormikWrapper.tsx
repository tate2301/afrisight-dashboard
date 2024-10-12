import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    client: Yup.string().required('Client is required'),
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    closingDate: Yup.date().required('Closing date is required'),
    rewardPolicy: Yup.string(),
    location: Yup.string(),
    questionOrdering: Yup.string().oneOf(['preserve', 'shuffle']),
    difficulty: Yup.string().oneOf(['easy', 'hard', 'extreme']),
});

const initialValues = {
    client: '',
    title: '',
    description: '',
    closingDate: '',
    coverImage: null,
    rewardPolicy: '',
    location: '',
    questionOrdering: 'preserve',
    difficulty: 'easy',
    category: 'default',
    duration: 5,
};

export const FormikWrapper: React.FC<{
    onSubmit: (values: typeof initialValues) => Promise<void>;
    children: (formik: FormikProps<typeof initialValues>) => React.ReactNode;
}> = ({ onSubmit, children }) => (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
    >
        {children}
    </Formik>
);
