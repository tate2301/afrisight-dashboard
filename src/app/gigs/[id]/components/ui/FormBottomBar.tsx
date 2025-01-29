import { Button } from "@/components/ui/aria-components/Button";
import { Flex } from "@radix-ui/themes";

interface FormBottomBarProps {
    dirty: boolean;
    loading: boolean;
    isDisabled?: boolean;
}

const FormBottomBar = ({ dirty, loading, isDisabled }: FormBottomBarProps) => {
    return (
        <div className="flex justify-end gap-4 pt-4">
            <Button
                type="submit"
                isDisabled={isDisabled || loading}
                isPending={loading}
            >
                Save Changes
            </Button>
        </div>
    );
};

export default FormBottomBar;