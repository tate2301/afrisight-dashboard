import { Button } from "@/components/ui/aria-components/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import FormBottomBar from "../../ui/FormBottomBar";
import { Separator } from "@/components/ui/aria-components/Separator";

type FormIslandCardProps = {
    title: string
    description?: string
    comment?: ReactNode
    children: ReactNode
    formik: any
}

export default function FormIslandCard({ title, description, children, formik, comment }: FormIslandCardProps) {
    return (
        <form onSubmit={formik.handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>
                        {title}
                    </CardTitle>
                    <CardDescription>
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
                <Separator />
                <CardFooter className="flex items-end justify-between ">
                    <div className="flex-1 text-content-tertiary">
                        {comment}
                    </div>
                    <FormBottomBar
                        dirty={formik.dirty}
                        loading={formik.isSubmitting}
                    />
                </CardFooter>
            </Card>
        </form>
    )
}