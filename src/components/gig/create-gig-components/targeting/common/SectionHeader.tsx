import { Caption } from '@/components/design-sytem/typography';
import { ToggleSection } from './ToggleSection';

interface SectionHeaderProps {
    title: string;
    description: string;
    isEnabled: boolean;
    onChange: () => void;
}

export function SectionHeader({ title, description, isEnabled, onChange }: SectionHeaderProps) {
    return (
        <div className="pb-2 flex justify-between items-center">
            <div>
            <h2 className="text-lg font-medium text-zinc-900">{title}</h2>
            <Caption className="text-zinc-900/80">{description}</Caption>

            </div>
            <ToggleSection
						isEnabled={isEnabled}
						onChange={onChange}
					/>
        </div>
    );
} 