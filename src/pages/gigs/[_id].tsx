import { useRouter } from "next/router";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import GeneralLayout from "@/layout/GeneralLayout";
import useWithStatus from "@/hooks/useWithStatus";
import axiosInstance from "@/hooks/useApiFetcher";
import { SURVEY_ROUTES } from "@/lib/api-routes";
import { TSurvey } from "@/utils/types";
import { Label } from "@/components/ui/label";
import {
  BadgeCent,
  ChevronDownIcon,
  ChevronRight,
  ClipboardIcon,
  ClockIcon,
  CloudDownload,
  Copy,
  DollarSign,
  Download,
  Image,
  MoreHorizontal,
  PencilIcon,
  PenIcon,
  Terminal,
  Ticket,
} from "lucide-react";
import { formatDate } from "date-fns";
import { cn } from "@/lib/utils";
import { CubeIcon, DocumentIcon } from "@heroicons/react/24/outline";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";
import { TabsContainer } from "@/components/tab";
import { Tabs } from "@radix-ui/themes";
import { FormBuilder } from "@/forms-builder/components/FormBuilder";
import { FormProvider } from "@/forms-builder/context";

interface GigData {
  id: string;
  title: string;
  description: string;
  price: number;
  // Add more fields as needed
}

async function fetchGigData(id: string): Promise<GigData> {
  // Implement your data fetching logic here
  // This is a placeholder
  return {
    id,
    title: "Sample Gig",
    description: "This is a sample gig description",
    price: 100,
  };
}

function GigSkeleton() {
  return (
    <Card className="mx-auto mt-8">
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" count={3} />
        <Skeleton className="h-6 w-1/4 mb-4" />
        <Skeleton className="h-10 w-32" />
      </CardContent>
    </Card>
  );
}

function GigDetails({ gig }: { gig: GigData }) {
  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>{gig.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{gig.description}</p>
        <p className="text-2xl font-bold mb-4">${gig.price}</p>
        <Button>Book Now</Button>
      </CardContent>
    </Card>
  );
}

export default function GigPage() {
  const router = useRouter();
  const { _id: id } = router.query;
  const [survey, setSurvey] = useState<TSurvey | null>(null);

  const fetchGigData = async (id: string) => {
    const gigResponse = await axiosInstance.get(
      SURVEY_ROUTES.GET_SURVEY_BY_ID(id),
    );
    setSurvey(gigResponse);
    console.log(gigResponse);
  };

  useEffect(() => {
    if (id) {
      fetchGigData(id as string);
    }
  }, [id]);


  return (
    <GeneralLayout>
      <Suspense fallback={<GigSkeleton />}>
        <FormProvider>
          <Tabs.Root className="sticky top-0" defaultValue="summary">
            <Tabs.List className="flex gap-2">
              <Tabs.Trigger value="summary">Summary</Tabs.Trigger>
              <Tabs.Trigger value="questions">Questions</Tabs.Trigger>
              <Tabs.Trigger value="responses">Responses</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="summary"></Tabs.Content>
            <QuestionsTab _id={id as string} />
          </Tabs.Root>
        </FormProvider>
      </Suspense>
    </GeneralLayout>
  );
}

const QuestionsTab = ({ _id }: { _id: string }) => {
  return (
    <Tabs.Content value="questions">
      <FormBuilder gig_id={_id} />
    </Tabs.Content>
  )
}
