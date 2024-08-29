import { useEffect, useState } from "react";
import GeneralLayout from "../../layout/GeneralLayout";
import { DevicePhoneMobileIcon, PlusCircleIcon, Square3Stack3DIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { apiUrl } from "../../utils/apiUrl";
import useWithStatus from "../../hooks/useWithStatus";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import axiosInstance from "@/hooks/useApiFetcher";
import { SURVEY_ROUTES, USER_ROUTES } from "@/lib/api-routes";
import { cn } from "@/lib/utils";
import { Building2, CheckIcon, LoaderIcon } from "lucide-react";
import useDisclosure from "@/hooks/useDisclosure";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { TSurvey } from "@/utils/types";


function Vouchers() {
    const [vouchers, setVouchers] = useState<TSurvey[]>([]);
    const { error, isLoading, executor } = useWithStatus();

    const fetchVouchers = async () => {
        try {
            const response = await executor(() =>
                axiosInstance.get(SURVEY_ROUTES.GET_SURVEYS),
            );
            setVouchers(response.data.profiles);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    return (
        <GeneralLayout>
            <div className='flex flex-row items-start justify-between mb-6'>
                <p className='text-start font-bold text-zinc-900 text-3xl '>
                    Vouchers
                </p>
                <CreateVoucher callback={fetchVouchers} />
            </div>
            <Table>
                <TableHeader className='text-start text-sm py-2 border-b'>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Default reward (USD)</TableHead>
                        <TableHead>Additional reward type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className='divide-y'>
                    {vouchers.map((user) => (
                        <TableRow>
                            <TableCell>{user.user.email}</TableCell>
                            <TableCell className='capitalize'>
                                <p className='inline-flex items-center gap-2'>
                                    {user.profileType === "ADMIN" && (
                                        <>
                                            <Building2 className='w-5 h-5' />
                                            Admin Dashboard
                                        </>
                                    )}
                                    {user.profileType === "PARTICIPANT" && (
                                        <>
                                            <DevicePhoneMobileIcon className='w-5 h-5' />
                                            Mobile Platform
                                        </>
                                    )}
                                    {user.profileType === "CLIENT" && (
                                        <>
                                            <Square3Stack3DIcon className='w-5 h-5' />
                                            Form Builder
                                        </>
                                    )}
                                    {user.profileType === "SUPPORT" && "Support"}
                                </p>
                            </TableCell>

                            <TableCell>
                                <p
                                    className={cn(
                                        "gap-2 items-center inline-flex",
                                        user.user.isEmailVerified && "text-green-600",
                                    )}>
                                    {user.user.isEmailVerified ? (
                                        <CheckIcon className='w-5 h-5' />
                                    ) : (
                                        <LoaderIcon className='w-5 h-5' />
                                    )}
                                    {user.user.isEmailVerified ? "Verified" : "Not verified"}
                                </p>
                            </TableCell>
                            <TableCell>
                                <span
                                    className={cn(
                                        "h-[20px] w-fit rounded-full px-2 font-semibold text-sm flex items-center",
                                        user.isDeleted && "bg-red-600 text-white",
                                        !user.isDeleted && "bg-green-100 text-green-700",
                                    )}>
                                    {user.isDeleted ? "Inactive" : "Active"}
                                </span>
                            </TableCell>
                            <TableCell>
                                {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </GeneralLayout>
    );
}

type VoucherFormSchema = {
    code: string;
    expiresAt: Date;
    maxRedemptions: number;
}

const CreateVoucher = (props: { callback: () => Promise<void> }) => {
    const { executor, isLoading, error } = useWithStatus();
    const { isOpen, onClose, onOpen } = useDisclosure();

    const onSubmit = async (
        values: VoucherFormSchema,
        helpers: FormikHelpers<VoucherFormSchema>,
    ) => {
        await executor(() => axios.post(`${apiUrl}/auth/register/email`, values));

        props
            .callback()
            .then(() => helpers.setSubmitting(false))
            .then(onClose);
    };

    const validationSchema = Yup.object({
        code: Yup.string().required("Required"),
        expiresAt: Yup.date().required("Required"),
        maxRedemptions: Yup.number().required("Required"),
    });

    const generateVoucherCode = () => {
        const code = Math.random().toString(36).substring(2, 12).toUpperCase();
        return code
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (open) onOpen();
                if (!open) onClose();
            }}>
            <DialogTrigger asChild>
                <button className='bg-blue-600 text-white rounded-md shadow-sm flex flex-row items-center space-x-2 font-medium px-4 pl-2 h-[40px]'>
                    <PlusCircleIcon
                        height={24}
                        width={24}
                    />
                    <p>Create voucher</p>
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new voucher</DialogTitle>
                    <DialogDescription>
                        Vouchers are used to redeem rewards on the platform.
                    </DialogDescription>
                </DialogHeader>
                <Formik
                    initialValues={{
                        code: generateVoucherCode(),
                        expiresAt: new Date(),
                        maxRedemptions: 35,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}>
                    {({ isSubmitting, setFieldValue }) => (
                        <Form>
                            <div className='flex flex-col space-y-2 mb-6'>
                                <label
                                    htmlFor='code'
                                    className='text-sm font-semibold'>
                                    Voucher code
                                </label>
                                <Field
                                    as={Input}
                                    name='code'
                                    type='code'
                                    className='input-class'
                                />
                                <div className="mt-2">
                                    <button type="button" onClick={() => {
                                        const code = generateVoucherCode();
                                        setFieldValue('code', code);
                                    }} className="text-blue-600 text-sm font-semibold">Generate code</button>
                                </div>
                                <ErrorMessage
                                    name='code'
                                    component='div'
                                    className='text-red-500 text-sm'
                                />
                            </div>

                            <div className='flex flex-col space-y-2 mb-6'>
                                <label
                                    htmlFor='maxRedemptions'
                                    className='text-sm font-semibold'>
                                    Maximum redemptions
                                </label>
                                <Field
                                    as={Input}
                                    name='maxRedemptions'
                                    type='number'
                                    className='input-class'
                                />
                                <p className="text-xs text-gray-500">
                                    Set to 0 for unlimited redemptions
                                </p>
                                <ErrorMessage
                                    name='maxRedemptions'
                                    component='div'
                                    className='text-red-500 text-sm'
                                />
                            </div>

                            <div className='flex flex-col space-y-2 mb-6'>
                                <label
                                    htmlFor='expiresAt'
                                    className='text-sm font-semibold'>
                                    Expires at
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

                            <button
                                type='submit'
                                disabled={isSubmitting}
                                className='h-[40px] min-w-24 rounded-md px-6 font-semibold text-white bg-blue-600'>
                                {isSubmitting ? <Spinner /> : "Submit"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default Vouchers;
