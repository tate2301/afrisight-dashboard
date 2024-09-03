import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
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
import { CubeIcon } from "@heroicons/react/24/outline";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

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
  const { id } = router.query;
  const [survey, setSurvey] = useState<TSurvey | null>(null);

  const { error, isLoading, executor } = useWithStatus();

  const fetchGigData = async (id: string) => {
    const gigResponse = await axiosInstance.get(
      SURVEY_ROUTES.GET_SURVEY_BY_ID(id)
    );
    setSurvey(gigResponse.data);
    console.log(gigResponse.data);
  };

  useEffect(() => {
    if (id) {
      fetchGigData(id as string);
    }
  }, [id]);

  return (
    <GeneralLayout>
      <Suspense fallback={<GigSkeleton />}>
        {survey && (
          <>
            <div className="flex justify-between items-center mb-10 pb-6">
              <div>
                <Link href={"/gigs"} className="font-semibold text-indigo-600 mb-2 flex items-center gap-1">Surveys <ChevronRight className="size-5" /></Link>
                <div className="max-w-xl flex gap-4">
                  <div className="size-16 rounded-lg border border-zinc-400/10 bg-zinc-400/10 flex items-center justify-center">
                    <CubeIcon className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-xl font-bold text-zinc-900 mb-1">
                        {survey.name}
                      </h3>
                      <p className="px-2 h-[20px] text-xs pressable-shadow rounded-lg flex items-center font-semibold">
                        {survey.status}
                      </p>
                    </div>
                    <p>
                      ${survey.dollarRewardValue} per submission
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="px-2.5 h-[28px] rounded-md pressable-shadow font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Set reward price
                </button>
                <button className="w-fit py-1 px-2 rounded-md bg-indigo-600 text-white font-semibold flex items-center pressable-shadow h-[28px]">
                  Publish
                </button>
                <button className="w-fit py-1 px-2 gap-2 rounded-md bg-white text-zinc-900 font-semibold flex items-center pressable-shadow h-[28px]">
                  <MoreHorizontal className="size-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-16">
              <div className="col-span-3">
                <div className="mb-16">
                  <div className="flex justify-between items-baseline py-2 border-b">
                    <h2 className="font-bold text-lg text-zinc-900">Reward</h2>
                    <div className="flex gap-4">
                      <button className="px-2.5 h-[28px] rounded-md pressable-shadow font-semibold flex items-center gap-2">
                        <PencilIcon className="w-4 h-4" /> Edit
                      </button>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs h-[28px]">
                          Reward type
                        </TableHead>
                        {survey.reward.type === "points" && <TableHead className="text-xs h-[28px]">
                          Reward points
                        </TableHead>}
                        {
                          survey.reward.type === "voucher" && (
                            <>
                              <TableHead className="text-xs h-[28px]">
                                Code
                              </TableHead>
                              <TableHead className="text-xs h-[28px]">
                                Max redemptions
                              </TableHead>
                              <TableHead className="text-xs h-[28px]">
                                Expires
                              </TableHead>
                            </>
                          )
                        }
                      </TableRow>
                    </TableHeader>
                    <TableBody className="border-b">
                      <TableRow>
                        <TableCell>
                          <p
                            className={cn(
                              "flex gap-2 font-semibold items-center",
                              survey.reward.type === "points"
                                ? "text-purple-600"
                                : "text-orange-600"
                            )}
                          >
                            {survey.reward.type === "points" && (
                              <>
                                <BadgeCent className="w-5 h-5" />
                                <span>Points</span>
                              </>
                            )}
                            {survey.reward.type === "voucher" && (
                              <>
                                <Ticket className="w-5 h-5" />
                                <span>Voucher</span>
                              </>
                            )}
                          </p>
                        </TableCell>
                        {
                          survey.reward.type === 'points' && (
                            <TableCell>
                              <p className="px-2 py-0.5 w-fit rounded-md bg-zinc-400/10 font-semibold text-sm text-zinc-900">
                                {survey.reward.value.amount} XP
                              </p>
                            </TableCell>
                          )
                        }
                        {survey.reward.type === "voucher" && (
                          <>
                            <TableCell>
                              <p className="font-semibold border border-zinc-400/15 bg-zinc-400/10 px-2 py-0.5 w-fit rounded-md gap-2 flex items-center text-zinc-900">
                                {survey.reward.value.code}
                                <Copy className="w-4 h-4" />
                              </p>
                            </TableCell>
                            <TableCell>
                              <p className="px-2 py-0.5 w-fit rounded-md bg-zinc-400/10 font-semibold text-sm text-zinc-900">
                                {survey.reward.value.maxRedemptions}
                              </p>
                            </TableCell>
                            <TableCell>
                              <p className="px-2 py-0.5 w-fit rounded-md bg-zinc-400/10 font-semibold text-sm text-zinc-900">
                                {formatDate(
                                  survey.reward.value.expiresAt!,
                                  "dd MMM, yyyy"
                                )}
                              </p>
                            </TableCell>

                          </>
                        )}
                      </TableRow>
                    </TableBody>
                  </Table>

                </div>
                <div>
                  <div className="flex justify-between items-baseline py-2 border-b">

                    <h2 className="font-bold text-lg text-zinc-900">Responses</h2>
                    <div className="flex gap-4">
                      <button className="px-2.5 h-[28px] rounded-md pressable-shadow font-semibold flex items-center gap-2">
                        <CloudDownload className="w-4 h-4" /> Export as CSV
                      </button>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs h-[28px]">
                          Email address
                        </TableHead>
                        <TableHead className="text-xs h-[28px]">
                          Amount paid
                        </TableHead>
                        <TableHead className="text-xs h-[28px]">
                          Points paid
                        </TableHead>
                        <TableHead className="text-xs h-[28px]">
                          Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>

                    </TableBody>
                    <TableCaption>
                      No submissions found
                    </TableCaption>
                  </Table>
                </div>
              </div>
              <div className="col-span-1">
                <div className="space-y-4 mb-8">
                  <h3 className="font-bold text-zinc-900 py-2 border-b">
                    Summary
                  </h3>
                  <div>
                    <Label className="text-zinc-900">
                      Created
                    </Label>
                    <p className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      {formatDate(survey.createdAt, "dd MMM, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-zinc-900 py-2 border-b">
                    Details
                  </h3>
                  <div>
                    <Label className="text-zinc-900">
                      Reference ID
                    </Label>
                    <p className="font-semibold text-zinc-900 flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      {survey._id}
                    </p>
                  </div>
                  <div>
                    <Label className="text-zinc-900">
                      Description
                    </Label>
                    <p>
                      {survey.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Suspense>
    </GeneralLayout>
  );
}
