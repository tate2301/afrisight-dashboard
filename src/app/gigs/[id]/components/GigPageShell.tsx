'use client';

import { Gig } from '@/utils/types';

import { UseMutateFunction } from '@tanstack/react-query';
import { FormState } from './types';
import { useFormik } from 'formik';
import { FormProvider } from '@/forms-builder/context';
import { Suspense } from 'react';
import GigSkeleton from './GigPageSkeleton';
import GigHeader from './Header';
import GigSubmissions from './GigSubmissions';
import GigFormBuilder from './GigFormBuilder';
import GigConfig from './GigConfiguration';
import {
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from '@/components/ui/aria-components/Tabs';
import { Separator } from '@/components/ui/aria-components/Separator';

type GigPageShellProps = {
    survey: Gig;
    mutate: UseMutateFunction<void, Error, FormState, unknown>;
    isPending: boolean;
    saveGigChanges: (form: any) => void;
    publishGig: (form: any) => void;
    isPublishing: boolean;
};

export default function GigPageShell(props: GigPageShellProps) {
    const { survey, mutate, isPending, saveGigChanges, publishGig } = props;
    const { _id: id } = survey;

    const formik = useFormik({
        initialValues: {
            ...survey,
            rewardPolicy: survey.rewardPolicy?._id,
        } as Partial<Omit<Gig, 'rewardPolicy'> & { rewardPolicy?: string }>,
        onSubmit: (values: FormState) => mutate(values),
    });

    return (
        <Suspense fallback={<GigSkeleton />}>
            {survey && (
                <FormProvider initialForm={survey?.form}>
                    <div className="mb-6 w-full">
                        <GigHeader
                            save={saveGigChanges}
                            publish={publishGig}
                            isPublishing={props.isPublishing}
                            isSaving={props.isPending}
                            status={survey?.status}
                            gig={survey}
                        />
                    </div>
                    <Separator className="mb-2" />
                    <Tabs
                        defaultSelectedKey="responses"
                        className={'w-full flex-1'}>
                        <TabList className="gap-2 sticky top-0 z-[2000] bg-white px-4">
                            <Tab id="responses">
                                <span className="material-symbols-rounded mr-1">table</span>
                                Pending Submissions
                            </Tab>
                            <Tab id="dataset">
                                <span className="material-symbols-rounded mr-1">dataset</span>
                                Dataset
                            </Tab>
                            <Tab id="additional">
                                <span className="material-symbols-rounded mr-1">
                                    table_view
                                </span>{' '}
                                Views
                            </Tab>
                            <Tab id="questions">
                                {' '}
                                <span className="material-symbols-rounded mr-1">handyman</span>
                                Form Builder
                            </Tab>
                            <Tab id="basic-info">
                                <span className="material-symbols-rounded mr-1">settings</span>
                                Configuration
                            </Tab>
                        </TabList>
                        <TabPanel id="responses">
                            <GigSubmissions _id={id as string} />
                        </TabPanel>
                        <TabPanel id="dataset">
                            <GigSubmissions _id={id as string} />
                        </TabPanel>
                        <TabPanel id="questions" className={"border-t border-zinc-400/30"}>
                            <GigFormBuilder
                                _id={id as string}
                                description={survey.description}
                                name={survey.name}
                                form={survey.form}
                            />
                        </TabPanel>
                        <TabPanel
                            id={'basic-info'}
                            className="bg-[#FAF9F7] h-full">
                            {survey && (
                                <GigConfig
                                    formik={formik}
                                    gig={survey}
                                    {...survey}
                                    mutate={mutate}
                                    isPending={isPending}
                                />
                            )}
                        </TabPanel>
                    </Tabs>
                </FormProvider>
            )}
        </Suspense>
    );
}
