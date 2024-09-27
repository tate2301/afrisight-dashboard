import { ErrorMessage, Field, Form, Formik } from "formik";
import { Input } from "../ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/hooks/useApiFetcher";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Avatar, Dialog, Flex, TextField } from "@radix-ui/themes";
import { Text } from "@radix-ui/themes";
import Box from "../design-sytem/box";
import Button from "../design-sytem/button";
import { CameraIcon } from "@heroicons/react/24/outline";
import { Caption } from "../design-sytem/typography";
import Spinner from "../spinner/Spinner";

export type Client = {
    _id: string;
    fullName: string;
    gigs: any[]
    email: string
    createdAt: string
    profilePic: string
    isEmailVerified: boolean
}

export type AddModalProp = {
    callback?: (_id: string) => void
    trigger?: ReactNode
}

const AddClient = ({ callback, trigger }: AddModalProp) => {
    const closeDialogRef = useRef<HTMLButtonElement>(null);
    const queryClient = useQueryClient();

    const addClientMutation = useMutation({
        mutationFn: async (values: any) => {
            const formData = new FormData();
            formData.append("profilePic", values.profilePic);
            formData.append("email", values.email);
            formData.append("name", values.legalName);
            return axiosInstance.post("/admin/client", formData);
        },
        onSuccess: (data) => {
            if (callback) {
                callback(data.user._id)
            }
            queryClient.invalidateQueries({ queryKey: ["clients"] });
            onClose()
        },
    });

    const onClose = () => {
        closeDialogRef.current?.click();
        console.log('close')
    }

    const handleSubmit = (values: any) => {
        addClientMutation.mutate(values);
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                {trigger ? trigger : <Button>Add Client</Button>}
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
                <Dialog.Title>Add Client</Dialog.Title>
                <Dialog.Description size="2" mb="6">
                    Add a new client to the platform.
                </Dialog.Description>

                <Formik initialValues={{
                    profilePic: null,
                    email: "",
                    legalName: ""
                }} onSubmit={handleSubmit}>
                    {({ values, handleChange, handleBlur, setFieldValue }) => (
                        <Form>
                            <Flex justify={"center"} gap={"4"} >
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
                                                setFieldValue("profilePic", file);
                                            }
                                        }}
                                    />
                                    <Avatar
                                        size="8"
                                        src={values.profilePic ? URL.createObjectURL(values.profilePic) : "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"}
                                        fallback="A"
                                        className="hover:opacity-80 transition-opacity"
                                    />
                                    <Box css={{ backgroundColor: "$gray8" }} className="absolute -bottom-2 border-4 border-white -right-4 text-white text-xs rounded-full w-10 h-10 flex items-center justify-center">
                                        <CameraIcon className="w-4 h-4" />
                                    </Box>
                                </label>
                            </Flex>

                            <Flex direction="column" gap="3">
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        Email
                                    </Text>
                                    <TextField.Root
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </label>
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        Legal Name
                                    </Text>
                                    <TextField.Root
                                        name="legalName"
                                        value={values.legalName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </label>
                            </Flex>
                            <Box className="my-2">
                                {addClientMutation.isError && <Caption css={{ color: "$danger" }}>We encountered a problem: {addClientMutation.error.message}. Try again.</Caption>}
                            </Box>
                            <Flex gap="3" mt="4" justify="end">
                                <Dialog.Close ref={closeDialogRef}>
                                    <Button variant="ghost" colorScheme={"surface"}>
                                        Cancel
                                    </Button>
                                </Dialog.Close>
                                <Button className="w-[72px]" disabled={addClientMutation.isPending} type="submit" colorScheme={addClientMutation.isPending ? "surface" : "primary"}>
                                    {addClientMutation.isPending ? <Spinner /> : "Save"}
                                </Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </Dialog.Content>
        </Dialog.Root>

    )
}

export default AddClient;