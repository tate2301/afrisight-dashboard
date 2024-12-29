import { Avatar } from "@radix-ui/themes";
import ProfilePopoverCard from "@/components/ProfilePopoverCard";
import TableLink from "@/components/ui/datatable/Link";
import { Paragraph } from "@/components/design-sytem/typography";
import { ColumnDef } from "@tanstack/react-table";
import { Response } from "../types";
import { Checkbox } from "@/components/ui/aria-components/Checkbox";

const submissionsColumns: ColumnDef<Response>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                isSelected={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected())
                }
                onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center sticky-column">
                <Checkbox
                    isSelected={row.getIsSelected()}
                    onChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        size: 44,
    },
    {
        id: 'email',
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
            <div className='gap-4 flex items-center sticky-column'>
                <ProfilePopoverCard  {...row.original.user} id={row.original.user._id}>
                    <Avatar
                        className="rounded-full bg-zinc-400/30 w-[24px] h-[24px] flex item-center justify-center"
                        fallback={row.original.email.substring(0, 1)}
                        src={row.original.user.profile.profilePic}
                        alt={'client profile'}
                    />
                </ProfilePopoverCard>
                <TableLink href={`/participants/${row.original._id}`}>
                    <Paragraph>{row.original.email}</Paragraph>
                </TableLink>
            </div>
        ),
        size: 320,
    },
];



export default submissionsColumns