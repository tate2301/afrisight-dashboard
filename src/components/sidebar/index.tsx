import { cn } from "@/lib/utils";
import { Building, FileText, Gift, Home, Inbox, PersonStanding, Store, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "../design-sytem/link";
import Box from "../design-sytem/box";

const sidebarNavItems: SidebarNavItemProps[] = [
    {
        Icon: Home,
        text: "Home",
        href: "/home"
    },
    {
        Icon: FileText,
        text: "Gigs",
        href: "/gigs"
    },
    {
        Icon: Building,
        text: "Clients",
        href: "/clients"
    },
    {
        Icon: PersonStanding,
        text: "Participants",
        href: "/participants"
    },
    {
        Icon: Gift,
        text: "Rewards",
        href: "/rewards"
    },
    {
        Icon: Store,
        text: "Store",
        href: "/store"
    },
    {
        Icon: Inbox,
        text: "Payout requests",
        href: "/payout-requests"
    },
    {
        Icon: Users,
        text: "Users",
        href: "/users"
    }


]

const Sidebar = () => {
    return (
        <Box as="aside" className="w-72 bg-zinc-50 sticky top-0 h-screen">
            <div className="h-[48px] mb-4"></div>
            <ul className="flex flex-col gap-2 p-2">
                {sidebarNavItems.map((item, index) => (
                    <SidebarNavItem key={index} {...item} Icon={item.Icon} />
                ))}
            </ul>
        </Box>
    )
}

type SidebarNavItemProps = {
    Icon: React.ElementType;
    text: string;
    href: string;
}
const SidebarNavItem = ({ Icon, text, href }: SidebarNavItemProps) => {
    const pathname = usePathname();
    const active = pathname.includes(href);
    return (
        <li className={cn("p-2 rounded-md hover:bg-white/30", active && "bg-white hover:bg-white")}>
            <Link color={active ? "primary" : "white"} state={active ? "active" : "default"} className="flex w-full items-center gap-2" href={href}>
                <Icon className="w-4 h-4" />
                {text}
            </Link>
        </li>
    )
}

export default Sidebar;