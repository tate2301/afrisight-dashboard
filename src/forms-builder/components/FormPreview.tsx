import { useFormContext } from '../context';
import { renderField } from '../utils/fieldRenderer';
import { H2, Paragraph } from '@/components/design-sytem/typography';
import Box from '@/components/design-sytem/box';

export function FormPreview() {
	const { form, selectedFieldId } = useFormContext();

	return (
		<div className="p-6 rounded min-h-full">
			<H2 className="tracking-tight mb-2">{form.title}</H2>
			{form.description && (
				<Paragraph className="mb-6">{form.description}</Paragraph>
			)}
			<form className='pb-64'>
				{form.fields.map((field) => (
					<Box
						key={field.id}
						css={{
							marginBottom: '16px',
							padding: '16px',
							borderRadius: '12px',
							backgroundColor:
								field.id === selectedFieldId ? '$white' : '$white',
							transition: 'all 0.2s ease-in-out',
							boxShadow:
								field.id === selectedFieldId
									? 'var(--pressable-shadow)'
									: 'none',
						}}>
						{renderField(field)}
					</Box>
				))}
			</form>
		</div>
	);
}
