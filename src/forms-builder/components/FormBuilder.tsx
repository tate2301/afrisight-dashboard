import React from 'react';
import { FormProvider, useFormContext } from '../context';
import { FormPreview } from './FormPreview';
import { FieldList } from './FieldList';
import { FieldProperties } from './FieldProperties';
import { FormSettings } from './FieldSettings';
import Box from '@/components/design-sytem/box';
import Flex from '@/components/design-sytem/flex';
import Separator from '@/components/design-sytem/separator';
import Button from '@/components/design-sytem/button';
import { EyeFill } from '@/components/icons/eye.fill';

export function FormBuilderPresenter({ gig_id }: { gig_id: string }) {
    const { form } = useFormContext();

    return (
        <Box css={{
            height: `calc(100vh - 48px - 48px)`,
            backgroundColor: "$gray1"
        }} className="flex flex-col">
            <Flex justifyContent={"between"} css={{ height: 48, backgroundColor: "$white" }}>
                <Flex></Flex>
                <Flex alignItems={"center"} className='px-4' css={{ gap: "8px" }}>
                    <Button variant={"outline"} colorScheme={"surface"}>
                        <EyeFill className='size-4' />
                        Preview
                    </Button>
                    <Button>
                        Publish changes
                    </Button>
                </Flex>
            </Flex>
            <Separator />
            <Flex css={{ gap: 0 }} className='flex-1 overflow-y-auto'>
                <aside className="w-1/4 bg-white py-4 overflow-y-auto">
                    <FieldList />
                </aside>
                <main className="w-1/2 p-4 overflow-y-auto">
                    <FormPreview />
                </main>
                <aside className="w-1/4 bg-white p-4 overflow-y-auto">
                    <div className="mb-8">
                        <FormSettings />
                    </div>
                    <FieldProperties />
                </aside>
            </Flex>
        </Box>
    );
}

export function FormBuilder({ gig_id }: { gig_id: string }) {
    return (
        <FormBuilderPresenter gig_id={gig_id} />
    )
}