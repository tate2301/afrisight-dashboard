import { Caption, Paragraph } from '@/components/design-sytem/typography';
import { CheckFill } from '@/components/icons/check.fill';
import Symbol from '@/components/icons/symbol';
import { Separator } from '@/components/ui/aria-components/Separator';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/strings';
import { Flex } from '@radix-ui/themes';

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
            <>
                <CommandItem
                    onSelect={handleSelect}
                    key={item.value}
                    value={item.value}
                    className="flex rounded-none">
                    <Symbol
                        className={cn(
                            'mr-2 h-4 w-4',
                            isSelected ? 'opacity-100' : 'opacity-0',
                        )}
                    >
                        check
                    </Symbol>
                    <Flex
                        direction={'column'}
                        className="flex-1">
                        <div className="flex items-baseline justify-between">
                            <p
                                className="truncate font-semibold mb-1"
                                color={'primary'}>
                                {item.label}
                            </p>
                            <p className="text-content-tertiary">
                                {formatDate(item.data.createdAt)}
                            </p>
                        </div>
                        <div className="flex gap-2 items-baseline">
                            <span className="text-content-tertiary">${item.data.dollarValue}</span>{' '}
                            <span>&bull;</span>
                            <span className="text-content-tertiary">{item.data.pointsValue} XP</span>
                            {item.data.voucher && (
                                <>
                                    {' '}
                                    <span className="text-content-tertiary">&bull;</span>{' '}
                                    <span className="text-content-tertiary">Includes voucher</span>
                                </>
                            )}
                        </div>
                    </Flex>
                </CommandItem>
                <Separator />
            </>
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
