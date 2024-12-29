import { Button } from "@/components/ui/aria-components/Button";
import { Separator } from "@/components/ui/aria-components/Separator";
import { Flex, Spinner } from "@radix-ui/themes";

const FormBottomBar = ({
    dirty,
    loading,
}: {
    dirty: boolean;
    loading: boolean;
}) => (
    <>
        <Flex style={{ marginTop: 20 }}>
            <Button
                type={'submit'}
                isDisabled={!dirty || loading}
                isPending={loading}>
                {loading ? <Spinner /> : 'Save changes'}
            </Button>
        </Flex>
    </>
);

export default FormBottomBar