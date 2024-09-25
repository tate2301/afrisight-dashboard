import Box from "@/components/design-sytem/box";
import Button from "@/components/design-sytem/button";
import { useGetCurrentTabFromQuery } from "@/components/shells";
import PageWithTableShell from "@/components/shells/gig";
import { DataTable } from "@/components/ui/datatable";
import GeneralLayout from "@/layout/GeneralLayout";
import { CameraIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Checkbox, Flex, Text, TextField, Dialog, Avatar } from "@radix-ui/themes";
import { ColumnDef } from "@tanstack/react-table";

const tabs = ["All", "With ongoing Gigs", ""];

type Client = {
    _id: string;
    fullName: string;
    gigs: any[]
    email: string
    createdAt: string
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
        id: "fullName",
        accessorKey: "fullName",
        header: "Full Name"
    },
    {
        id: "email",
        accessorKey: "email",
        header: "Email"
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
        header: "Actions",
        cell: ({ row }) => (
            <Flex>
                <Button>View</Button>
            </Flex>
        )
    }

]

const AddClient = () => {
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
                                    // Handle file upload logic here
                                    console.log("File selected:", file);
                                    // You might want to update the avatar src with the new file
                                }
                            }}
                        />
                        <Avatar
                            size="8"
                            src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
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
                            defaultValue="johndoe@example.com"
                            placeholder="Enter client's email"
                        />
                    </label>
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Legal Name
                        </Text>
                        <TextField.Root
                            defaultValue="John Doe"
                            placeholder="Enter client's legal name"
                        />
                    </label>
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="ghost">
                            Cancel
                        </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button>Save</Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>

    )
}

export default function Clients() {
    const currentTab = useGetCurrentTabFromQuery(tabs);
    const PageActions = () => (
        <>
            <AddClient />
        </>
    )
    return (
        <GeneralLayout>
            <PageWithTableShell actions={<PageActions />} title="Clients" activeTab={currentTab} tabs={tabs} total={0} currentPage={1} pageSize={10} fetchSurveys={() => Promise.resolve()}>
                <DataTable columns={clientsColumns} data={[]} />
            </PageWithTableShell>
        </GeneralLayout>
    )
}