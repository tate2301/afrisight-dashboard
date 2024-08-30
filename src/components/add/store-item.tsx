import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import axiosInstance from "@/hooks/useApiFetcher";
import { GAMIFICATION_ROUTES } from "@/lib/api-routes";
import useDisclosure from "@/hooks/useDisclosure";
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import useWithStatus from "@/hooks/useWithStatus";
import { Plus } from "lucide-react";
import AutocompleteSelect from "../ui/autocomplete";
import { useEffect } from "react";

type StoreItemFormSchema = {
    name: string;
    description: string;
    type: "virtual_good" | "voucher"
    pointsCost: number;
    stock: number;
    maxRedemptionsPerUser: number;
    expiresAt: string;
    voucherDetails?: {
        value: number;
        currency: string;
        expiresAt: string;
        maxRedemptions: number;
    }
    imageUrl?: string;
    isActive: boolean;

}

type AdditionalFields = {
    basePricePoints: number;
    currentPricePoints: number;
}

const CreateStoreListing = (props: { callback: () => Promise<void> }) => {
    const { executor, isLoading, error } = useWithStatus();
    const { isOpen, onClose, onOpen } = useDisclosure();

    const onSubmit = async (
        values: StoreItemFormSchema,
        helpers: FormikHelpers<StoreItemFormSchema>,
    ) => {
        const data: StoreItemFormSchema & AdditionalFields = {
            ...values,
            basePricePoints: values.pointsCost,
            currentPricePoints: values.pointsCost,
        }
        await executor(() => axiosInstance.post(GAMIFICATION_ROUTES.ADD_STORE_ITEM, data));

        props
            .callback()
            .then(() => helpers.setSubmitting(false))
            .then(onClose);
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
        type: Yup.string().required("Required"),
        pointsCost: Yup.number().required("Required"),
        stock: Yup.number().required("Required"),
        maxRedemptionsPerUser: Yup.number().required("Required"),
        expiresAt: Yup.string().required("Required"),
        imageUrl: Yup.string().required("Required"),
        isActive: Yup.boolean().required("Required"),
        voucherDetails: Yup.object({
            value: Yup.number(),
            currency: Yup.string(),
            expiresAt: Yup.string(),
            maxRedemptions: Yup.number(),
        }).optional()
    });

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (open) onOpen();
                if (!open) onClose();
            }}>
            <DialogTrigger asChild>
                <button className='bg-white text-zinc-900 border border-zinc-300/10 pressable-shadow rounded-md shadow-sm flex flex-row items-center space-x-2 font-medium px-4 pl-2 h-[28px]'>
                    <Plus
                        height={16}
                        width={16}
                    />
                    <p>Create listing</p>
                </button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] h-full bg-white gap-0 max-w-screen-sm overflow-hidden p-0">
                <DialogHeader className="bg-white p-4 border-b border-zinc-400/30 sticky top-0 z-10">
                    <DialogTitle>Create listing</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto pb-0 relative mt-1">
                    <Formik
                        initialValues={{
                            name: "",
                            description: "",
                            type: "virtual_good",
                            pointsCost: 0,
                            stock: 0,
                            maxRedemptionsPerUser: 0,
                            expiresAt: "",
                            imageUrl: "",
                            isActive: true,
                        }}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}>
                        {({ isSubmitting, setFieldValue, values, errors }) => {
                            console.log({ errors })
                            return (
                                <Form>
                                    <div className="p-4">
                                        <div className='flex flex-col space-y-2 mb-6'>
                                            <label
                                                htmlFor='name'
                                                className='text-sm font-semibold'>
                                                Name
                                            </label>
                                            <Field
                                                as={Input}
                                                name='name'
                                                type='text'
                                                className='input-class'
                                            />
                                            <ErrorMessage
                                                name='name'
                                                component='div'
                                                className='text-red-500 text-sm'
                                            />
                                        </div>

                                        <div className='flex flex-col space-y-2 mb-6'>
                                            <label
                                                htmlFor='description'
                                                className='text-sm font-semibold'>
                                                Description
                                            </label>
                                            <Field
                                                as={Input}
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



                                        <div className="grid grid-cols-2 gap-4">
                                            <div className='flex flex-col space-y-2 mb-6'>
                                                <label
                                                    htmlFor='type'
                                                    className='text-sm font-semibold'>
                                                    Type
                                                </label>
                                                <Field
                                                    // onValueChange={(value) => setFieldValue("category", value)}
                                                    // value={values.category}
                                                    defaultValue='virtual_good'
                                                    name='type'
                                                >
                                                    {({ field, form }: FieldProps) => (
                                                        <AutocompleteSelect
                                                            name={field.name}
                                                            onChange={(value) => form.setFieldValue("type", value)}
                                                            defaultValue={field.value}
                                                            options={[
                                                                { value: 'virtual_good', label: 'Virtual Goods' },
                                                                { value: 'voucher', label: 'Voucher' },

                                                            ]}
                                                            placeholder="Set item type"
                                                            renderOption={(option) => (
                                                                <div className="flex items-center">
                                                                    <span className="mr-2">{option.label}</span>
                                                                </div>
                                                            )}
                                                        />
                                                    )}
                                                </Field>
                                                <p className="text-xs text-zinc-500">
                                                    Determines the type of listing that will be created
                                                </p>
                                                <ErrorMessage
                                                    name='type'
                                                    component='div'
                                                    className='text-red-500 text-sm'
                                                />
                                            </div>


                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className='flex flex-col space-y-2 mb-6'>
                                                <label
                                                    htmlFor='pointsCost'
                                                    className='text-sm font-semibold'>
                                                    Cost in points
                                                </label>
                                                <Field
                                                    as={Input}
                                                    name='pointsCost'
                                                    type='number'
                                                    className='input-class'
                                                />
                                                <ErrorMessage
                                                    name='pointsCost'
                                                    component='div'
                                                    className='text-red-500 text-sm'
                                                />
                                            </div>
                                            <div className='flex flex-col space-y-2 mb-6'>
                                                <label
                                                    htmlFor='stock'
                                                    className='text-sm font-semibold'>
                                                    Total supply
                                                </label>
                                                <Field
                                                    as={Input}
                                                    name='stock'
                                                    type='number'
                                                    className='input-class'
                                                />
                                                <ErrorMessage
                                                    name='stock'
                                                    component='div'
                                                    className='text-red-500 text-sm'
                                                />
                                            </div>

                                            <div className='flex flex-col space-y-2 mb-6'>
                                                <label
                                                    htmlFor='maxRedemptionsPerUser'
                                                    className='text-sm font-semibold'>
                                                    Max redemptions per user
                                                </label>
                                                <Field
                                                    as={Input}
                                                    name='maxRedemptionsPerUser'
                                                    type='number'
                                                    className='input-class'
                                                />
                                                <ErrorMessage
                                                    name='maxRedemptionsPerUser'
                                                    component='div'
                                                    className='text-red-500 text-sm'
                                                />
                                            </div>
                                        </div>

                                        <div className='flex flex-col space-y-2 mb-6'>
                                            <label
                                                htmlFor='expiresAt'
                                                className='text-sm font-semibold'>
                                                Expires At
                                            </label>
                                            <Field
                                                as={Input}
                                                name='expiresAt'
                                                type='date'
                                                className='input-class'
                                            />
                                            <ErrorMessage
                                                name='expiresAt'
                                                component='div'
                                                className='text-red-500 text-sm'
                                            />
                                        </div>

                                        <div className='flex flex-col space-y-2 mb-6'>
                                            <label
                                                htmlFor='imageUrl'
                                                className='text-sm font-semibold'>
                                                Image URL
                                            </label>
                                            <Field
                                                as={Input}
                                                name='imageUrl'
                                                type='text'
                                                className='input-class'
                                            />
                                            <ErrorMessage
                                                name='imageUrl'
                                                component='div'
                                                className='text-red-500 text-sm'
                                            />
                                        </div>

                                        {
                                            values.type === "voucher" && <>

                                                <div className="mb-6">
                                                    <p className="font-semibold text-zinc-900">
                                                        Voucher details
                                                    </p>

                                                </div>


                                                <VoucherDetails setFieldValue={setFieldValue} />
                                            </>
                                        }

                                    </div>

                                    <div className="px-4 py-2 bg-white border-t border-zinc-400/30 sticky bottom-0 z-10 justify-end flex items-center gap-4">
                                        <button onClick={onClose} className='bg-white pressable-shadow rounded-md font-medium px-4 h-[28px]'>
                                            Cancel
                                        </button>
                                        <button
                                            type='submit'
                                            disabled={isSubmitting}
                                            className='bg-indigo-600 text-white rounded-md font-medium px-4 h-[28px]'>
                                            {isLoading ? <Spinner /> : "Add"}
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

const VoucherDetails = (props: {
    setFieldValue: (field: string, value: any) => void;
}) => {
    const generateVoucherCode = () => {
        const code = Math.random().toString(36).substring(2, 12).toUpperCase();
        return code
    }

    useEffect(() => {
        return () => {
            props.setFieldValue("voucherDetails", {})
        }
    }, [])
    return (
        <>
            <div className='flex flex-col space-y-2 mb-6'>
                <label
                    htmlFor='voucherDetails.voucherCode'
                    className='text-sm font-semibold'>
                    Voucher Code
                </label>
                <Field
                    as={Input}
                    name='voucherDetails.voucherCode'
                    type='text'
                    className='input-class'
                />
                <div className="mt-2">
                    <button type="button" onClick={() => {
                        const code = generateVoucherCode();
                        props.setFieldValue('voucherDetails.voucherCode', code);
                    }} className="text-blue-600 text-sm font-semibold">Generate code</button>
                </div>
                <ErrorMessage
                    name='voucherDetails.voucherCode'
                    component='div'
                    className='text-red-500 text-sm'
                />
            </div>

            <div className='flex flex-col space-y-2 mb-6'>
                <label
                    htmlFor='voucherDetails.voucherValue'
                    className='text-sm font-semibold'>
                    Voucher value (USD)
                </label>
                <Field
                    as={Input}
                    name='voucherDetails.voucherValue'
                    type='number'
                    className='input-class'
                />
                <ErrorMessage
                    name='voucherDetails.voucherValue'
                    component='div'
                    className='text-red-500 text-sm'
                />
            </div>

            <div className='flex flex-col space-y-2 mb-6'>
                <label
                    htmlFor='voucherDetails.voucherExpiration'
                    className='text-sm font-semibold'>
                    Voucher Expiration
                </label>
                <Field
                    as={Input}
                    name='voucherDetails.voucherExpiration'
                    type='date'
                    className='input-class'
                />
                <ErrorMessage
                    name='voucherDetails.voucherExpiration'
                    component='div'
                    className='text-red-500 text-sm'
                />
            </div></>
    )
}

export default CreateStoreListing