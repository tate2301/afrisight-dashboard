import {
	StarIcon,
	TrashIcon,
	CheckIcon,
	XMarkIcon,
	ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import {Response} from '../types';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import axiosClientInstance from '@/helpers/server/auth/axiosClientInstance';
import {toast} from 'sonner';
import {Button} from '@/components/ui/aria-components/Button';
import {Separator} from '@/components/ui/aria-components/Separator';
import {
	ResponseAction,
	ResponseActionItem,
	ResponseTableActionsProps,
} from './types';

function DatasetTableActions({
	selectedItems,
	gigId,
}: ResponseTableActionsProps) {
	const queryClient = useQueryClient();
	const hasSelectedItems = selectedItems.length > 0;

	const {mutate: handleAction, isPending} = useMutation({
		mutationFn: async ({action, ids}: {action: string; ids: string[]}) => {
			return await axiosClientInstance.post(
				`/admin/gigs/${gigId}/responses/bulk`,
				{
					action,
					ids,
				},
			);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({queryKey: ['responses', gigId]});
			const actionMessages = {
				approve: 'Submissions approved successfully',
				reject: 'Submissions rejected successfully',
				delete: 'Submissions deleted successfully',
				star: 'Submissions starred successfully',
			};
			toast.success(
				actionMessages[variables.action as keyof typeof actionMessages] ||
					'Action completed successfully',
			);
		},
		onError: () => {
			toast.error('Failed to update submissions');
		},
	});

	const actions: ResponseActionItem[] = [
		{
			label: 'Delete',
			icon: TrashIcon,
			onClick: () =>
				handleAction({
					action: 'delete',
					ids: selectedItems.map((item) => item._id),
				}),
			variant: 'destructive',
		},
		{
			type: 'separator',
		},
		{
			label: 'Export',
			icon: ArrowDownTrayIcon,
			onClick: () => {
				// Implement export logic
				console.log('Export', selectedItems);
			},
			variant: 'secondary',
		},
	];

	if (!hasSelectedItems) return null;

	return (
		<div className="flex items-center gap-2">
			{actions.map((action, index) => {
				if ('type' in action && action.type === 'separator') {
					return (
						<Separator
							key={`separator-${index}`}
							orientation="vertical"
							className="h-8"
						/>
					);
				}

				const buttonAction = action as ResponseAction;
				return (
					<Button
						key={index}
						onPress={buttonAction.onClick}
						variant={buttonAction.variant}
						className="gap-2"
						isDisabled={isPending}>
						<buttonAction.icon
							className={`h-4 w-4 ${isPending ? 'animate-pulse' : ''}`}
						/>
						{buttonAction.label}
					</Button>
				);
			})}
		</div>
	);
}

export default DatasetTableActions;
