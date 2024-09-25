import { useGetCurrentTabFromQuery } from "@/components/shells";
import PageWithTableShell from "@/components/shells/gig";
import { DataTable } from "@/components/ui/datatable";
import GeneralLayout from "@/layout/GeneralLayout";
import { Button, Checkbox, Flex } from "@radix-ui/themes";
import { ColumnDef } from "@tanstack/react-table";

const tabs = ["All", "Connected", "Archived"];

type RewardPolicy = {
    _id: string;
    name: string;
    numberOfRedemptions: number;
    amount: number;
    extraRewardType: string;
    createdAt: string;
}

const clientsColumns: ColumnDef<RewardPolicy>[] = [
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
        id: "name",
        accessorKey: "name",
        header: "Name"
    },
    {
        id: "numberOfRedemptions",
        accessorKey: "numberOfRedemptions",
        header: "Number of redemptions"
    },
    {
        id: "extraRewardType",
        accessorKey: "extraRewardType",
        header: "Extra reward type"
    },
    {
        id: "amount",
        accessorKey: "amount",
        header: "Amount"
    },
    {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Created at"
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


export default function Rewards() {
    const currentTab = useGetCurrentTabFromQuery(tabs);
    return (
        <GeneralLayout>
            <PageWithTableShell title="Reward policies" activeTab={currentTab} tabs={tabs} total={0} currentPage={1} pageSize={10} fetchSurveys={() => Promise.resolve()}>
                <DataTable columns={clientsColumns} data={[]} />
            </PageWithTableShell>
        </GeneralLayout>
    )
}