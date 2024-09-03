import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import axiosInstance from "@/hooks/useApiFetcher";
import { PlusIcon } from "lucide-react";
import useDisclosure from "@/hooks/useDisclosure";
import { addDays } from "date-fns";
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import AutocompleteSelect from "@/components/ui/autocomplete";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import useWithStatus from "@/hooks/useWithStatus";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { AUTH_ROUTES, FORM_ROUTES, SURVEY_ROUTES, USER_ROUTES } from "@/lib/api-routes";
import ClientsAutocompleteSelect from "./select/clients-autocomplete-select";
import ClientFormsAutocomplete from "../ui/client-forms-autocomplete";

type SurveyFormSchema = {
    name: string
    description: string
    difficulty: string
    category: string
    form: string
    client: string
    duration: number
    coverImage: string
    additionalReward: string
    dollarRewardValue: number
    additionalRewardValue: any

}

export const CreateSurvey = (props: { callback: () => Promise<void> }) => {
    const { executor, isLoading, error } = useWithStatus();
    const { isOpen, onClose, onOpen } = useDisclosure();

    const onSubmit = async (
        values: SurveyFormSchema,
        helpers: FormikHelpers<SurveyFormSchema>,
    ) => {
        console.log({ values })
        await executor(() => axiosInstance.post(SURVEY_ROUTES.CREATE_SURVEY, { ...values, endDate: addDays(new Date(), 365) }));

        props
            .callback()
            .then(() => helpers.setSubmitting(false))
            .then(onClose);
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        description: Yup.string().required("Description is required"),
        difficulty: Yup.string().required("Difficulty is required"),
        category: Yup.string().required("Category is required"),
        form: Yup.string().required("Form ID is required"),
        client: Yup.string().required("Client is required"),
        duration: Yup.number().required("Duration is required"),
        coverImage: Yup.mixed().required("Cover image is required"),
        additionalReward: Yup.string().required("Additional reward required"),
        dollarRewardValue: Yup.number().required("Dollar amount is required"),
        additionalRewardValue: Yup.mixed().required("Reward value is required"),
    });



    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (open) onOpen();
                if (!open) onClose();
            }}>
            <DialogTrigger asChild>
                <button className='bg-white text-zinc-900 pressable-shadow rounded-lg shadow-sm flex flex-row items-center space-x-2 font-medium px-4 pl-2 h-[28px]'>
                    <PlusIcon
                        height={20}
                        width={20}
                    />
                    <p>Create survey</p>
                </button>
            </DialogTrigger>
            <DialogContent className="h-[80vh] bg-white gap-0 max-w-screen-md overflow-hidden p-0">
                <DialogHeader className="bg-white p-4 border-b-[0.5px] border-zinc-400/30 sticky top-0 z-10">
                    <DialogTitle>Create survey</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto pb-0 relative">

                    <Formik
                        initialValues={{
                            name: "",
                            description: "",
                            difficulty: "",
                            category: "",
                            form: "",
                            client: '',
                            coverImage: "",
                            duration: 7,
                            additionalReward: "points",
                            dollarRewardValue: 0.25,
                            additionalRewardValue: {}
                        }}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ isSubmitting, setFieldValue, values, isValid, errors }) => {
                            return (
                                <Form>
                                    <div className="p-4 bg-white block">
                                        <p className="font-semibold mb-6">
                                            Survey information
                                        </p>
                                        <div className="mb-8">
                                            <div className='flex flex-col space-y-2 mb-6'>
                                                <label htmlFor='name' className='text-sm font-semibold'>
                                                    Name
                                                </label>
                                                <Field
                                                    as={Input}
                                                    name='name'
                                                    type='text'
                                                    className='input-box-shadow'
                                                    placeholder="Survey name"
                                                />
                                                <ErrorMessage
                                                    name='name'
                                                    component='div'
                                                    className='text-red-500 text-sm'
                                                />
                                            </div>

                                            <div className='flex flex-col space-y-2 mb-12'>
                                                <label htmlFor='description' className='text-sm font-semibold'>
                                                    Description
                                                </label>
                                                <Field
                                                    as={Textarea}
                                                    name='description'
                                                    type='text'
                                                    className='input-class'
                                                />
                                                <ErrorMessage
                                                    name='description'
                                                    component='div'
                                                    className='text-red-500 text-sm'
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-12">
                                                <div className="flex flex-col space-y-2">
                                                    <label htmlFor='client' className='text-sm font-semibold'>
                                                        Client
                                                    </label>
                                                    <ClientsAutocompleteSelect name="client" placeholder="Select a client" fetchUrl={USER_ROUTES.GET_CLIENTS} />
                                                    <ErrorMessage
                                                        name='client'
                                                        component='div'
                                                        className='text-red-500 text-sm'
                                                    />
                                                </div>
                                                <div className="flex flex-col space-y-2">
                                                    <label htmlFor='form' className='text-sm font-semibold'>
                                                        Form
                                                    </label>
                                                    <ClientFormsAutocomplete name="form" placeholder="Select a form" fetchUrl={FORM_ROUTES.GET_FORMS_FOR_USER_BY_ID(values.client)} />
                                                    <ErrorMessage
                                                        name='form'
                                                        component='div'
                                                        className='text-red-500 text-sm'
                                                    />
                                                </div>
                                            </div>

                                            <div className='flex flex-col space-y-2 mb-6'>
                                                <label htmlFor='coverImage' className='text-sm font-semibold'>
                                                    Cover Image
                                                </label>
                                                <Field
                                                    as={Input}
                                                    name='coverImage'
                                                    type='file'
                                                    className='input-class'
                                                />
                                                <ErrorMessage
                                                    name='coverImage'
                                                    component='div'
                                                    className='text-red-500 text-sm'
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 gap-y-2 mb-8">
                                            <div className='flex flex-col space-y-2 mb-6'>
                                                <label htmlFor='difficulty' className='text-sm font-semibold'>
                                                    Difficulty
                                                </label>
                                                <Field
                                                    // onValueChange={(value) => setFieldValue("category", value)}
                                                    // value={values.category}
                                                    name='difficulty'
                                                >
                                                    {({ field, form }: FieldProps) => (
                                                        <AutocompleteSelect
                                                            name={field.name}
                                                            onChange={(value) => form.setFieldValue("difficulty", value)}
                                                            defaultValue={field.value}
                                                            options={[
                                                                { value: 'expert', label: 'Expert Knowledge' },
                                                                { value: 'simple', label: 'Easy' },
                                                                { value: 'experienced', label: 'Experience required' },
                                                                { value: 'subject_matter', label: 'Subject matter expertise' },
                                                                { value: 'general_knowledge', label: 'General knowledge' },
                                                            ]}
                                                            placeholder="Set difficulty level"
                                                            renderOption={(option) => (
                                                                <div className="flex items-center">
                                                                    <span className="mr-2">{option.label}</span>
                                                                </div>
                                                            )}
                                                        />
                                                    )}
                                                </Field>
                                                <ErrorMessage
                                                    name='difficulty'
                                                    component='div'
                                                    className='text-red-500 text-sm'
                                                />
                                            </div>

                                            <div className='flex flex-col space-y-2 mb-6'>
                                                <label htmlFor='category' className='text-sm font-semibold'>
                                                    Category
                                                </label>
                                                <Field
                                                    // onValueChange={(value) => setFieldValue("category", value)}
                                                    // value={values.category}
                                                    name='category'
                                                >
                                                    {({ field, form }: FieldProps) => (
                                                        <AutocompleteSelect
                                                            name={field.name}
                                                            onChange={(value) => form.setFieldValue("category", value)}
                                                            defaultValue={field.value}
                                                            options={[
                                                                { value: 'language', label: 'Language' },
                                                                { value: 'research', label: 'Research' },
                                                                { value: 'commercial', label: 'Commercial' },
                                                            ]}
                                                            placeholder="Category"
                                                            renderOption={(option) => (
                                                                <div className="flex items-center">
                                                                    <span className="mr-2">{option.label}</span>
                                                                </div>
                                                            )}
                                                        />
                                                    )}
                                                </Field>
                                                <ErrorMessage
                                                    name='category'
                                                    component='div'
                                                    className='text-red-500 text-sm'
                                                />
                                            </div>
                                            <div className='flex flex-col space-y-2 mb-6'>
                                                <label htmlFor='duration' className='text-sm font-semibold'>
                                                    Duration
                                                </label>
                                                <Field
                                                    as={Input}
                                                    name='duration'
                                                    type='number'
                                                    className='input-class'
                                                />
                                                <p className="text-xs text-gray-500">Estimated time to complete survey, in minutes</p>
                                                <ErrorMessage
                                                    name='duration'
                                                    component='div'
                                                    className='text-red-500 text-sm'
                                                />
                                            </div>

                                        </div>

                                        <div className="">
                                            <p className="font-semibold mb-2">Reward details</p>
                                            <div className='flex flex-col space-y-2 mb-6'>
                                                <label htmlFor='dollarRewardValue' className='text-sm font-semibold'>
                                                    Dollar amount (USD)
                                                </label>
                                                <Field
                                                    as={Input}
                                                    name='dollarRewardValue'
                                                    type='text'
                                                    className='input-class'
                                                />
                                                <ErrorMessage
                                                    name='dollarRewardValue'
                                                    component='div'
                                                    className='text-red-500 text-sm'
                                                />
                                            </div>

                                            <div className="mb-6">
                                                <p className="font-semibold text-sm mb-2">
                                                    Additional reward type
                                                </p>
                                                <Field name="additionalReward">
                                                    {(({ field, form }: FieldProps) => (
                                                        <RadioGroup name="additionalReward" defaultValue="points" onValueChange={(value) => form.setFieldValue("additionalReward", value)} className="flex items-center">
                                                            <div className="flex items-center space-x-2 justify-between h-[40px] px-8 rounded-md border border-zinc-400">
                                                                <RadioGroupItem value="points" id="points" />
                                                                <Label htmlFor="points">Points</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2 h-[40px] px-8 rounded-md border border-zinc-400">
                                                                <RadioGroupItem value="voucher" id="voucher" />
                                                                <Label htmlFor="voucher">Voucher</Label>
                                                            </div>
                                                        </RadioGroup>
                                                    ))}
                                                </Field>
                                            </div>
                                            <div>
                                                {
                                                    values.additionalReward === "points" && <PointsRewardInput />
                                                }
                                                {
                                                    values.additionalReward === "voucher" && <VoucherRewardInputs setFieldValue={setFieldValue} />
                                                }
                                            </div>
                                        </div>

                                    </div>

                                    <div className="sticky bottom-0 bg-white z-10 py-2 border-t gap-2 flex items-center justify-end px-4">
                                        <button className={cn("bg-white flex items-center h-[28px] pressable-shadow px-3 rounded-md font-medium border-zinc-400/30 shadow text-zinc-900",)}>
                                            Cancel</button>
                                        <button
                                            type='submit'
                                            disabled={isSubmitting || !isValid}
                                            className='h-[28px] px-2 rounded-md flex disabled:opacity-50 items-center font-medium text-white bg-blue-600'
                                        >
                                            {isSubmitting ? <Spinner /> : 'Add'}
                                        </button>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const VoucherRewardInputs = (props: {
    setFieldValue: (field: string, value: string | number | Date) => void
}) => {

    const generateVoucherCode = () => {
        const code = Math.random().toString(36).substring(2, 12).toUpperCase();
        return code
    }

    useEffect(() => {
        props.setFieldValue("additionalRewardValue.maxRedemptions", 1000);
        props.setFieldValue("additionalRewardValue.expiresAt", addDays(new Date(), 356))

        return () => {
            props.setFieldValue("additionalRewardValue.maxRedemptions", "");
            props.setFieldValue("additionalRewardValue.expiresAt", "")
            props.setFieldValue("additionalRewardValue.code", "")
        }
    }, [])

    return (
        <div>
            <div className='flex flex-col space-y-2 mb-6'>
                <label
                    htmlFor='additionalRewardValue.code'
                    className='text-sm font-semibold'>
                    Voucher code
                </label>
                <Field
                    as={Input}
                    name='additionalRewardValue.code'
                    type='additionalRewardValue.code'
                    className='input-class'
                />
                <div className="mt-2">
                    <button type="button" onClick={() => {
                        const code = generateVoucherCode();
                        props.setFieldValue('additionalRewardValue.code', code);
                    }} className="text-blue-600 text-sm font-semibold">Generate code</button>
                </div>
                <ErrorMessage
                    name='additionalRewardValue.code'
                    component='div'
                    className='text-red-500 text-sm'
                />
            </div>
        </div>
    )
}

const PointsRewardInput = () => {


    return (
        <div className='flex flex-col space-y-2 mb-6'>
            <label htmlFor='additionalRewardValue.amount' className='text-sm font-semibold'>
                XP reward
            </label>
            <Field
                as={Input}
                name='additionalRewardValue.amount'
                type='number'
                className='input-class'
            />
            <p className="text-xs text-gray-500">Number of points to reward each participant</p>
            <ErrorMessage
                name='additionalRewardValue.amount'
                component='div'
                className='text-red-500 text-sm'
            />
        </div>
    )
}
