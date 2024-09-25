import Image from "next/image";
import Box from "../design-sytem/box";
import { Text } from "@radix-ui/themes";
import Flex from "../design-sytem/flex";

type StoreItem = {
    _id: string;
    title: string;
    totalSales: number;
    totalSupply: number;
    views: number;
    price: number;
    createdAt: string;
    status: "active" | "draft" | "archived";
}

export default function StoreItemCard({ title, totalSales, totalSupply, views, price, createdAt, status }: StoreItem) {
    return (
        <Box>
            <Box css={{ height: 320, width: 300, position: "relative", borderRadius: 16, overflow: "hidden", border: "1px solid $gray1", marginBottom: 16 }}>
                <Image src={"/store-placeholder.png"} alt="store item" fill />
            </Box>
            <Box>
                <Text weight={"medium"}>{title}</Text>
                <Flex>
                    <Text size={"2"}>
                        {totalSales} of {totalSupply} sold
                    </Text>
                    <Text>
                        &bull;
                    </Text>
                    <Text size={"2"}>
                        {views} views
                    </Text>
                </Flex>
                <Text weight={"bold"}>
                    {price} XP
                </Text>
            </Box>
        </Box>
    )
}