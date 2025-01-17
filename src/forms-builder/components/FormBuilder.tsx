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
import { FormSettings } from './FormSettings';
import { Form } from '../types';
import { Tabs } from '@radix-ui/themes'; // Add this import
import Symbol from '@/components/icons/symbol';

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
	console.log({ form });
	const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
	const [activeTab, setActiveTab] = React.useState<'fields' | 'settings'>(
		'fields',
	);

	// Add dependency check to prevent infinite updates
	React.useEffect(() => {
		if (form.title !== formName || form.description !== formDescription) {
			updateForm({
				title: formName,
				description: formDescription,
			});
		}
	}, [formName, formDescription, form.title, form.description, updateForm]);

	const handlePreviewClick = () => {
		setIsPreviewModalOpen(true);
	};

	const handlePublish = () => {
		// Implement publish logic here
	};

	return (
		<Box
			css={{
				backgroundColor: '$gray1',
			}}
			className="overflow-hidden h-full">
			<Flex
				css={{ gap: 0 }}
				className="flex-1 divide-x divide-zinc-400/20 h-full">
				<aside className="w-1/4 bg-white overflow-y-auto pb-40">
					<Tabs.Root defaultValue="fields">
						<Tabs.List className="sticky top-0 bg-white border-b border-zinc-200 px-4 py-2">
							<Tabs.Trigger
								value="fields"
								className="flex items-center gap-2">
								<Symbol>view_list</Symbol>
								Fields
							</Tabs.Trigger>
							<Tabs.Trigger
								value="settings"
								className="flex items-center gap-2">
								<Symbol>settings</Symbol>
								Settings
							</Tabs.Trigger>
						</Tabs.List>

						<div className="py-4">
							<Tabs.Content value="fields">
								<FieldList />
							</Tabs.Content>
							<Tabs.Content value="settings">
								<FormSettings />
							</Tabs.Content>
						</div>
					</Tabs.Root>
				</aside>
				<main className="w-1/2 p-4 overflow-y-auto pb-40">
					<FormPreview />
				</main>
				<aside className="w-1/4 bg-white overflow-y-auto pb-40">
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
