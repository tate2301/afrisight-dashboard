import { Caption, Paragraph } from "@/components/design-sytem/typography";
import { CheckFill } from "@/components/icons/check.fill";
import { Combobox, ComboboxItem } from "@/components/ui/combobox";
import { CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/strings";
import { Flex } from "@radix-ui/themes";

type RewardPolicyItem = {
    _id: string;
    name: string;
    dollarValue: number;
    pointsValue: number;
    voucher: string | null;
    createdAt: string;
};

export const RewardPoliciesCombobox = (props: {
    data: any[];
    form: any;
    value: string;
}) => {
    const renderRewardPolicyItem = (
        item: ComboboxItem<RewardPolicyItem>,
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
                <Flex
                    direction={'column'}
                    className="flex-1">
                    <Paragraph
                        className="truncate"
                        weight={'semibold'}
                        color={'primary'}>
                        {item.label}
                    </Paragraph>
                    <Caption>
                        ${item.data.dollarValue} &bull; {item.data.pointsValue} XP
                        {item.data.voucher && <> &bull; Includes voucher</>}
                    </Caption>
                    <Caption color="secondary">
                        Created: {formatDate(item.data.createdAt)}
                    </Caption>
                </Flex>
            </CommandItem>
        );
    };

    return (
        <Combobox<RewardPolicyItem>
            onChange={(value) => props.form.setFieldValue('rewardPolicy', value)}
            items={props.data}
            renderItem={renderRewardPolicyItem}
            placeholder="Select a reward policy"
            emptyMessage="No reward policies found"
            footerAction={null}
            value={props.value}
        />
    );
};
