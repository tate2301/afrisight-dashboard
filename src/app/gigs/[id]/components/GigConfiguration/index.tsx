import { Caption, H2 } from "@/components/design-sytem/typography";

import { Paragraph } from "@/components/design-sytem/typography";

import { Flex } from "@radix-ui/themes";


import { Section } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { BasicInfoValues, TabProps } from "../types";
import { ClientsCombobox } from "@/components/gig/create-gig-components/ClientsCombobox";
import { ErrorMessage, TextInput } from "@/components/gig/create-gig-components/extras";
import FormBottomBar from "../ui/FormBottomBar";
import axiosServerInstance from "@/helpers/server/auth/axiosServerInstance";
import axiosClientInstance from "@/helpers/server/auth/axiosClientInstance";
import { Tabs, Tab, TabList, TabPanel } from "@/components/ui/aria-components/Tabs";
import Symbol from "@/components/icons/symbol";
import { Separator } from "@/components/ui/aria-components/Separator";
import QuestionOrderingSection from "./atoms/QuestionOrdering";
import DifficultySection from "./atoms/DifficultySection";
import GigRewardPolicyConfig from "./GigRewards";
import GigClientConfig from "./GigClient";
import { Card } from "@/components/ui/card";
import FormIslandCard from "./atoms/FormIslandCard";

const GigConfig = ({
    _id,
    client,
    description,
    name,
    mutate,
    isPending,
    formik,
    gig
}: TabProps & BasicInfoValues) => {
    const { values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue, } = formik
    const clientsQuery = useQuery({
        queryKey: ['clients'],
        queryFn: async () => {

            const res = await axiosClientInstance.get('/admin/client');
            const data = res.data.docs.map((doc: any) => ({
                data: {
                    name: doc.firstname,
                    email: doc.user.email,
                    profilePic: doc.profilePic,
                    _id: doc.user._id,
                },
                label: doc.firstname,
                value: doc.user._id,
            }));

            return data;
        },
    });
    return (
        <>
            <Separator />
            <Tabs className={"h-full"}>
                <form className="flex space-x-4 w-full h-full relative " onSubmit={formik.handleSubmit}>
                    <TabList className="flex flex-col w-[280px] sticky top-0 p-4">
                        <Tab id="basic-information" className="px-2 py-1.5 rounded-xl flex items-center gap-2">
                            <Symbol>
                                description
                            </Symbol>
                            Basic Information
                        </Tab>
                        <Tab id="targeting" className="px-2 py-1.5 rounded-xl flex items-center gap-2">
                            <Symbol>
                                target
                            </Symbol>
                            Targeting & Behaviour
                        </Tab>
                        <Tab id="client" className="px-2 py-1.5 rounded-xl flex items-center gap-2">
                            <Symbol>
                                storefront
                            </Symbol>
                            Client
                        </Tab>
                        <Tab id="reward-policy" className="px-2 py-1.5 rounded-xl flex items-center gap-2">
                            <Symbol>
                                award_star
                            </Symbol>
                            Reward Policy
                        </Tab>
                    </TabList>
                    <div className="bg-white px-8 py-4 shadow h-full flex-1 ">
                        <TabPanel id="basic-information" className="max-w-2xl">
                            <FormIslandCard formik={formik} title="Basic Information">
                                <div className="flex flex-col space-y-4">
                                    <label className="mb-4">
                                        <Paragraph weight={'semibold'}>
                                            Title <span className="text-red-500">*</span>
                                        </Paragraph>
                                        <TextInput
                                            name="name"
                                            value={values.name}
                                            onChange={(value) => setFieldValue('name', value)}
                                            onBlur={handleBlur}
                                        />
                                        {touched.name && errors.name && (
                                            <ErrorMessage>{errors.name}</ErrorMessage>
                                        )}
                                        <Caption
                                            color={'secondary'}
                                            className="mt-2">
                                            Pay attention to the title and make sure it aligns with the goals of
                                            the client and their brand voice.
                                        </Caption>
                                    </label>

                                    <label className="mb-4">
                                        <Paragraph weight={'semibold'}>
                                            Description <span className="text-red-500">*</span>
                                        </Paragraph>
                                        <TextInput
                                            name="description"
                                            value={values.description}
                                            onChange={(value) => setFieldValue('description', value)}
                                            onBlur={handleBlur}
                                        />
                                        {touched.description && errors.description && (
                                            <ErrorMessage>{errors.description}</ErrorMessage>
                                        )}
                                    </label>
                                </div>
                            </FormIslandCard>

                        </TabPanel>
                        <TabPanel id="targeting" className={"max-w-2xl pb-40"}>
                            <Section className="max-w-3xl">
                                <form className="space-y-8" onSubmit={formik.handleSubmit}>
                                    <div>
                                        <h3
                                            color={'primary'}
                                            className="mb-4 text-lg font-semibold tracking-tight">
                                            Targeting and Options
                                        </h3>

                                    </div>

                                    <FormIslandCard title="Question Ordering" description="Configure how questions are presented to participants of this gig." formik={formik}>
                                        <QuestionOrderingSection formik={formik} />
                                    </FormIslandCard>


                                    <FormIslandCard title="Gig Difficulty" description="How difficult is it to complete this gig for an average person" formik={formik}>
                                        <DifficultySection formik={formik} />
                                    </FormIslandCard>

                                </form>
                            </Section>
                        </TabPanel>
                        <TabPanel id="client" className={"max-w-2xl"}>
                            <GigClientConfig
                                _id={_id as string}
                                gig={gig}
                                formik={formik}
                                mutate={mutate}
                                isPending={isPending}
                                rewardPolicy={gig.rewardPolicy?._id}
                            />
                        </TabPanel>
                        <TabPanel id="reward-policy" className={"max-w-2xl"}>
                            <GigRewardPolicyConfig
                                _id={_id as string}
                                gig={gig}
                                formik={formik}
                                mutate={mutate}
                                isPending={isPending}
                                rewardPolicy={gig.rewardPolicy?._id}
                            />
                        </TabPanel>
                    </div>
                </form>
            </Tabs>
        </>
    );
};

export default GigConfig