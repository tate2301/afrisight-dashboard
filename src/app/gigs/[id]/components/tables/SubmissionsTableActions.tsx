import {
    StarIcon,
    TrashIcon,
    CheckIcon,
    XMarkIcon,
    ArrowDownTrayIcon
} from "@heroicons/react/24/outline"
import { Response } from "../types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosClientInstance from "@/helpers/server/auth/axiosClientInstance"
import { toast } from "sonner"
import { Button } from "@/components/ui/aria-components/Button"
import { Separator } from "@/components/ui/aria-components/Separator"

interface TableActionsProps {
    selectedItems: Response[]
    gigId: string
}

type ActionVariant = 'primary' | 'secondary' | 'destructive' | 'ghost'

type Action = {
    label: string
    icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>
    onClick: () => void
    variant: ActionVariant
}

type SeparatorAction = {
    type: 'separator'
}

type ActionItem = Action | SeparatorAction

function SubmissionsTableActions({ selectedItems, gigId }: TableActionsProps) {
    const queryClient = useQueryClient()
    const hasSelectedItems = selectedItems.length > 0

    const { mutate: handleAction, isPending } = useMutation({
        mutationFn: async ({ action, ids }: { action: string; ids: string[] }) => {
            return await axiosClientInstance.post(`/admin/gigs/${gigId}/responses/bulk`, {
                action,
                ids
            })
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['responses', gigId] })
            const actionMessages = {
                approve: 'Submissions approved successfully',
                reject: 'Submissions rejected successfully',
                delete: 'Submissions deleted successfully',
                star: 'Submissions starred successfully'
            }
            toast.success(actionMessages[variables.action as keyof typeof actionMessages] || 'Action completed successfully')
        },
        onError: () => {
            toast.error('Failed to update submissions')
        }
    })

    const actions: ActionItem[] = [
        {
            label: 'Approve',
            icon: CheckIcon,
            onClick: () => handleAction({
                action: 'approve',
                ids: selectedItems.map(item => item._id)
            }),
            variant: 'primary'
        },
        {
            label: 'Reject',
            icon: XMarkIcon,
            onClick: () => handleAction({
                action: 'reject',
                ids: selectedItems.map(item => item._id)
            }),
            variant: 'destructive'
        },
        {
            label: 'Delete',
            icon: TrashIcon,
            onClick: () => handleAction({
                action: 'delete',
                ids: selectedItems.map(item => item._id)
            }),
            variant: 'destructive'
        },
        {
            type: 'separator'
        },
        {
            label: 'Star',
            icon: StarIcon,
            onClick: () => handleAction({
                action: 'star',
                ids: selectedItems.map(item => item._id)
            }),
            variant: 'secondary'
        },
        {
            label: 'Export',
            icon: ArrowDownTrayIcon,
            onClick: () => {
                // Implement export logic
                console.log('Export', selectedItems)
            },
            variant: 'secondary'
        }
    ]

    if (!hasSelectedItems) return null

    return (
        <div className="flex items-center gap-2">
            {actions.map((action, index) => {
                if ('type' in action && action.type === 'separator') {
                    return <Separator key={`separator-${index}`} orientation="vertical" className="h-8" />
                }

                const buttonAction = action as Action
                return (
                    <Button
                        key={index}
                        onPress={buttonAction.onClick}
                        variant={buttonAction.variant}
                        className="gap-2"
                        isDisabled={isPending}
                    >
                        <buttonAction.icon className={`h-4 w-4 ${isPending ? 'animate-pulse' : ''}`} />
                        {buttonAction.label}
                    </Button>
                )
            })}
        </div>
    )
}

export default SubmissionsTableActions 