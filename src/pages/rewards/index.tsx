import Box from "@/components/design-sytem/box";
import { useGetCurrentTabFromQuery } from "@/components/shells";
import PageWithTableShell from "@/components/shells/gig";
import { DataTable } from "@/components/ui/datatable";
import { CameraIcon, PlusIcon } from "@heroicons/react/24/outline";
import GeneralLayout from "@/layout/GeneralLayout";
import { Avatar, Card, Checkbox, Dialog, Flex, Switch, Text, TextArea, TextField } from "@radix-ui/themes";
import { ColumnDef } from "@tanstack/react-table";
import useDisclosure from "@/hooks/useDisclosure";
import CreateVoucher from "@/components/modals/create-voucher";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import axiosInstance from "@/hooks/useApiFetcher";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "@/components/design-sytem/button";
import { Form, Formik } from "formik";
import { formatDate } from "@/utils/strings";
import { Caption } from "@/components/design-sytem/typography";
import { Combobox, ComboboxItem } from "@/components/ui/combobox";
import { HrefIcon } from "@/components/icons/href.icon";
import { EyeFill } from "@/components/icons/eye.fill";
import { ArrowRight } from "@/components/icons/arrow.right";
import AddRewardPolicy from "@/components/modals/create-reward-policy";

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
        id: "points",
        accessorKey: "pointsValue",
        header: "Points"
    },

    {
        id: "dollarValue",
        accessorKey: "dollarValue",
        header: "Amount"
    },
    {
        id: "hasVoucher",
        accessorKey: "voucher",
        header: "Voucher"
    },
    {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Created at"
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => null
    }

]




export default function Rewards() {
    const currentTab = useGetCurrentTabFromQuery(tabs);
    const { data, isLoading, isError, refetch, } = useQuery({
        queryKey: ['reward-policies'],
        queryFn: async () => {
            const res = await axiosInstance.get("/gamification/reward-policy")
            // Transform the response data to match the columns
            return res.map((item: any) => ({
                id: item._id,
                name: item.name,
                description: item.description,
                dollarValue: item.dollarValue,
                pointsValue: item.pointsValue,
                voucher: !!item.voucher,
                createdAt: new Date(item.createdAt).toLocaleDateString(),
                updatedAt: new Date(item.updatedAt).toLocaleDateString(),
            }));
        }
    })

    return (
        <GeneralLayout>
            <PageWithTableShell actions={<AddRewardPolicy />} title="Reward policies" activeTab={currentTab} tabs={tabs} total={0} currentPage={1} pageSize={10} fetchSurveys={() => Promise.resolve()}>
                {data && <DataTable columns={clientsColumns} data={data} />}
            </PageWithTableShell>
        </GeneralLayout>
    )
}