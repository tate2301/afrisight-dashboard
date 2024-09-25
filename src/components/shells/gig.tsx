import { H3 } from "../design-sytem/typography";
import { CreateSurvey } from "../add/survey";
import Separator from "../design-sytem/separator";
import SearchBox from "../search/Search";
import Flex from "../design-sytem/flex";
import { IconButton, Section, TabNav, Text } from "@radix-ui/themes";
import SelectWithOptions from "../filter-button";
import { ChevronRight } from "../icons/chevron.right";
import { ChevronLeft } from "../icons/chevron.left";
import Link from "next/link";
import { GigShellProps } from ".";
import { useRouter } from "next/router";
import { useCallback } from "react";
import Box from "../design-sytem/box";



export default function PageWithTableShell({ children, fetchSurveys, total, currentPage, pageSize, tabs, activeTab, title }: GigShellProps) {
    const router = useRouter();
    const handleTabChange = useCallback((tab: string) => {
        const currentQuery = new URLSearchParams(window.location.search);
        currentQuery.set('tab', tab.toLowerCase().replaceAll(" ", "-"));

        router.push({
            query: {
                tab: currentQuery.get('tab')
            }
        })
    }, [router]);

    return (
        <Box>
            <Flex className="flex flex-row items-start justify-between px-4">
                <H3>
                    {title}
                </H3>
                <CreateSurvey callback={fetchSurveys} />
            </Flex>
            <TabNav.Root>
                {tabs.map((tab) => (
                    <TabNav.Link
                        active={activeTab === tab.toLowerCase().replaceAll(" ", "-")}
                        onClick={() => handleTabChange(tab)}>
                        {tab}
                    </TabNav.Link>
                ))}

            </TabNav.Root>
            <Flex css={{ padding: "8px 12px", }} justifyContent={"between"} alignItems={"center"}>
                <SearchBox />
                <Flex css={{ gap: 8 }} alignItems={"center"}>
                    <SelectWithOptions options={["Date created", "Questions", "Responses"]} label="Sort by" />
                    <Text className="mr-4">{currentPage} - {pageSize} of {total}</Text>
                    <IconButton variant="ghost">
                        <ChevronLeft />
                    </IconButton>
                    <IconButton variant="ghost">
                        <ChevronRight />
                    </IconButton>
                </Flex>
            </Flex>
            <Separator css={{ backgroundColor: "$gray2" }} />
            {children}
        </Box>
    )
}