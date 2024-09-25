import Box from "@/components/design-sytem/box";
import { useGetCurrentTabFromQuery } from "@/components/shells";
import PageWithTableShell from "@/components/shells/gig";
import { DataTable } from "@/components/ui/datatable";
import { CameraIcon, PlusIcon } from "@heroicons/react/24/outline";
import GeneralLayout from "@/layout/GeneralLayout";
import { Avatar, Card, Checkbox, Dialog, Flex, Switch, Text, TextArea, TextField } from "@radix-ui/themes";
import { ColumnDef } from "@tanstack/react-table";
import useDisclosure from "@/hooks/useDisclosure";
import CreateVoucher from "@/components/forms/voucher";
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
        cell: ({ row }) => (
            <Flex>
                <Button variant={"ghost"} colorScheme={"surface"}>
                    <HrefIcon className="size-5 mr-2" />
                    Link to gig</Button>
                <Button variant={"ghost"} colorScheme={"surface"}>
                    View
                    <ArrowRight className="size-4 ml-2" />
                </Button>
            </Flex>
        )
    }

]

type VoucherItem = {
    _id: string;
    name: string;
    expiresAt: string;
}



const AddRewardPolicy = () => {
    const { isOpen: isVoucherFormOpen, onOpen: openVoucherForm, onClose: closeVoucherForm } = useDisclosure()
    const { data, isLoading, isError, refetch, } = useQuery({
        queryKey: ['vouchers'],
        queryFn: async () => {
            const res = await axiosInstance.get("/gamification/voucher")
            return res.data.vouchers
        }
    })

    const vouchers = data?.map((voucher: any) => ({
        value: voucher._id,
        label: voucher.name,
        data: voucher
    }))

    const queryClient = useQueryClient();
    const createRewardPolicyMutation = useMutation({
        mutationFn: async (values: any) => {
            return axiosInstance.post("/gamification/reward-policy/create", {
                name: values.name,
                description: values.company,
                amount: values.amount,
                voucher: values.voucher,
                extraRewardType: values.extraRewardType,
                dollarValue: values.amount,
                pointsValue: values.points
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reward-policies'] });
        },
        onError: (error) => {
            console.error('Error creating reward policy:', error);
        }
    });

    const handleSubmit = async (values: any) => {
        createRewardPolicyMutation.mutate(values);
    };

    const createVoucherCallback = () => {

    }

    const renderVoucherItem = (item: ComboboxItem<VoucherItem>, isSelected: boolean, handleSelect: (value: string) => void) => {
        return (
            <CommandItem
                onSelect={handleSelect}
                key={item.value}
                value={item.value}
                className="flex"
            >
                <Check
                    className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                    )}
                />
                <Flex justify={"between"} className="flex-1">
                    <Text className="truncate">{item.label}</Text>
                    <Caption>
                        {formatDate(item.data.expiresAt)}
                    </Caption>
                </Flex>
            </CommandItem>
        )
    }

    return (
        <Dialog.Root >
            <Dialog.Trigger>
                <Button className="w-full">
                    Add reward policy
                </Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
                <Dialog.Title>Add reward policy</Dialog.Title>
                <Dialog.Description size="2" mb="6">
                    Add a new reward policy to the platform.
                </Dialog.Description>

                <Formik initialValues={{
                    name: "",
                    company: "",
                    amount: 0,
                    points: 0,
                    voucher: ""
                }} onSubmit={handleSubmit}>
                    {({ values, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                        <Form>
                            <Flex direction="column" gap="3">
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        Name
                                    </Text>
                                    <TextField.Root
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </label>
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        Company
                                    </Text>
                                    <TextField.Root
                                        name="company"
                                        value={values.company}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </label>
                                <Flex gap="4">
                                    <label>
                                        <Text as="div" size="2" mb="1" weight="bold">
                                            Amount (USD)
                                        </Text>
                                        <TextField.Root
                                            name="amount"
                                            value={values.amount}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </label>
                                    <label>
                                        <Text as="div" size="2" mb="1" weight="bold">
                                            Points (XP)
                                        </Text>
                                        <TextField.Root
                                            name="points"
                                            value={values.points}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </label>
                                </Flex>
                                <Box>
                                    <label>
                                        <Text as="div" size="2" mb="1" weight="bold">
                                            Voucher
                                        </Text>
                                        <Combobox<VoucherItem>
                                            onChange={(value) => handleChange({ target: { name: "voucher", value } })}
                                            items={vouchers}
                                            renderItem={renderVoucherItem}
                                            placeholder="Select a voucher"
                                            emptyMessage="No vouchers found"
                                            footerAction={<Button variant="outline" colorScheme={"surface"} onClick={openVoucherForm} className="w-full"><PlusIcon className="size-5" /> Add voucher</Button>}
                                        />
                                    </label>
                                </Box>
                                {isVoucherFormOpen && <Card variant="ghost" className="bg-zinc-100" mb={"4"}>
                                    <CreateVoucher callback={(voucher_id: string) => {
                                        closeVoucherForm()
                                        setFieldValue("voucher", voucher_id)
                                    }} />
                                </Card>}
                            </Flex>

                            <Flex gap="3" mt="4" justify="end">
                                <Dialog.Close>
                                    <Button variant="ghost">
                                        Cancel
                                    </Button>
                                </Dialog.Close>
                                <Button type="submit">Save</Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </Dialog.Content>
        </Dialog.Root>

    )
}


export default function Rewards() {
    const currentTab = useGetCurrentTabFromQuery(tabs);
    const { data, isLoading, isError, refetch, } = useQuery({
        queryKey: ['reward-policies'],
        queryFn: async () => {
            const res = await axiosInstance.get("/gamification/reward-policy")
            // Transform the response data to match the columns
            res.data = res.data.map((item: any) => ({
                id: item._id,
                name: item.name,
                description: item.description,
                dollarValue: item.dollarValue,
                pointsValue: item.pointsValue,
                voucher: item.voucher,
                createdAt: new Date(item.createdAt).toLocaleDateString(),
                updatedAt: new Date(item.updatedAt).toLocaleDateString(),
            }));
            return res.data;
        }
    })

    console.log(data)
    return (
        <GeneralLayout>
            <PageWithTableShell actions={<AddRewardPolicy />} title="Reward policies" activeTab={currentTab} tabs={tabs} total={0} currentPage={1} pageSize={10} fetchSurveys={() => Promise.resolve()}>
                {data && <DataTable columns={clientsColumns} data={data} />}
            </PageWithTableShell>
        </GeneralLayout>
    )
}