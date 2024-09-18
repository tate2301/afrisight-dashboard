import { useEffect, useState } from "react";
import GeneralLayout from "../../layout/GeneralLayout";
import {
  DevicePhoneMobileIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import useWithStatus from "../../hooks/useWithStatus";
import axiosInstance from "@/hooks/useApiFetcher";
import { GAMIFICATION_ROUTES, USER_ROUTES } from "@/lib/api-routes";
import { cn } from "@/lib/utils";
import {
  BoxesIcon,
  Building2,
  CheckIcon,
  LoaderIcon,
  Ticket,
  User2Icon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatDistanceToNow } from "date-fns";
import CreateStoreListing from "@/components/add/store-item";
import { TStoreItem } from "@/utils/types";

type Profile = {
  user: {
    email: string;
    isEmailVerified: boolean;
  };
  isDeleted?: boolean;
  profileType: "ADMIN" | "CLIENT" | "SUPPORT" | "PARTICIPANT";
  createdAt: string;
};

function Store() {
  const [listings, setListings] = useState<TStoreItem[]>([]);
  const { error, isLoading, executor } = useWithStatus();

  const fetchListings = async () => {
    try {
      const response = await executor(() =>
        axiosInstance.get(GAMIFICATION_ROUTES.GET_STORE_ITEMS),
      );
      setListings(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <GeneralLayout>
      <div className="flex flex-row items-start justify-between mb-6">
        <p className="text-start font-bold text-zinc-900 text-3xl ">
          Store listings
        </p>
        <CreateStoreListing callback={fetchListings} />
      </div>
      <Table>
        <TableHeader className="text-start text-sm py-2 border-b">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>
              Base price <span className="text-xs">(in points)</span>
            </TableHead>
            <TableHead>Current price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y">
          {listings.map((listing) => (
            <TableRow>
              <TableCell>{listing.name}</TableCell>
              <TableCell className="capitalize">
                <p
                  className={cn(
                    "w-fit px-2.5 py-1 inline-flex gap-2 font-semibold",
                    listing.type === "virtual_good" && "text-teal-600",
                    listing.type === "voucher" && "text-orange-600",
                  )}
                >
                  {listing.type === "virtual_good" && (
                    <>
                      <BoxesIcon className="w-5 h-5" />
                      <span>Virtual Good</span>
                    </>
                  )}
                  {listing.type === "voucher" && (
                    <>
                      <Ticket className="w-5 h-5" />
                      <span>Voucher</span>
                    </>
                  )}
                </p>
              </TableCell>
              <TableCell>{listing.pointsCost}</TableCell>
              <TableCell>
                <p className="font-semibold w-fit px-1.5 py-0.5 rounded bg-white pressable-shadow">
                  {listing.currentPricePoints}
                </p>
              </TableCell>
              <TableCell>{listing.stock}</TableCell>
              <TableCell>
                {formatDate(listing.createdAt, "dd MMM, yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </GeneralLayout>
  );
}

export default Store;
