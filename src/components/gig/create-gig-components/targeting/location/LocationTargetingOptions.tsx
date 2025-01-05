import { cn } from '@/lib/utils';

interface LocationTargetingOptionsProps {
    title: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
    icon: string;
}

export function LocationTargetingOptions({
    title,
    description,
    isSelected,
    onClick,
    icon,
}: LocationTargetingOptionsProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'relative p-4 text-left transition-all',
                'rounded-lg border-2',
                'hover:border-teal-500/50 hover:shadow-md',
                isSelected
                    ? 'border-teal-500 bg-teal-50/50'
                    : 'border-zinc-200 bg-white',
            )}>
            <div className="space-y-4">
                <span className={'material-symbols-rounded text-teal-600 text-3xl'}>
                    {icon}
                </span>
                <div className="space-y-1">
                    <p className="font-medium text-zinc-900">{title}</p>
                    <p className="text-sm text-zinc-600 line-clamp-4">{description}</p>
                </div>
            </div>
        </button>
    );
} 