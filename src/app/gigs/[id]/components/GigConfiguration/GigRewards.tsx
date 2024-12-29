import { H3 } from "@/components/design-sytem/typography";

import { Section } from "@radix-ui/themes";

import { Tabs } from "@radix-ui/themes";
import { RewardPolicyValues, TabProps } from "../types";
import RewardPolicyAtom from "./atoms/RewardPolicy";
import FormBottomBar from "../ui/FormBottomBar";
import { TabPanel } from "@/components/ui/aria-components/Tabs";
import { Separator } from "@/components/ui/aria-components/Separator";
import FormIslandCard from "./atoms/FormIslandCard";
import Symbol from "@/components/icons/symbol";

const GigRewardPolicyConfig = ({
    isPending,
    formik,
    gig,
}: TabProps & RewardPolicyValues) => {
    console.log({ gig: gig.rewardPolicy })
    return (
        <form className="block" onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-2 mb-4">
                <H3
                    weight={'semibold'}
                    className="mb-0"
                    color={'primary'}>
                    Reward Policy
                </H3>
                <p className="text-content-secondary">Set up how rewards are given to participants.</p>
            </div>
            <Separator className="mb-8" />
            <div className="mb-8">
                <h3 className="font-semibold mb-4">
                    Active Reward Policy
                </h3>
                <div className="p-4 rounded-xl bg-surface-secondary select-shadow">
                    <p className="text-base font-medium mb-1">
                        {gig.rewardPolicy?.name}
                    </p>
                    <p className="text-content-tertiary mb-4">
                        {gig.rewardPolicy?.description}
                    </p>

                    <div className="flex gap-8">
                        <p className="text-base font-bold px-2 py-1 rounded-lg bg-surface-quaternary items-center inline-flex">
                            <Symbol className="!text-base mr-2">
                                payments
                            </Symbol>{" "}{Intl.NumberFormat("en-us", { currency: "USD", currencySign: "accounting", style: "currency" }).format(gig.rewardPolicy?.dollarValue ?? 0)}
                        </p>
                        <p className="text-base font-bold px-2 py-1 rounded-lg bg-surface-quaternary items-center inline-flex">
                            <Symbol className="!text-base mr-2">
                                kid_star
                            </Symbol>{" "} {gig.rewardPolicy?.pointsValue} points
                        </p>
                    </div>

                </div>
            </div>
            <Separator className="mb-8" />
            <FormIslandCard title="Change reward policy" description="Set a new reward policy for this gig" comment="Changes will take effect immediately" formik={formik}>
                <RewardPolicyAtom
                    gig={gig}
                    formik={formik}
                />
            </FormIslandCard>

        </form>
    );
};

export default GigRewardPolicyConfig