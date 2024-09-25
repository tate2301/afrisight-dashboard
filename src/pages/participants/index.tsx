import { useGetCurrentTabFromQuery } from "@/components/shells";
import PageWithTableShell from "@/components/shells/gig";
import { DataTable } from "@/components/ui/datatable";
import GeneralLayout from "@/layout/GeneralLayout";
import { Button, Checkbox, Flex } from "@radix-ui/themes";
import { ColumnDef } from "@tanstack/react-table";

const tabs = ["All", "Leaderboard", "Active", "Banned"];

type Participant = {
    _id: string;
    fullName: string;
    email: string;
    gigs: any[];
    balance: number;
    points: number;
    status: string;
    createdAt: string;
}

const clientsColumns: ColumnDef<Participant>[] = [
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
        id: "balance",
        accessorKey: "balance",
        header: "Balance"
    },
    {
        id: "points",
        accessorKey: "points",
        header: "Points"
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


export default function Participants() {
    const currentTab = useGetCurrentTabFromQuery(tabs);
    return (
        <GeneralLayout>
            <PageWithTableShell title="Participants" activeTab={currentTab} tabs={tabs} total={0} currentPage={1} pageSize={10} fetchSurveys={() => Promise.resolve()}>
                <DataTable columns={clientsColumns} data={[]} />
            </PageWithTableShell>
        </GeneralLayout>
    )
}