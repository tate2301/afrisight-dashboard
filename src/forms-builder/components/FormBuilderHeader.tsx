import React from 'react';
import Flex from '@/components/design-sytem/flex';
import Button from '@/components/design-sytem/button';
import { EyeFill } from '@/components/icons/eye.fill';

interface FormBuilderHeaderProps {
    onPreviewClick: () => void;
    onPublishClick: () => void;
}

export function FormBuilderHeader({ onPreviewClick, onPublishClick }: FormBuilderHeaderProps) {
    return (
        <Flex justifyContent="between" css={{ height: 48, backgroundColor: "$white", padding: "0 16px" }}>
            <Flex alignItems="center">
                {/* Add any left-side content here, e.g., form title */}
            </Flex>
            <Flex alignItems="center" css={{ gap: "8px" }}>
                <Button variant="outline" colorScheme="surface" onClick={onPreviewClick}>
                    <EyeFill className='size-4' />
                    Preview
                </Button>
                <Button onClick={onPublishClick}>
                    Publish changes
                </Button>
            </Flex>
        </Flex>
    );
}