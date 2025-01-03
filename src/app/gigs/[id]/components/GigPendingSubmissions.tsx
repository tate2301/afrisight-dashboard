import { Paragraph } from '@/components/design-sytem/typography';
import { DataTable } from '@/components/ui/datatable';
import TableLink from '@/components/ui/datatable/Link';
import { useFormContext } from '@/forms-builder/context';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ColumnDef } from '@tanstack/react-table';
import { memo, useCallback, useMemo, useState } from 'react';
import { isEmail, isLink } from './utils';
import submissionsColumns from './tables/submissions';
import SubmissionsTableActions from './tables/SubmissionsTableActions';
import { Response } from './types';

const ImagePreview = ({ src }: { src: string }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popover
			open={isOpen}
			onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<button
					className="flex items-center gap-4 cursor-pointer"
					onMouseEnter={() => setIsOpen(true)}
					onMouseLeave={() => setIsOpen(false)}>
					<img
						src={src}
						alt="preview"
						className="w-8 h-8 object-cover rounded-lg"
					/>
					<TableLink
						style={{ display: '-webkit-box' }}
						target="_blank"
						className="line-clamp-1 text-wrap truncate text-ellipsis inline-flex lowercase"
						href={src}>
						{src}
					</TableLink>
				</button>
			</PopoverTrigger>
			<PopoverContent
				side="right"
				className="w-[200px] h-[200px] p-0"
				onMouseEnter={() => setIsOpen(true)}
				onMouseLeave={() => setIsOpen(false)}>
				<img
					src={src}
					alt="preview"
					className="w-full h-full object-cover rounded-xl"
				/>
			</PopoverContent>
		</Popover>
	);
};

const GigPendingSubmissions = memo(
	({ _id, responses }: { _id: string; responses: Response[] }) => {
		const { form } = useFormContext();
		const [selectedRows, setSelectedRows] = useState<Response[]>([]);

		const questionsAsColumns = useMemo(() => {
			if (!form?.fields) return [];

			return form.fields?.map((question) => ({
				accessorKey: question.id,
				header: () => (
					<Paragraph className="line-clamp-1 font-medium">
						{question.label}
					</Paragraph>
				),
				cell: ({ row }: { row: any }) => {
					const value = row.original[question.id] ?? '-';

					if (isEmail(value)) {
						return (
							<TableLink
								style={{ display: '-webkit-box' }}
								className="line-clamp-1 text-wrap truncate text-ellipsis inline-flex lowercase"
								href={isEmail(value) ? `mailto:${value}` : value}>
								{value}
							</TableLink>
						);
					}

					if (isLink(value)) {
						if (question.type === 'fileUpload') {
							return <ImagePreview src={value} />;
						}
						return (
							<TableLink
								style={{ display: '-webkit-box' }}
								className="line-clamp-1 text-wrap truncate text-ellipsis inline-flex lowercase"
								href={value}>
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
						const question = form.fields?.find(
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

GigPendingSubmissions.displayName = 'GigPendingSubmissions';

export default GigPendingSubmissions;
