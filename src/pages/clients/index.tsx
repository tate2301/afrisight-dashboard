import { useGetCurrentTabFromQuery } from "@/components/shells";
import PageWithTableShell from "@/components/shells/gig";
import { DataTable } from "@/components/ui/datatable";
import GeneralLayout from "@/layout/GeneralLayout";
import { Button, Checkbox, Flex } from "@radix-ui/themes";
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


export default function Clients() {
    const currentTab = useGetCurrentTabFromQuery(tabs);
    return (
        <GeneralLayout>
            <PageWithTableShell title="Clients" activeTab={currentTab} tabs={tabs} total={0} currentPage={1} pageSize={10} fetchSurveys={() => Promise.resolve()}>
                <DataTable columns={clientsColumns} data={[]} />
            </PageWithTableShell>
        </GeneralLayout>
    )
}