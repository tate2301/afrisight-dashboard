import apiClient from '@/hooks/useApiFetcher';
import {TeamMember} from '@/pages/users';
import {Button, Flex} from '@radix-ui/themes';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Row} from '@tanstack/react-table';
import {useCallback, useMemo} from 'react';
import ActionAlertDialog from '../modals/alert-modal';
import {LockFill} from '../icons/lock.fill';
import {SlashFill} from '../icons/slash.fill';
import {CheckFill} from '../icons/check.fill';

const UserActions = ({
	_id,
	status,
}: {
	_id: string;
	status: 'ACTIVE' | 'INACTIVE';
}) => {
	const queryClient = useQueryClient();

	const invalidateQueries = (_id: string) =>
		queryClient.invalidateQueries({queryKey: ['users']});

	const suspendMutation = useMutation({
		mutationKey: [_id, 'users'],
		mutationFn: async (data: any) => {
			await apiClient
				.delete(`/admin/user/${data._id}`)
				.then(() => invalidateQueries(_id));
		},
		onSuccess: () => {},
	});

	const resetPasswordMutation = useMutation({
		mutationKey: [_id, 'users'],
		mutationFn: async (data: any) => {
			await apiClient
				.post(`/admin/user/${data._id}/reset-password`)
				.then(() => invalidateQueries(_id));
		},
		onSuccess: () => {},
	});

	const enableAccountMutation = useMutation({
		mutationKey: [_id, 'users'],
		mutationFn: async (data: any) => {
			await apiClient
				.post(`/admin/user/${data._id}/enable`)
				.then(() => invalidateQueries(_id));
		},
		onSuccess: () => {
			invalidateQueries(_id);
		},
	});

	const suspendUser = useCallback(async () => {
		await suspendMutation.mutate({_id});
	}, [suspendMutation, _id]);

	const resetPassword = useCallback(async () => {
		await resetPasswordMutation.mutate({_id});
	}, [resetPasswordMutation, _id]);

	const enableAccount = useCallback(async () => {
		await enableAccountMutation.mutate({_id});
	}, [enableAccountMutation, _id]);

	return (
		<Flex gap="3">
			<ActionAlertDialog
				title="Reset password"
				description="A password reset email will be sent to the email address associated with this account. Please check inbox for the password reset email."
				actionLabel="Reset password"
				color="red"
				isLoading={resetPasswordMutation.isPending}
				trigger={
					<Button
						className="flex items-center gap-2 outline-none rounded-lg"
						color={'gray'}>
						<LockFill className="size-4" /> Reset password
					</Button>
				}
				callback={resetPassword}
			/>
			{status.toLowerCase() === 'active' && (
				<ActionAlertDialog
					title="Revoke access"
					actionLabel="Revoke access"
					description="This team member will immediately lose access to the CX Mappers platform. Are you sure you want to revoke access?"
					color="red"
					isLoading={suspendMutation.isPending}
					trigger={
						<Button
							className="flex items-center gap-2 outline-none rounded-lg"
							color={'red'}>
							<SlashFill className="size-4" /> Revoke access
						</Button>
					}
					callback={suspendUser}
				/>
			)}
			{status.toLowerCase() === 'inactive' && (
				<ActionAlertDialog
					title="Re-enable account"
					color={'green'}
					actionLabel="Re-enable account"
					description="This team member will immediately gain access to the CX Mappers platform. Are you sure you want to re-enable access?"
					isLoading={enableAccountMutation.isPending}
					trigger={
						<Button
							variant="solid"
							className="flex items-center gap-2 outline-none rounded-lg"
							color={'green'}>
							<CheckFill className="size-4" /> Enable account
						</Button>
					}
					callback={enableAccount}
				/>
			)}
		</Flex>
	);
};

export default UserActions;
