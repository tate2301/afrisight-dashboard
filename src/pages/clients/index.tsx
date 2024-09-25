import AlertMessage from "@/components/alerts/AlertMessage";
import Box from "@/components/design-sytem/box";
import Button from "@/components/design-sytem/button";
import { Caption, Paragraph } from "@/components/design-sytem/typography";
import { CheckFill } from "@/components/icons/check.fill";
import { EnvelopeBadge } from "@/components/icons/envelope.badge";
import Pill from "@/components/pill";
import { useGetCurrentTabFromQuery } from "@/components/shells";
import PageWithTableShell from "@/components/shells/gig";
import Spinner from "@/components/spinner/Spinner";
import { DataTable } from "@/components/ui/datatable";
import axiosInstance from "@/hooks/useApiFetcher";
import GeneralLayout from "@/layout/GeneralLayout";
import { formatDate } from "@/utils/strings";
import { CameraIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Checkbox, Flex, Text, TextField, Dialog, Avatar } from "@radix-ui/themes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Field, Form, Formik } from "formik";
import { MoreHorizontalIcon } from "lucide-react";
import { useRef } from "react";

const tabs = ["All", "With ongoing Gigs", ""];

type Client = {
    _id: string;
    fullName: string;
    gigs: any[]
    email: string
    createdAt: string
    profilePic: string
    isEmailVerified: boolean
}

const clientsColumns: ColumnDef<Client>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        )
    },
    {
        id: "client",
        accessorKey: "profilePic",
        header: "Client",
        size: 40,
        cell: ({ row }) => {
            return (
                <Flex align={"center"} gap={"4"}>
                    <Avatar size={"4"} radius="full" fallback={row.original.email.substring(0, 1)} src={row.original.profilePic} alt={"client profile"} />
                    <Box>
                        <Paragraph color={"primary"} weight={"semibold"}>
                            {row.original.fullName}
                        </Paragraph>
                        <Paragraph color={"secondary"}>
                            {row.original.email}
                        </Paragraph>
                    </Box>
                </Flex>
            )
        }
    },

    {
        id: "isEmailVerified",
        accessorKey: "isEmailVerified",
        header: "Email Verified",
        cell: ({ row, column }) => (
            <Pill colorScheme={row.original.isEmailVerified ? "primary" : "surface"}>
                {row.original.isEmailVerified ? <>
                    <CheckFill className="size-5" />
                    Verified
                </> : <>
                    <EnvelopeBadge className="size-5" />
                    Verification email sent
                </>}
            </Pill>
        )
    },
    {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Joined"
    },
    {
        id: "gigs",
        accessorKey: "gigs",
        header: "Gigs"
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => (
            <Flex>
                <Button variant="ghost" colorScheme={"surface"} size={"icon"}>
                    <MoreHorizontalIcon className="size-5" />
                </Button>
            </Flex>
        )
    }

]

const AddClient = () => {
    const closeDialogRef = useRef<HTMLButtonElement>(null);
    const queryClient = useQueryClient();

    const addClientMutation = useMutation({
        mutationFn: async (values: any) => {
            const formData = new FormData();
            formData.append("profilePic", values.profilePic);
            formData.append("email", values.email);
            formData.append("name", values.legalName);
            return axiosInstance.post("/admin/client", formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
            closeDialogRef.current?.click(); // Close the dialog
        },
    });

    const handleSubmit = (values: any) => {
        addClientMutation.mutate(values);
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Button>Add Client</Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
                <Dialog.Title>Add Client</Dialog.Title>
                <Dialog.Description size="2" mb="6">
                    Add a new client to the platform.
                </Dialog.Description>

                <Formik initialValues={{
                    profilePic: null,
                    email: "",
                    legalName: ""
                }} onSubmit={handleSubmit}>
                    {({ values, handleChange, handleBlur, setFieldValue }) => (
                        <Form>
                            <Flex justify={"center"} gap={"4"} >
                                <label htmlFor="avatar-upload" className="cursor-pointer relative">
                                    <input
                                        id="avatar-upload"
                                        name="profilePic"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setFieldValue("profilePic", file);
                                            }
                                        }}
                                    />
                                    <Avatar
                                        size="8"
                                        src={values.profilePic ? URL.createObjectURL(values.profilePic) : "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"}
                                        fallback="A"
                                        className="hover:opacity-80 transition-opacity"
                                    />
                                    <Box css={{ backgroundColor: "$gray8" }} className="absolute -bottom-2 border-4 border-white -right-4 text-white text-xs rounded-full w-10 h-10 flex items-center justify-center">
                                        <CameraIcon className="w-4 h-4" />
                                    </Box>
                                </label>
                            </Flex>

                            <Flex direction="column" gap="3">
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        Email
                                    </Text>
                                    <TextField.Root
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </label>
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        Legal Name
                                    </Text>
                                    <TextField.Root
                                        name="legalName"
                                        value={values.legalName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </label>
                            </Flex>
                            <Box className="my-2">
                                {addClientMutation.isError && <Caption css={{ color: "$danger" }}>We encountered a problem: {addClientMutation.error.message}. Try again.</Caption>}
                            </Box>
                            <Flex gap="3" mt="4" justify="end">
                                <Dialog.Close ref={closeDialogRef}>
                                    <Button variant="ghost" disabled={addClientMutation.isPending} colorScheme={"surface"} css={{ color: addClientMutation.isPending ? "$gray3" : "$labelPrimary" }}>
                                        Cancel
                                    </Button>
                                </Dialog.Close>
                                <Button className="w-[72px]" disabled={addClientMutation.isPending} type="submit" colorScheme={addClientMutation.isPending ? "surface" : "primary"}>
                                    {addClientMutation.isPending ? <Spinner /> : "Save"}
                                </Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </Dialog.Content>
        </Dialog.Root>

    )
}

export default function Clients() {
    const currentTab = useGetCurrentTabFromQuery(tabs);
    const { data, isLoading, isError } = useQuery({
        queryKey: ["clients"], queryFn: async () => {
            const res = await axiosInstance.get("/admin/client");
            const data = res.data;
            data.docs = data.docs.map((doc: any) => ({
                _id: doc._id,
                fullName: `${doc.firstname} ${doc.lastName ?? ""}`,
                email: doc.user.email,
                createdAt: formatDate(doc.createdAt),
                gigs: doc.gigs,
                profilePic: doc.profilePic,
                isEmailVerified: doc.user.isEmailVerified,
                lastLogin: doc.user.lastLogin
            }))
            return res.data;
        }
    });

    return (
        <GeneralLayout>
            <PageWithTableShell actions={<AddClient />} title="Clients" activeTab={currentTab} tabs={tabs} total={data?.totalDocs} currentPage={data?.currentPage} pageSize={20} fetchSurveys={() => Promise.resolve()}>
                {data && <DataTable columns={clientsColumns} data={data?.docs} />}
            </PageWithTableShell>
        </GeneralLayout>
    )
}