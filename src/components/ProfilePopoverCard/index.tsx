import { Profile, ProfileType, User } from "@/utils/types";
import { Avatar, Badge, Popover, Text } from "@radix-ui/themes";
import { ReactNode } from "react";
import { Button, OverlayArrow, Tooltip, TooltipTrigger } from "react-aria-components";

export default function ProfilePopoverCard(props: User & { profile: Profile, children: ReactNode }) {
    return (

        <>
            <TooltipTrigger>
                <Button>
                    {props.children}
                </Button>
                <Tooltip className={"bg-white p-4 rounded-xl w-[320px] shadow-xl border border-zinc-400/5"}>
                    <OverlayArrow>
                        <svg width={8} height={8} viewBox="0 0 8 8">
                            <path d="M0 0 L4 4 L8 0" />
                        </svg>
                    </OverlayArrow>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 justify-between">
                            <Avatar
                                size={'3'}
                                radius="full"
                                fallback={props.email.substring(0, 1)}
                                src={props.profile.profilePic}
                                alt={'Profile picture'}
                            />
                            <Badge>
                                {props.profile.profileType}
                            </Badge>
                        </div>
                        <div className="flex flex-col gap-1 text-zinc-900">
                            <h3 className="font-bold text-lg">
                                {props.profile.firstname} {props.profile.surname}
                            </h3>
                            <Text>
                                {props.email}
                            </Text>
                        </div>

                    </div>
                </Tooltip>
            </TooltipTrigger>

        </>
    )
}