import Box from "@/components/design-sytem/box";
import { useGetCurrentTabFromQuery } from "@/components/shells";
import PageWithTableShell from "@/components/shells/gig";
import { DataTable } from "@/components/ui/datatable";
import { CameraIcon } from "@heroicons/react/24/outline";
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

interface ComboboxItem {
    value: string;
    label: string;
}

interface ComboboxProps {
    items: ComboboxItem[];
    placeholder: string;
    emptyMessage: string;
    onChange: (value: string) => void;
    footerAction: React.ReactNode;
}

export function Combobox({ items, placeholder, emptyMessage, onChange, footerAction }: ComboboxProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    const handleSelect = (currentValue: string) => {
        setValue(currentValue === value ? "" : currentValue);
        onChange(currentValue === value ? "" : currentValue);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="solid"
                    colorScheme={"surface"}
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between text-left justify-between"
                >
                    <span>
                        {value
                            ? items.find((item) => item.value === value)?.label
                            : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0">
                <Command>
                    <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
                    <CommandList className="p-1">
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={handleSelect}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === item.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        {footerAction}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
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
        label: voucher.name
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
                    {({ values, handleChange, handleBlur, handleSubmit }) => (
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
                                        <Combobox
                                            onChange={(value) => handleChange({ target: { name: "voucher", value } })}
                                            items={vouchers}
                                            placeholder="Select a voucher"
                                            emptyMessage="No vouchers found"
                                            footerAction={<Button variant="solid" colorScheme={"surface"} onClick={openVoucherForm} className="w-full">Add voucher</Button>}
                                        />
                                    </label>
                                </Box>
                                {isVoucherFormOpen && <Card variant="ghost" className="bg-zinc-100" mb={"4"}>
                                    <CreateVoucher callback={() => {
                                        closeVoucherForm()
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
            res.data.docs = res.data.docs.map((item: any) => ({
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