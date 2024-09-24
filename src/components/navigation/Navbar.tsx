import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Cog6ToothIcon, UserIcon } from "@heroicons/react/24/outline";
import { data } from "../../utils/data";
import { Building2, StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Search from "../search/Search";

const Navbar = () => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <nav className="w-full h-[48px] flex items-center border-b border-zinc-300/30 bg-white">
      <div className="w-full px-4 flex items-center space-x-8">
        <div className="w-96">
          <Search />
        </div>
        <div className="flex-1" />
        <div className="flex items-center space-x-4">
          <Link
            href={"/settings"}
            className=" transition-all cursor-pointer duration-100 text-zinc-700  hover:bg-slate-100 p-1 rounded-full"
          >
            <Cog6ToothIcon height={20} width={20} />
          </Link>
          <Link
            href={"/settings"}
            className=" transition-all cursor-pointer duration-100 text-zinc-700 hover:bg-zinc-300 bg-zinc-200 h-[32px] w-[32px] flex items-center justify-center rounded-full"
          >
            <UserIcon height={20} width={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
