import { H3 } from "@/components/design-sytem/typography";
import { RewardPolicyValues, TabProps } from "../types";
import FormIslandCard from "./atoms/FormIslandCard";
import ClientAtom from "./atoms/Client";

const GigClientConfig = ({
    _id,
    isPending,
    formik,
    gig,
    updateGigMutation,
}: TabProps & RewardPolicyValues) => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formik.isValid) {
            try {
                await updateGigMutation.mutateAsync({
                    client: formik.values.client,
                });
            } catch (error) {
                console.error('Submit error:', error);
            }
        }
    };

    return (
        <FormIslandCard
            formik={formik}
            title="Client"
            description="Used to identify the client who owns the gig"
            onSubmit={handleSubmit}
        >
            <ClientAtom
                gig={gig}
                formik={formik}
            />
        </FormIslandCard>
    );
};

export default GigClientConfig;