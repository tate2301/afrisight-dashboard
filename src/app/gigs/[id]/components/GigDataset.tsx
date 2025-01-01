import {Paragraph} from '@/components/design-sytem/typography';
import {DataTable} from '@/components/ui/datatable';
import TableLink from '@/components/ui/datatable/Link';
import {useFormContext} from '@/forms-builder/context';
import {ColumnDef} from '@tanstack/react-table';
import {memo, useCallback, useMemo, useState} from 'react';
import {isEmail, isLink} from './utils';
import submissionsColumns from './tables/submissions';
import SubmissionsTableActions from './tables/SubmissionsTableActions';
import {Response} from './types';

const GigDataset = memo(
	({_id, responses}: {_id: string; responses: Response[]}) => {
		const {form} = useFormContext();
		const [selectedRows, setSelectedRows] = useState<Response[]>([]);

		const questionsAsColumns = useMemo(() => {
			if (!form?.fields) return [];

			return form.fields.map((question) => ({
				accessorKey: question.id,
				header: () => (
					<Paragraph className="line-clamp-1 font-medium">
						{question.label}
					</Paragraph>
				),
				cell: ({row}: {row: any}) => {
					const value = row.original[question.id] ?? '-';

					if (isLink(value) || isEmail(value)) {
						return (
							<TableLink
								style={{display: '-webkit-box'}}
								className="line-clamp-1 text-wrap truncate text-ellipsis inline-flex lowercase"
								href={isEmail(value) ? `mailto:${value}` : value}>
								{value}
							</TableLink>
						);
					}

					if (!isNaN(parseInt(value))) {
						return <Paragraph className="text-right w-full">{value}</Paragraph>;
					}

					return value;
				},
				size: 320,
			}));
		}, [form?.fields]);

		const columns = useMemo(
			() =>
				[...submissionsColumns, ...questionsAsColumns] as ColumnDef<
					Response,
					any
				>[],
			[questionsAsColumns],
		);

		const data = useMemo(
			() =>
				responses.map((doc: any) => ({
					_id: doc._id,
					email: doc.user.email,
					createdAt: doc.createdAt,
					user: doc.user,
					...doc.responses.reduce((acc: any, response: any) => {
						const question = form.fields.find(
							(field) => field.label === response.question,
						);

						if (!question) return acc;

						let value = response.value;
						switch (question.type) {
							case 'yesNo':
								value = eval(value) ? 'Yes' : 'No';
								break;
							case 'npsRating':
								value = value ? value : 'N/A';
								break;
							default:
								break;
						}

						return {
							...acc,
							[question.id]: value,
						};
					}, {}),
				})),
			[responses],
		);

		console.log({data, columns});

		const handleSelect = useCallback((rows: Response[]) => {
			setSelectedRows(rows);
		}, []);

		return (
			<DataTable
				top={0}
				columns={columns}
				data={data}
				selectedItems={selectedRows.map((item) => item._id)}
				onSelect={handleSelect}
				tableActions={
					<SubmissionsTableActions
						selectedItems={selectedRows}
						gigId={_id}
					/>
				}
			/>
		);
	},
);

GigDataset.displayName = 'GigSubmissions';

export default GigDataset;
