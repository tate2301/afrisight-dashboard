import { useGetCurrentTabFromQuery } from "@/components/shells";
import PageWithTableShell from "@/components/shells/gig";
import { DataTable } from "@/components/ui/datatable";
import GeneralLayout from "@/layout/GeneralLayout";
import { Button, Checkbox, Flex } from "@radix-ui/themes";
import { ColumnDef } from "@tanstack/react-table";

const tabs = ["All", "Active", "Disabled"];

type Participant = {
  _id: string;
  fullName: string;
  email: string;
  lastLogin: string;
  status: "active" | "disabled";
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
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
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
    id: "lastLogin",
    accessorKey: "lastLogin",
    header: "Last Login"
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status"
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created At"
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Flex gap="2">
        <Button variant="soft">View</Button>
        <Button variant="soft" color={row.original.status === "active" ? "red" : "green"}>
          {row.original.status === "active" ? "Disable" : "Enable"}
        </Button>
      </Flex>
    )
  }
];




export default function Users() {
  const currentTab = useGetCurrentTabFromQuery(tabs);
  return (
    <GeneralLayout>
      <PageWithTableShell title="Administrators" activeTab={currentTab} tabs={tabs} total={0} currentPage={1} pageSize={10} fetchSurveys={() => Promise.resolve()}>
        <DataTable columns={clientsColumns} data={[]} />
      </PageWithTableShell>
    </GeneralLayout>
  )
}