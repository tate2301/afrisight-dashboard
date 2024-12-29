import { Paragraph } from "@/components/design-sytem/typography";
import { DataTable } from "@/components/ui/datatable";
import TableLink from "@/components/ui/datatable/Link";
import { useFormContext } from "@/forms-builder/context";
import { ColumnDef } from "@tanstack/react-table";
import { Tabs } from "@radix-ui/themes";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useMemo } from "react";
import { isEmail } from "./utils";
import { isLink } from "./utils";
import submissionsColumns from "./tables/submissions";
import axiosClientInstance from "@/helpers/server/auth/axiosClientInstance";
import SubmissionsTableActions from './tables/SubmissionsTableActions'
import { Response } from "./types";

const GigSubmissions = ({ _id }: { _id: string }) => {
    const [columns, setColumns] =
        useState<ColumnDef<any, any>[]>(submissionsColumns);
    const { form } = useFormContext();
    const [selectedRows, setSelectedRows] = useState<Response[]>([])

    const gigResponses = useQuery({
        queryKey: ['responses', _id],
        queryFn: async () => {
            const res = await axiosClientInstance.get(`/admin/gigs/${_id}/responses`);
            return res.data.docs;
        },
        enabled: !!_id,
        placeholderData: keepPreviousData,
    });

    const questionsAsColumns = useMemo(() => {
        if (!form) return [];
        const questions = form.fields ?? [];
        return questions.map((question) => ({
            accessorKey: question.id,
            header: () => <Paragraph className="line-clamp-1 font-medium">{question.label}</Paragraph>,
            cell: ({ row }: any) => {
                const value = row.original[question.id] ?? '-';

                if (isLink(value) || isEmail(value)) {
                    return (
                        <TableLink
                            style={{ display: '-webkit-box' }}
                            className="line-clamp-1 text-wrap truncate text-ellipsis inline-flex lowercase"
                            href={isEmail(value) ? `mailto:${value}` : value}>
                            {value}
                        </TableLink>
                    );
                }

                if (!isNaN(parseInt(value))) {
                    return <Paragraph className={'text-right w-full'}>{value}</Paragraph>;
                }

                return value;
            },
            size: 320,
        }));
    }, [form]);

    useEffect(() => {
        const newColumns = [...submissionsColumns, ...questionsAsColumns];
        setColumns(newColumns);
    }, [questionsAsColumns]);

    const data = useMemo(() => {
        const docs = gigResponses?.data ?? [];
        return docs.map((doc: any) => {
            const baseData = {
                _id: doc._id,
                email: doc.user.email,
                createdAt: doc.createdAt,
                user: doc.user
            };
            const responses = doc.responses.reduce((acc: any, response: any) => {
                acc[response.question] = response.value;
                return acc;
            }, {});
            return { ...baseData, ...responses };
        });
    }, [gigResponses]);

    const handleSelect = (rows: Response[]) => {
        setSelectedRows(rows)
    }

    return (
        <DataTable
            top={0}
            columns={columns as ColumnDef<Response, any>[]}
            data={data}
            selectedItems={selectedRows.map(item => item._id)}
            onSelect={handleSelect}
            tableActions={
                <SubmissionsTableActions
                    selectedItems={selectedRows}
                    gigId={_id}
                />
            }
        />
    );
};

export default GigSubmissions