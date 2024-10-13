import { Caption, Paragraph } from "@/components/design-sytem/typography";
import { CheckFill } from "@/components/icons/check.fill";
import { Combobox, ComboboxItem } from "@/components/ui/combobox";
import { CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/strings";
import { Avatar, Box, Flex } from "@radix-ui/themes";

type ClientItem = {
    _id: string;
    name: string;
    email: string;
    profilePic: string;
};

export const ClientsCombobox = (props: {
    data: any[];
    form: any;
    value: string;
}) => {
    const renderVoucherItem = (
        item: ComboboxItem<ClientItem>,
        isSelected: boolean,
        handleSelect: (value: string) => void,
    ) => {
        return (
            <CommandItem
                onSelect={handleSelect}
                key={item.value}
                value={item.value}
                className="flex">
                <CheckFill
                    className={cn(
                        'mr-2 h-4 w-4',
                        isSelected ? 'opacity-100' : 'opacity-0',
                    )}
                />
                <Flex align={'center'}>
                    <Box className="relative">
                        <Avatar
                            fallback={item.data.email.substring(0, 1)}
                            src={item.data.profilePic}
                            className="mr-4 rounded-full"
                            style={{ height: 48, width: 48 }}
                        />
                    </Box>
                    <Flex
                        direction={'column'}
                        justify={'between'}
                        className="flex-1">
                        <Paragraph className="truncate">{item.label}</Paragraph>
                        <Caption>{item.data.email}</Caption>
                    </Flex>
                </Flex>
            </CommandItem>
        );
    };

    return (
        <Combobox<ClientItem>
            onChange={(value) => props.form.setFieldValue('client', value)}
            items={props.data}
            renderItem={renderVoucherItem}
            placeholder="Select a client"
            emptyMessage="No clients found"
            footerAction={null}
            value={props.value}
        />
    );
};
