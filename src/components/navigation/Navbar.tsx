import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { data } from "../../utils/data";
import { Building2, StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="w-full border-b border-zinc-300/30 bg-zinc-50">
      <div className="w-full max-w-7xl mx-auto p-2 px-4 flex flex-row items-center space-x-8">
        <Link
          href={"/home"}
          className="font-semibold p-1 rounded-md bg-white shadow"
        >
          <Building2 className="w-5 h-5" />
        </Link>
        <div className="md:flex hidden flex-row items-center">
          {data.nav_options.map((item, index) => (
            <Link
              href={item.location}
              key={index}
              className={cn(
                `${
                  pathname === item.location
                    ? "text-white bg-blue-600 rounded-full"
                    : "text-zinc-900"
                } `,
                "font-medium px-2.5 py-0.5 ",
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex-1" />
        <Link
          href={"/settings"}
          className=" transition-all cursor-pointer duration-100 text-zinc-700  hover:bg-slate-100 p-1 rounded-full"
        >
          <Cog6ToothIcon height={20} width={20} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
