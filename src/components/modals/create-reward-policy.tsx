import axiosInstance from "@/hooks/useApiFetcher";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Combobox, ComboboxItem } from "../ui/combobox";
import { CommandItem } from "../ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Flex, Text, TextField } from "@radix-ui/themes";
import { Caption, Paragraph } from "../design-sytem/typography";
import { formatDate } from "@/utils/strings";
import { Dialog, Card } from "@radix-ui/themes";
import { Form, Formik } from "formik";
import Button from "../design-sytem/button";
import Box from "../design-sytem/box";
import CreateVoucher from "./create-voucher";
import useDisclosure from "@/hooks/useDisclosure";
import { PlusIcon } from "@heroicons/react/24/outline";
import Spinner from "../spinner/Spinner";
import { useRef } from "react";
import { AddModalProp } from "./create-client";
type VoucherItem = {
    _id: string;
    name: string;
    expiresAt: string;
}

const AddRewardPolicy = ({ callback, trigger }: AddModalProp) => {
    const { isOpen: isVoucherFormOpen, onOpen: openVoucherForm, onClose: closeVoucherForm } = useDisclosure()
    const closeRef = useRef<HTMLButtonElement>(null);
    const { data, isLoading, isError, refetch, } = useQuery({
        queryKey: ['vouchers'],
        queryFn: async () => {
            const res = await axiosInstance.get("/gamification/voucher")
            return res.vouchers
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
            })
        },
        onSuccess: (data) => {
            if (callback) {
                callback(data._id)
            }
            queryClient.invalidateQueries({ queryKey: ['reward-policies'] });
            closeRef.current?.click()
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
                    <Paragraph className="truncate">{item.label}</Paragraph>
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
                {trigger ? trigger : <Button className="w-full">
                    Add reward policy
                </Button>}
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
                                        Comment
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
                                            value={values.voucher}
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
                                    <CreateVoucher onClose={closeVoucherForm} callback={(voucher_id: string) => {
                                        closeVoucherForm()
                                        setFieldValue("voucher", voucher_id)
                                    }} />
                                </Card>}
                            </Flex>

                            <Flex gap="3" mt="4" justify="end">
                                <Dialog.Close ref={closeRef}>
                                    <Button variant="ghost">
                                        Cancel
                                    </Button>
                                </Dialog.Close>
                                <Button type="submit" disabled={createRewardPolicyMutation.isPending} colorScheme={createRewardPolicyMutation.isPending ? "surface" : "primary"}>
                                    {createRewardPolicyMutation.isPending ? <Spinner /> : "Save"}
                                </Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </Dialog.Content>
        </Dialog.Root>

    )
}

export default AddRewardPolicy;