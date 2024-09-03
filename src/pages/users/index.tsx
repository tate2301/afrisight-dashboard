import { FormEvent, useEffect, useState } from "react";
import GeneralLayout from "../../layout/GeneralLayout";
import {
  DevicePhoneMobileIcon,
  PlusCircleIcon,
  Square2StackIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
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
import { USER_ROUTES } from "@/lib/api-routes";
import { cn } from "@/lib/utils";
import {
  Building2,
  CheckIcon,
  LoaderIcon,
  PhoneIcon,
  User2Icon,
} from "lucide-react";
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
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikHelpers,
  useFormik,
} from "formik";
import * as Yup from "yup";
import Search from "@/components/search/Search";
import { useRouter } from "next/router";

type Profile = {
  user: {
    email: string;
    isEmailVerified: boolean;
  };
  isDeleted?: boolean;
  profileType: "ADMIN" | "CLIENT" | "SUPPORT" | "PARTICIPANT";
  createdAt: string;
  _id: string
};

function Users() {
  const [users, setUsers] = useState<Profile[]>([]);
  const router = useRouter()
  const { error, isLoading, executor } = useWithStatus();

  const fetchUsers = async () => {
    try {
      const response = await executor(() =>
        axiosInstance.get(USER_ROUTES.GET_ALL_USERS),
      );
      setUsers(response.data.profiles);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRowClick = (id: string) => {
    router.push(`/users/${id}`);
  };

  return (
    <GeneralLayout>
      <div className='flex flex-row items-start justify-between mb-6'>
        <p className='text-start font-bold text-zinc-900 text-3xl '>
          User profiles
        </p>
        <CreateUser callback={fetchUsers} />
      </div>
      <Search />
      <Table>
        <TableHeader className='text-start text-sm py-2 border-b'>
          <TableRow>
            <TableHead className='w-[48px]' />
            <TableHead>Email address</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Email verified</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='divide-y'>
          {users.map((user) => (
            <TableRow key={user._id} onClick={() => handleRowClick(user.user._id)} className="cursor-pointer">
              <TableCell>
                <p className='p-1.5 rounded-full bg-zinc-100 w-fit'>
                  <User2Icon className='w-5 h-5' />
                </p>
              </TableCell>
              <TableCell>{user.user?.email}</TableCell>
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
                    user.user?.isEmailVerified && "text-green-600",
                  )}>
                  {user.user?.isEmailVerified ? (
                    <CheckIcon className='w-5 h-5' />
                  ) : (
                    <LoaderIcon className='w-5 h-5' />
                  )}
                  {user.user?.isEmailVerified ? "Verified" : "Not verified"}
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

const CreateUser = (props: { callback: () => Promise<void> }) => {
  const { executor, isLoading, error } = useWithStatus();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const onSubmit = async (
    values: {
      email: string;
      password: string;
      role: string;
    },
    helpers: FormikHelpers<{
      email: string;
      password: string;
      role: string;
    }>,
  ) => {
    await executor(() => axios.post(`${apiUrl}/auth/register/email`, values));

    props
      .callback()
      .then(() => helpers.setSubmitting(false))
      .then(onClose);
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
    role: Yup.string().required("Required"),
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
          <PlusCircleIcon
            height={24}
            width={24}
          />
          <p>Create User</p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new user</DialogTitle>
          <DialogDescription>
            Fill in the form below to create a new user.
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={{ email: "", password: "", role: "" }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className='flex flex-col space-y-2 mb-6'>
                <label
                  htmlFor='email'
                  className='text-sm font-semibold'>
                  Email address
                </label>
                <Field
                  as={Input}
                  name='email'
                  type='email'
                  className='input-class'
                />
                <ErrorMessage
                  name='email'
                  component='div'
                  className='text-red-500 text-sm'
                />
              </div>

              <div className='flex flex-col space-y-2 mb-6'>
                <label
                  htmlFor='password'
                  className='text-sm font-semibold'>
                  Password
                </label>
                <Field
                  as={Input}
                  name='password'
                  type='password'
                  className='input-class'
                />
                <ErrorMessage
                  name='password'
                  component='div'
                  className='text-red-500 text-sm'
                />
              </div>

              <div className='flex flex-col space-y-2 mb-6'>
                <label
                  htmlFor='role'
                  className='text-sm font-semibold'>
                  Platform
                </label>
                <div className='gap-4 inline-flex text-zinc-900'>
                  <Field
                    type='radio'
                    name='role'
                    value='PARTICIPANT'
                  />
                  Mobile platform
                </div>
                <div className='gap-4 inline-flex text-zinc-900'>
                  <Field
                    type='radio'
                    name='role'
                    value='CLIENT'
                  />
                  Forms builder
                </div>
                <div className='gap-4 inline-flex text-zinc-900'>
                  <Field
                    type='radio'
                    name='role'
                    value='ADMIN'
                  />
                  Admin dashboard
                </div>
                <ErrorMessage
                  name='role'
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

export default Users;
