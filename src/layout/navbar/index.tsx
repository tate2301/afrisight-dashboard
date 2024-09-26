import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Cog6ToothIcon, UserIcon } from '@heroicons/react/24/outline';
import { data } from '../../utils/data';
import { Building2, ChevronRight, LogOut, StoreIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import SearchBox from '../../components/search/Search';
import Box from '@/components/design-sytem/box';
import { NAVBAR_HEIGHT } from '../constants';
import { useGeneralLayoutContext } from '../context';
import { Paragraph } from '@/components/design-sytem/typography';
import { Avatar, DropdownMenu } from '@radix-ui/themes';

const Navbar = () => {
  const { pageTitle } = useGeneralLayoutContext();

  return (
    <Box
      css={{
        height: NAVBAR_HEIGHT,
        backgroundColor: '$white',
      }}
      className="w-full flex items-center relative"
      style={{ zIndex: 1000 }}>
      <div className="w-full px-4 flex items-center space-x-8">
        <Box>
          <Paragraph className='tracking-tight' weight={"bold"} color={"primary"} css={{
            fontSize: '18px',
            lineHeight: '1.5',
          }}>{pageTitle}</Paragraph>
        </Box>
        <div className="w-96">{false && <SearchBox />}</div>
        <div className="flex-1" />
        <div className="flex items-center space-x-4">
          <Link
            href={'/settings'}
            className=" transition-all cursor-pointer duration-100 text-zinc-700  hover:bg-slate-100 p-1 rounded-full">
            <Cog6ToothIcon
              height={20}
              width={20}
            />
          </Link>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex items-center justify-center">
              <Avatar fallback={"C"} style={{ width: 32, height: 32 }} className="rounded-full" src="https://avatars.dicebear.com/api/initials/user@example.com.svg" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content style={{ minWidth: 275, padding: 0 }}>
              <DropdownMenu.Item>
                <LogOut className="w-4 h-4" />
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    </Box>
  );
};

export default Navbar;
