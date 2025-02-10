'use client';

import {useFormContext} from '@/forms-builder/context';
import {Button, DropdownMenu, Flex} from '@radix-ui/themes';
import {Save} from 'lucide-react';
import {FormBuilderHeaderProps} from './types';
import {Badge} from '@/components/ui/badge';
import {Separator} from '@/components/ui/aria-components/Separator';
import {useRouter} from 'next/navigation';
import {Caption} from '@/components/design-sytem/typography';
import Symbol from '@/components/icons/symbol';
import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import axiosInstance from '@/hooks/useApiFetcher';

const GigHeader = ({
	save,
	publish,
	isSaving,
	isPublishing,
	status,
	gig,
	responsesCount,
	pendingResponsesCount,
}: FormBuilderHeaderProps) => {
	const {form, exportForm} = useFormContext();
	const navigation = useRouter();
	const [showSavingMessage, setShowSavingMessage] = useState(false);
	const [showPublishedMessage, setShowPublishedMessage] = useState(false);
	const [isExporting, setIsExporting] = useState(false);

	const onSaveChanges = async () => {
		save(exportForm());
	};

	const onPublish = async () => {
		publish(form);
	};

	const onDownload = async (format: 'csv' | 'xlsx') => {
		setIsExporting(true);
		const url = `/admin/gigs/${gig._id}/responses/export-all?format=${format}`;
		const response = await axiosInstance.getAndReturnHeaders(
			url,
			// @ts-ignore
			{
				responseType: 'blob',
			},
		);

		const blob = new Blob([response.data], {
			type: response.headers['content-type'],
		});

		const serverFileName =
			response.headers['content-disposition']?.split('filename=')[1];

		const fileName =
			serverFileName?.replace(/["]/g, '') || `gig-responses.${format}`;

		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		return setIsExporting(false);
	};

	const onOpenInSheets = async () => {
		setIsExporting(true);
		const url = `/admin/gigs/${gig._id}/responses/export-all?exportTo=google-sheets`;
		const response = await axiosInstance.get(url);

		window.open(response.sheetUrl, '_blank');
		setIsExporting(false);
	};

	return (
		<div className="py-1.5 px-4 justify-between">
			<div className="flex justify-between mb-2 items-center">
				<div className="flex">
					<Button
						onClick={navigation.back}
						color="gray"
						variant="ghost">
						Back to Gigs
					</Button>
				</div>
				<div
					className="flex items-center justify-between"
					style={{gap: '8px'}}>
					<div className="flex gap-4">
						<ExportDropdown
							onDownload={onDownload}
							onOpenInSheets={onOpenInSheets}
							isExporting={isExporting}
						/>
						<Button
							variant="outline"
							color="gray"
							loading={isSaving}
							onClick={onSaveChanges}>
							<Symbol className="!text-base">download</Symbol>
							Save Form
						</Button>
						<Button
							color={
								status === 'DRAFT'
									? 'gray'
									: status === 'ACTIVE'
										? 'red'
										: 'gray'
							}
							loading={isPublishing}
							onClick={onPublish}>
							{status === 'ACTIVE' && <Symbol>pause</Symbol>}
							{status === 'DRAFT'
								? 'Enable submissions'
								: status === 'PAUSED'
									? 'Resume submissions'
									: 'Pause submissions'}
						</Button>
					</div>
				</div>
			</div>
			<Separator className="mb-2" />
			<div className="space-y-4">
				<div className="inline-flex items-center gap-2">
					<p className="text-xl font-medium tracking-snug capitalize text-content-primary">
						{gig.name}
					</p>
					<Badge
						style={{fontWeight: '500'}}
						color={
							status === 'DRAFT'
								? 'blue'
								: status === 'ACTIVE'
									? 'green'
									: 'red'
						}>
						{status}
					</Badge>
				</div>
				<div className="flex gap-10">
					<Stat
						name="Participants"
						value={responsesCount}
					/>
					<Stat
						name="Pending Submissions"
						value={pendingResponsesCount}
					/>
					<Stat
						name="Total Rewarded"
						value={`US $${Intl.NumberFormat().format((gig.rewardPolicy?.dollarValue ?? 0) * responsesCount)}`}
					/>
				</div>
			</div>
		</div>
	);
};

const ExportDropdown = ({
	onDownload,
	onOpenInSheets,
	isExporting = false,
}: {
	onDownload: (format: 'csv' | 'xlsx') => void;
	onOpenInSheets: () => void;
	isExporting: boolean;
}) => {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button
					variant="outline"
					color="gray">
					Export Dataset
					<DropdownMenu.TriggerIcon />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Item
					disabled={isExporting}
					onClick={() => onDownload('csv')}>
					<Symbol>csv</Symbol>
					Download CSV
				</DropdownMenu.Item>
				<DropdownMenu.Item
					disabled={isExporting}
					onClick={() => onDownload('xlsx')}>
					<Symbol>table</Symbol>
					Download XSLX
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					disabled={isExporting}
					onClick={onOpenInSheets}>
					<Symbol className="!text-base">arrow_outward</Symbol>
					Open in Google Sheets
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
};

const Stat = ({name, value}: {name: string; value: string | number}) => (
	<div className="border-2 border-surface-secondary py-2 px-4 rounded-xl">
		<Caption className="text-content-tertiary text-xs uppercase !font-medium">
			{name}
		</Caption>
		<p className="text-lg font-semibold text-content-primary tracking-tight">
			{value}
		</p>
	</div>
);

export default GigHeader;
