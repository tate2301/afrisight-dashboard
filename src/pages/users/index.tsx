import Box from "@/components/design-sytem/box";
import Button from "@/components/design-sytem/button";
import { ArrowRight } from "@/components/icons/arrow.right";
import { CheckFill } from "@/components/icons/check.fill";
import { LockFill } from "@/components/icons/lock.fill";
import { SlashFill } from "@/components/icons/slash.fill";
import { XFill } from "@/components/icons/x.fill";
import Pill from "@/components/pill";
import { useGetCurrentTabFromQuery } from "@/components/shells";
import PageWithTableShell from "@/components/shells/gig";
import { DataTable } from "@/components/ui/datatable";
import { Dropdown } from "@/components/ui/dropdown";
import axiosInstance from "@/hooks/useApiFetcher";
import GeneralLayout from "@/layout/GeneralLayout";
import { formatDate } from "@/utils/strings";
import { PaginatedResponse } from "@/utils/types";
import { CameraIcon, EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Avatar, Checkbox, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import Link from "next/link";
import { Suspense } from "react";

const tabs = ["All", "Active", "Suspended"];

type Participant = {
  _id: string;
  fullName: string;
  email: string;
  lastLogin: string;
  status: "active" | "suspended";
  createdAt: string;
}

const UserActions = (row: Row<Participant>) => {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button size={"small"} variant={"ghost"}>
          <EllipsisHorizontalIcon className="size-6" />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Container className="w-72 bg-white rounded-xl pressable-shadow p-1">
        <Dropdown.Item className="h-[40px] px-4 flex items-center gap-2 outline-none hover:bg-zinc-100 rounded-lg">
          <SlashFill className="size-5" /> Suspend account
        </Dropdown.Item>
        <Dropdown.Item className="h-[40px] px-4 flex items-center gap-2 outline-none hover:bg-zinc-100 rounded-lg">
          <LockFill className="size-5" /> Reset password
        </Dropdown.Item>
      </Dropdown.Container>
    </Dropdown.Root>
  )
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
    header: "Status",
    cell: ({ row }) => <Pill css={{ paddingLeft: 4 }} colorScheme={row.original.status.toLowerCase() === "active" ? "surface" : "danger"}>
      {row.original.status.toLowerCase() === "active" ? <CheckFill className="size-5" /> : <XFill className="size-5" />}
      {row.original.status.toLowerCase() === "active" ? "Active" : "Suspended"}
    </Pill>
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created At"
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <UserActions {...row} />
    )
  }
];

const AddUser = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>
          Add Administrator
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>
          Add Administrator
        </Dialog.Title>
        <Dialog.Description size="2" mb="8">
          Add a new administrator to the platform.
        </Dialog.Description>

        <Flex justify={"center"} gap={"4"} mb={"6"}>
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
          <Flex gap={"4"}>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                First Name
              </Text>
              <TextField.Root
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Surname
              </Text>
              <TextField.Root
              />
            </label>
          </Flex>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Email
            </Text>
            <TextField.Root
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Password
            </Text>
            <TextField.Root
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

export default function Users() {
  const currentTab = useGetCurrentTabFromQuery(tabs);

  const getUsers = async (page = 0) => {
    const res = await axiosInstance.get<PaginatedResponse<Participant>>(`/auth/users/admin?page=${page}&select=${currentTab}`)
    if (!res.docs) throw new Error("No users found")
    const users = res.docs.map((profile: any) => ({
      _id: profile.user._id,
      fullName: profile.firstName ? `${profile.firstName} ${profile.lastName}` : "Admin User",
      email: profile.user.email,
      status: profile.user.status,
      lastLogin: formatDate(profile.user.lastLogin),
      createdAt: formatDate(profile.user.createdAt)
    }))
    return {
      ...res,
      docs: users
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers()
  })


  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>No data</div>

  const PageActions = () => (
    <>
      <AddUser />

    </>
  )

  return (
    <GeneralLayout>
      <PageWithTableShell
        actions={<PageActions />}
        title="Administrators"
        activeTab={currentTab}
        tabs={tabs}
        total={data.totalDocs}
        currentPage={data.page}
        pageSize={data.limit}
        fetchSurveys={() => Promise.resolve()}
      >
        <DataTable columns={clientsColumns} data={data.docs || []} />
      </PageWithTableShell>
    </GeneralLayout>
  )
}