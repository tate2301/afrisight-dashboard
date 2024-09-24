import { useEffect, useState } from "react";
import GeneralLayout from "../../layout/GeneralLayout";
import useWithStatus from "../../hooks/useWithStatus";
import axiosInstance from "@/hooks/useApiFetcher";
import { SURVEY_ROUTES } from "@/lib/api-routes";
import { cn } from "@/lib/utils";
import { BadgeCent, Ticket } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "date-fns";
import { CreateSurvey } from "@/components/add/survey";
import { TSurvey } from "@/utils/types";
import Link from "next/link";
import { CubeIcon } from "@heroicons/react/24/outline";
import Flex from "@/components/design-sytem/flex";
import { H3 } from "@/components/design-sytem/typography";
import { TabsContainer, TabsList, TabsTrigger, } from "@/components/tab";
import Box from "@/components/design-sytem/box";
import { Button, IconButton, Text } from "@radix-ui/themes";
import GigCard from "@/components/gig/card";
import Separator from "@/components/design-sytem/separator";
import Search from "@/components/search/Search";
import { ChevronRight } from "@/components/icons/chevron.right";
import { ChevronLeft } from "@/components/icons/chevron.left";

const gigs = [
  {
    id: 1,
    title: "Gig title",
    createdDate: "2024-02-01",
    status: "pending",
    questions: 4,
    responses: 0,
    views: 0,
  },
  {
    id: 2,
    title: "Gig title",
    createdDate: "2024-02-01",
    status: "pending",
    questions: 4,
    responses: 0,
    views: 0,
  },
  {
    id: 3,
    title: "Gig title",
    createdDate: "2024-02-01",
    status: "approved",
    questions: 4,
    responses: 0,
    views: 0,
  },
  {
    id: 4,
    title: "Gig title",
    createdDate: "2024-02-01",
    status: "archived",
    questions: 4,
    responses: 0,
    views: 0,
  }
]


function Gig() {
  const [surveys, setSurveys] = useState<TSurvey[]>([]);
  const { error, isLoading, executor } = useWithStatus();

  const fetchSurveys = async () => {
    try {
      const response = await executor(() =>
        axiosInstance.get(SURVEY_ROUTES.GET_SURVEYS),
      );
      setSurveys(response.data.surveys);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  return (
    <GeneralLayout>
      <Flex className="flex flex-row items-start justify-between mb-6 p-4">
        <H3>Surveys</H3>
        <CreateSurvey callback={fetchSurveys} />
      </Flex>
      <TabsContainer>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </TabsContainer>
      <Box>

        <Flex css={{ padding: "8px 12px", }} justifyContent={"between"} alignItems={"center"}>
          <Search />
          <Flex css={{ gap: 8 }} alignItems={"center"}>
            <Text className="mr-4">1 - 20 of 39</Text>
            <IconButton variant="ghost">
              <ChevronLeft />
            </IconButton>
            <IconButton variant="ghost">
              <ChevronRight />
            </IconButton>
          </Flex>
        </Flex>
        <Separator css={{ backgroundColor: "$gray2" }} />
        <Box css={{ padding: "20px 0", }} className="py-2 space-y-[20px]">
          {
            gigs.map((gig) => (
              <GigCard key={gig.id} createdDate={gig.createdDate} status={gig.status as unknown as any} title={gig.title} questions={gig.questions} responses={gig.responses} views={gig.views} />
            ))
          }
        </Box>
      </Box>
    </GeneralLayout>
  );
}

export default Gig;
