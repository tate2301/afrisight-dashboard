import { ErrorMessage, Field, Form, Formik } from "formik";
import { Input } from "../ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/hooks/useApiFetcher";
import { useEffect, useState } from "react";
import { Dialog, Flex, TextField } from "@radix-ui/themes";
import { Text } from "@radix-ui/themes";
import Box from "../design-sytem/box";
import Button from "../design-sytem/button";



export default function CreateVoucher(props: {
    callback: (voucher_id: string) => void
    onClose?: () => void
}) {
    const [code, setCode] = useState("")
    const queryClient = useQueryClient()
    const { data, isLoading, isError, refetch, } = useQuery({
        queryKey: ['generate-voucher'],
        queryFn: async () => {
            const res = await axiosInstance.get("/gamification/voucher/generate")
            return res.voucher
        }
    })

    useEffect(() => {
        if (data) {
            setCode(data)
        }
    }, [data])

    const onSubmit = async (values: { code: string, name: string, expiresAt: string }) => {
        try {
            const response = await axiosInstance.post("/gamification/voucher/create", {
                code,
                name: values.name,
                expiresAt: values.expiresAt
            })
            const voucher_id = response.voucher._id
            queryClient.invalidateQueries({ queryKey: ['vouchers'] })
            props.callback(voucher_id)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <Dialog.Root open={true}>
            <Dialog.Content>
                <Dialog.Title>
                    Create Voucher
                </Dialog.Title>
                <Dialog.Description>
                    Create a new voucher
                </Dialog.Description>
                <Box css={{ margin: "24px 0" }}>
                    <Formik initialValues={{ code: "", name: "", expiresAt: "" }} onSubmit={onSubmit}>
                        <Form>
                            <div className="mb-6">
                                <label>
                                    <Text as="div" size="2" mb="2" weight="bold">
                                        Voucher name
                                    </Text>
                                    <Field
                                        as={TextField.Root}
                                        name="name"
                                        type="name"
                                        className="input-class"
                                    />
                                </label>
                            </div>
                            <div className="flex flex-col space-y-2 mb-6">
                                <label
                                    htmlFor="code"
                                    className="text-sm font-semibold"
                                >
                                    Voucher code
                                </label>
                                <Field
                                    as={Input}
                                    name="code"
                                    type="code"
                                    className="input-class"
                                    value={code}
                                    disabled
                                />
                                <div className="mt-2">
                                    <button
                                        type="button"
                                        onClick={() => refetch()}
                                        className="text-blue-600 text-sm font-semibold"
                                    >
                                        Generate new code
                                    </button>
                                </div>
                                <ErrorMessage
                                    name="code"
                                    component="div"
                                    className="text-red-500 text-sm"
                                />
                            </div>
                            <label>
                                <Text as="div" size="2" mb="2" weight="bold">
                                    Expiration date
                                </Text>
                                <Field
                                    as={TextField.Root}
                                    name="expiresAt"
                                    type="date"
                                    className="input-class"
                                />
                            </label>

                            <Flex justify={"end"} mt="4" gap={"4"}>
                                <Dialog.Close onClick={(e) => {
                                    if (props.onClose) {
                                        props.onClose()
                                    }
                                    return e;
                                }}>
                                    <Button colorScheme="surface" variant="ghost">
                                        Cancel
                                    </Button>
                                </Dialog.Close>
                                <Dialog.Close>
                                    <Button type="submit">
                                        Create
                                    </Button>
                                </Dialog.Close>
                            </Flex>
                        </Form>
                    </Formik>
                </Box>
            </Dialog.Content>
        </Dialog.Root>
    )
}