'use client';

import {useFormContext} from '@/forms-builder/context';
import {Flex} from '@radix-ui/themes';
import {Save} from 'lucide-react';
import {FormBuilderHeaderProps} from './types';
import {Button} from '@/components/ui/aria-components/Button';
import {Badge} from '@/components/ui/badge';
import {Separator} from '@/components/ui/aria-components/Separator';
import {useRouter} from 'next/navigation';
import {Caption} from '@/components/design-sytem/typography';
import Symbol from '@/components/icons/symbol';

const GigHeader = ({
	save,
	publish,
	isSaving,
	isPublishing,
	status,
	gig,
}: FormBuilderHeaderProps) => {
	const {form, exportForm} = useFormContext();
	const onSaveChanges = () => save(exportForm());
	const onPublish = () => publish(form);
	const navigation = useRouter();
	return (
		<div className="py-1.5 px-4 justify-between">
			<div className="flex justify-between mb-2">
				<div className="flex">
					<Button
						onPress={navigation.back}
						variant="ghost">
						Back to Gigs
					</Button>
				</div>
				<div
					className="flex items-center justify-between"
					style={{gap: '8px'}}>
					<div className="flex gap-4">
						<Button
							variant="secondary"
							isPending={isSaving}
							onPress={onSaveChanges}>
							Open in Radar
							<span className="material-symbols-rounded text-xs">
								north_east
							</span>
						</Button>
						<Separator orientation="vertical" />
						<Button
							variant={
								status === 'DRAFT'
									? 'secondary'
									: status === 'ACTIVE'
										? 'destructive'
										: 'secondary'
							}
							isPending={isPublishing}
							onPress={onPublish}>
							{status === 'ACTIVE' && <Symbol>pause</Symbol>}
							{status === 'DRAFT'
								? 'Enable submissions'
								: status === 'PAUSED'
									? 'Resume submissions'
									: 'Pause submissions'}
						</Button>
						<Button
							variant="primary"
							isPending={isSaving}
							onPress={onSaveChanges}>
							Publish
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
						value={gig.gig_submissions.length}
					/>
					<Stat
						name="Pending Submissions"
						value={gig.gig_submissions.length}
					/>
					<Stat
						name="Total Rewarded"
						value={`US $${Intl.NumberFormat().format((gig.rewardPolicy?.dollarValue ?? 0) * gig.gig_submissions.length)}`}
					/>
				</div>
			</div>
		</div>
	);
};

const Stat = ({name, value}: {name: string; value: string | number}) => (
	<div className="border-2 border-surface-secondary py-2 px-4 rounded-xl">
		<Caption className="text-content-tertiary text-xs uppercase !font-medium">
			{name}
		</Caption>
		<p className="text-lg font-bold text-content-primary tracking-tight">
			{value}
		</p>
	</div>
);

export default GigHeader;
