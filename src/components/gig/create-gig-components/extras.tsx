import styled from '@/components/design-sytem/theme';
import {Caption} from '@/components/design-sytem/typography';
import {TextField} from '@/components/ui/aria-components/TextField';

export const ErrorMessage = styled(Caption, {
	color: '$danger',
	marginTop: '4px',
});

export const TextInput = styled(TextField, {
	maxWidth: 512,
});
