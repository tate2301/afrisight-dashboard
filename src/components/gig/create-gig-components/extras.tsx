import styled from '@/components/design-sytem/theme';
import {Caption} from '@/components/design-sytem/typography';
import {TextField} from '@radix-ui/themes';

export const ErrorMessage = styled(Caption, {
	color: '$danger',
	marginTop: '4px',
});

export const TextInput = styled(TextField.Root, {
	maxWidth: 512,
});
