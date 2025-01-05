'use client';

import {Gig} from '@/utils/types';

import {UseMutateFunction} from '@tanstack/react-query';
import {FormState} from './types';
import {useFormik} from 'formik';
import {FormProvider} from '@/forms-builder/context';
import {Suspense, useMemo} from 'react';
import GigSkeleton from './GigPageSkeleton';
import GigHeader from './Header';
import GigDataset from './GigDataset';
import GigFormBuilder from './GigFormBuilder';
import GigConfig from './GigConfiguration';
import {
	Tab,
	TabList,
	TabPanel,
	Tabs,
} from '@/components/ui/aria-components/Tabs';
import {Separator} from '@/components/ui/aria-components/Separator';
import GigParticipants from './GigParticipants';
import useSubmissions from '../hooks/useSubmissions';
import GigPendingSubmissions from './GigPendingSubmissions';

type GigPageShellProps = {
	survey: Gig;
	mutate: UseMutateFunction<void, Error, FormState, unknown>;
	isPending: boolean;
	saveGigChanges: (form: any) => void;
	publishGig: (form: any) => void;
	isPublishing: boolean;
};

export default function GigPageShell(props: GigPageShellProps) {
	const {survey, mutate, isPending, saveGigChanges, publishGig} = props;
	const {_id: id} = survey;
	const {data: responses = []} = useSubmissions(id);
	const {data: pendingResponses = []} = useSubmissions(id, 1, 10, true);

	const formikConfig = useMemo(
		() => ({
			initialValues: {
				...survey,
				rewardPolicy: survey.rewardPolicy?._id,
			} as Partial<Omit<Gig, 'rewardPolicy'>> & {rewardPolicy?: string},
			onSubmit: (values: FormState) => mutate(values),
		}),
		[survey, mutate],
	);

	const formik = useFormik(formikConfig);

	if (!survey) return <GigSkeleton />;

	return (
		<Suspense fallback={<GigSkeleton />}>
			<FormProvider initialForm={survey?.form}>
				<div className="mb-6 w-full flex-shrink-0">
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
					className={'w-full flex-1 h-full'}>
					<TabList className="gap-2 sticky top-0 z-[2000] bg-white px-4 text-sm">
						<Tab id="responses">
							<span className="material-symbols-rounded mr-1">table</span>
							Pending Submissions
						</Tab>
						<Tab id="dataset">
							<span className="material-symbols-rounded mr-1">dataset</span>
							Dataset
						</Tab>
						<Tab id="additional">
							<span className="material-symbols-rounded mr-1">table_view</span>{' '}
							Views
						</Tab>
						<Tab id="participants">
							<span className="material-symbols-rounded mr-1">group</span>{' '}
							Participants
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
						<GigPendingSubmissions
							_id={id as string}
							responses={pendingResponses}
						/>
					</TabPanel>
					<TabPanel id="dataset">
						<GigDataset
							_id={id as string}
							responses={responses}
						/>
					</TabPanel>
					<TabPanel id="participants">
						<GigParticipants
							_id={id as string}
							responses={responses}
						/>
					</TabPanel>
					<TabPanel id="additional">
						<GigDataset
							_id={id as string}
							responses={responses}
						/>
					</TabPanel>
					<TabPanel
						id="questions"
						className={'border-t border-zinc-400/30 overflow-y-auto w-full'}>
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
		</Suspense>
	);
}
