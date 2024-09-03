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


function Vouchers() {
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
      <div className='flex flex-row items-start justify-between mb-6'>
        <p className='text-start font-bold text-zinc-900 text-3xl '>
          Surveys
        </p>
        <CreateSurvey callback={fetchSurveys} />
      </div>
      <Table>
        <TableHeader className='text-start text-sm py-2 border-b'>
          <TableRow>
            <TableHead className="w-6" />
            <TableHead>Name</TableHead>
            <TableHead>Default reward (USD)</TableHead>
            <TableHead>Additional reward type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='divide-y'>
          {surveys.map((survey) => (
            <TableRow>
              <TableCell>
                <div className="p-1 rounded-lg border border-zinc-400/10 bg-zinc-400/10 flex items-center justify-center">
                  <CubeIcon className="size-5" />
                </div>
              </TableCell>
              <TableCell>
                <Link href={`/gigs/${survey._id}`}>
                  <p className="font-semibold text-zinc-900">{survey.name}</p>
                  <p className="line-clamp-1 max-w-64">
                    {survey.description}
                  </p></Link>
              </TableCell>
              <TableCell className='capitalize'>
                {survey.dollarRewardValue}
              </TableCell>

              <TableCell >
                <p className={cn("inline-flex gap-2 font-semibold", survey.reward.type === "points" ? "text-purple-600" : "text-orange-600")}>
                  {survey.reward.type === "points" && <>
                    <BadgeCent className="w-5 h-5" />
                    <span>Points</span>
                  </>}
                  {survey.reward.type === "voucher" && <>
                    <Ticket className="w-5 h-5" />
                    <span>Voucher</span>
                  </>}
                </p>
              </TableCell>
              <TableCell className="font-semibold">
                <p className="w-fit py-1 px-2.5 rounded-full text-sm bg-zinc-100">
                  {survey.status}
                </p>
              </TableCell>
              <TableCell>
                {
                  formatDate(new Date(survey.createdAt), "dd MMM, yyyy")
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </GeneralLayout>
  );
}

export default Vouchers;
