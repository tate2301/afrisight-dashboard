import React, { useState } from 'react';
import { FormProvider, useFormContext } from '../context';
import { FormPreview } from './FormPreview';
import { FieldList } from './FieldList';
import { FieldProperties } from './FieldProperties';
import Box from '@/components/design-sytem/box';
import Flex from '@/components/design-sytem/flex';
import Separator from '@/components/design-sytem/separator';
import { FormBuilderHeader } from './FormBuilderHeader';
import { FullscreenPreviewModal } from './FullscreenPreviewModal';
import { Form } from '../types';

interface FormBuilderProps {
	gig_id: string;
	formName: string;
	formDescription: string;
	initialForm?: Form;
}

export function FormBuilderPresenter({
	gig_id,
	formName,
	formDescription,
}: FormBuilderProps) {
	const { form, updateForm, selectedFieldId } = useFormContext();
	const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

	// Add dependency check to prevent infinite updates
	React.useEffect(() => {
		if (form.title !== formName || form.description !== formDescription) {
			updateForm({ title: formName, description: formDescription });
		}
	}, [formName, formDescription]);

	const handlePreviewClick = () => {
		setIsPreviewModalOpen(true);
	};

	const handlePublish = () => {
		// Implement publish logic here
	};

	return (
		<Box
			css={{
				height: `calc(100vh - 52px)`,
				backgroundColor: '$gray1',
			}}
			className="flex flex-col">
			<Flex
				css={{ gap: 0 }}
				className="flex-1 overflow-y-auto divide-x divide-zinc-400/20">
				<aside className="w-1/4 bg-white py-4 overflow-y-auto">
					<FieldList />
				</aside>
				<main className="w-1/2 p-4 overflow-y-auto">
					<FormPreview />
				</main>
				<aside className="w-1/4 bg-white overflow-y-auto">
					{selectedFieldId && (
						<div className="p-4">
							<FieldProperties />
						</div>
					)}
				</aside>
			</Flex>
			<FullscreenPreviewModal
				isOpen={isPreviewModalOpen}
				onClose={() => setIsPreviewModalOpen(false)}
				form={form}
			/>
		</Box>
	);
}

export function FormBuilder(props: FormBuilderProps) {
	return <FormBuilderPresenter {...props} />;
}
