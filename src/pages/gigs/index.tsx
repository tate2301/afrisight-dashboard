import { useEffect, useState } from 'react';
import GeneralLayout from '../../layout/GeneralLayout';
import useWithStatus from '../../hooks/useWithStatus';
import axiosInstance from '@/hooks/useApiFetcher';
import { SURVEY_ROUTES } from '@/lib/api-routes';
import { cn } from '@/lib/utils';
import { BadgeCent, Ticket } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from 'date-fns';
import { CreateSurvey } from '@/components/add/survey';
import { TSurvey } from '@/utils/types';
import Link from 'next/link';
import { CubeIcon, PlusIcon } from '@heroicons/react/24/outline';
import Flex from '@/components/design-sytem/flex';
import { H3 } from '@/components/design-sytem/typography';
import { TabsContainer, TabsList, TabsTrigger } from '@/components/tab';
import Box from '@/components/design-sytem/box';
import { Dialog, IconButton, Text, TextArea, TextField } from '@radix-ui/themes';
import GigCard from '@/components/gig/card';
import Separator from '@/components/design-sytem/separator';
import SearchBox from '@/components/search/Search';
import { ChevronRight } from '@/components/icons/chevron.right';
import { ChevronLeft } from '@/components/icons/chevron.left';
import SelectWithOptions from '@/components/filter-button';
import PageWithTableShell from '@/components/shells/gig';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/design-sytem/button';
import { useQuery } from '@tanstack/react-query';

const tabs = ['All', 'Pending', 'Approved', 'Archived'];

export type RewardPolicy = {
  _id: string;
  name: string;
  description: string;
  dollarValue: number
  pointsValue: number
  voucher: string | null

}

export type SurveyGig = {
  _id: string;
  category: string
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "CLOSED";
  name: string
  description: string
  questions: string[]
  responses: string[]
  views: number
  rewardPolicy: RewardPolicy
  createdAt: string

}

function Gig() {
  const query = useSearchParams();
  const activeTab =
    query.get('tab') || tabs[0].toLowerCase().replaceAll(' ', '-');

  const {
    data: surveys,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['surveys'],
    queryFn: async () => {
      const response = await axiosInstance.get(SURVEY_ROUTES.GET_SURVEYS);
      return response;
    },
  });

  console.log(surveys)

  return (
    <GeneralLayout>
      {!isLoading && !error && (
        <PageWithTableShell
          actions={
            <Link href={'/gigs/create_gig'}>
              <Button>
                <PlusIcon className="size-4 mr-2" /> Create gig
              </Button>
            </Link>
          }
          title="Gigs"
          activeTab={activeTab}
          tabs={tabs}
          total={surveys.totalDocs}
          currentPage={1}
          pageSize={10}
          fetchSurveys={refetch}>
          <Box
            css={{ padding: '20px 0' }}
            className="py-2 space-y-[20px]">
            {surveys.surveys.map((gig: SurveyGig) => (
              <GigCard
                key={gig._id}
                _id={gig._id}
                createdDate={gig.createdAt}
                status={gig.status as unknown as any}
                title={gig.name}
                questions={gig.questions?.length ?? 0}
                responses={gig.responses?.length ?? 0}
                views={gig.views}

              />
            ))}
          </Box>
        </PageWithTableShell>
      )}
    </GeneralLayout>
  );
}

export default Gig;
