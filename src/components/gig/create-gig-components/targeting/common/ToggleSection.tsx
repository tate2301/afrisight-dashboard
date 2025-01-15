import {Switch} from '@radix-ui/themes';

interface ToggleSectionProps {
	isEnabled: boolean;
	onChange: (enabled: boolean) => void;
}

export function ToggleSection({isEnabled, onChange}: ToggleSectionProps) {
	return (
		<Switch
			checked={isEnabled}
			onCheckedChange={onChange}
			highContrast
			size="2"
		/>
	);
}
