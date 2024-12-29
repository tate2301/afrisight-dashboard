import { H3 } from "@/components/design-sytem/typography";


import { RewardPolicyValues, TabProps } from "../types";
import FormBottomBar from "../ui/FormBottomBar";
import ClientAtom from "./atoms/Client";
import FormIslandCard from "./atoms/FormIslandCard";

const GigClientConfig = ({
    isPending,
    formik,
    gig,
}: TabProps & RewardPolicyValues) => {
    return (
        <FormIslandCard formik={formik} title="Client" description="Used to identify the client who owns the gig">
            <ClientAtom
                gig={gig}
                formik={formik}
            />

        </FormIslandCard>
    );
};

export default GigClientConfig