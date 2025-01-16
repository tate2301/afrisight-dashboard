import { Button } from "@/components/ui/aria-components/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import FormBottomBar from "../../ui/FormBottomBar";
import { Separator } from "@/components/ui/aria-components/Separator";

type FormIslandCardProps = {
    title: string;
    description?: string;
    comment?: ReactNode;
    children: ReactNode;
    formik: any;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function FormIslandCard({
    title,
    description,
    children,
    formik,
    comment,
    onSubmit
}: FormIslandCardProps) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(e);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
                <Separator />
                <CardFooter className="flex items-end justify-between h-full overflow-y-auto">
                    <div className="flex-1 text-content-tertiary">
                        {comment}
                    </div>
                    <FormBottomBar
                        dirty={formik.dirty}
                        loading={formik.isSubmitting || formik.isValidating}
                        isDisabled={!formik.dirty || !formik.isValid}
                    />
                </CardFooter>
            </Card>
        </form>
    );
}