import { PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import GeneralLayout from "../../layout/GeneralLayout";
import { H1, H3, Paragraph } from "@/components/design-sytem/typography";
import Separator from "@/components/design-sytem/separator";
import Flex from "@/components/design-sytem/flex";
import Box from "@/components/design-sytem/box";
import GigCard from "@/components/gig/card";
import { ArrowRight } from "@/components/icons/arrow.right";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/datatable";
import { Button, Heading } from "@radix-ui/themes";

const gigs = [
  {
    id: 1,
    title: "Gig title",
    createdDate: "2024-02-01",
    status: "pending",
    questions: 4,
    responses: 0,
    views: 0,
  },
  {
    id: 2,
    title: "Gig title",
    createdDate: "2024-02-01",
    status: "pending",
    questions: 4,
    responses: 0,
    views: 0,
  },
  {
    id: 3,
    title: "Gig title",
    createdDate: "2024-02-01",
    status: "approved",
    questions: 4,
    responses: 0,
    views: 0,
  },
  {
    id: 4,
    title: "Gig title",
    createdDate: "2024-02-01",
    status: "archived",
    questions: 4,
    responses: 0,
    views: 0,
  }
]

const Overview = () => {


  return (
    <GeneralLayout>
      <div className="w-full mx-auto py-4 space-y-8 ">
        <H1 className="px-4">Dashboard</H1>
        <div className="flex gap-8 px-4">
          <QuickActionCard
            title="Create a gig"
            button={<Button> <PlusIcon height={20} width={20} /> Create gig</Button>}
          />
          <QuickActionCard
            title="Add a client"
            button={<Button> <PlusIcon height={20} width={20} /> Add client</Button>}
          />
          <QuickActionCard
            title="Add a reward policy"
            button={<Button> <PlusIcon height={20} width={20} /> Add reward policy</Button>}
          />
          <QuickActionCard
            title="Add a store item"
            button={<Button> <PlusIcon height={20} width={20} /> Add store item</Button>}
          />
          <QuickActionCard
            title="Add an admin user"
            button={<Button> <PlusIcon height={20} width={20} /> Add admin user</Button>}
          />
        </div>
        <Separator />
        <Box>
          <Box>
            <Flex css={{ padding: "4px 12px", }} justifyContent={"between"} alignItems={"center"}>
              <Heading size="4">
                Pending gigs
              </Heading>
              <Flex alignItems={"center"} css={{ gap: 8 }}>
                <Button variant="ghost">Approve 2 gigs</Button>
                <Button>Archive 2 gigs</Button>
              </Flex>
            </Flex>
            <Box css={{ padding: "20px 0", }} className="py-2 space-y-[20px]">
              {
                gigs.map((gig) => (
                  <GigCard key={gig.id} createdDate={gig.createdDate} status={gig.status as unknown as any} title={gig.title} questions={gig.questions} responses={gig.responses} views={gig.views} />
                ))
              }
            </Box>
          </Box>
        </Box>
        <Box>
          <Flex justifyContent={"between"} alignItems={"end"} css={{ padding: "0 20px", marginBottom: 20 }}>
            <H3 className="mb-2 px-4">Pending payout requests</H3>
            <Button>
              View all payout requests <ArrowRight />
            </Button>
          </Flex>

          <Box>
            <DataTable columns={payoutRequestColumns} data={payoutRequests} />
          </Box>
        </Box>
      </div>
    </GeneralLayout>
  );
};

type QuickActionCardProps = {
  title: string;
  caption?: string;
  button: React.ReactNode;
}

const QuickActionCard = ({ title, caption, button }: QuickActionCardProps) => {
  return (
    <div className="bg-white rounded-xl p-4 bg-zinc-100 rounded-2xl w-64">
      <Paragraph as="h3" weight={"semibold"} className="mb-4">{title}</Paragraph>
      {button}
    </div>
  );
};

type PayoutRequests = {
  id: number;
  user: {
    fullName: string;
    email: string;
    profilePic: string;
    accountStatus: "active" | "inactive" | "suspended";
  }
  amount: number;
  balance: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const payoutRequests: PayoutRequests[] = [
  {
    id: 1,
    user: {
      fullName: "John Doe",
      email: "john.doe@example.com",
      profilePic: "https://via.placeholder.com/150",
      accountStatus: "active"
    },
    amount: 100,
    balance: 100,
    status: "pending",
    createdAt: "2024-02-01"
  },
  {
    id: 2,
    user: {
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      profilePic: "https://via.placeholder.com/150",
      accountStatus: "inactive"
    },
    amount: 200,
    balance: 200,
    status: "approved",
    createdAt: "2024-02-02"
  }
]

const payoutRequestColumns: ColumnDef<PayoutRequests>[] = [
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
    enableHiding: false,
  },
  {
    accessorKey: "user.profilePic",
    header: "Avatar",
    cell: ({ row }) => (
      <div className="flex items-center ">
        <img
          src={row.original.user.profilePic}
          alt={`${row.original.user.fullName}'s avatar`}
          className="h-10 w-10 rounded-full bg-zinc-100"
        />
      </div>
    ),
    size: 48
  },
  {
    accessorKey: "user.fullName",
    header: "Full Name"
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <Paragraph weight={"medium"}>US${row.original.amount}</Paragraph>
    )
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => (
      <Paragraph weight={"medium"}>US${row.original.balance}</Paragraph>
    )
  },
  {
    accessorKey: "user.accountStatus",
    header: "Account Status"
  },
  {
    accessorKey: "status",
    header: "Status"
  },
  {
    accessorKey: "createdAt",
    header: "Created At"
  }
]


export default Overview;
