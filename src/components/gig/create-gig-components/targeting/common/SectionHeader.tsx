import { Caption } from '@/components/design-sytem/typography';

interface SectionHeaderProps {
    title: string;
    description: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
    return (
        <div className="border-b pb-2">
            <h2 className="text-lg font-medium text-zinc-900">{title}</h2>
            <Caption className="text-zinc-900/80">{description}</Caption>
        </div>
    );
} 