import React from 'react';
import { Paragraph, Caption } from '@/components/design-sytem/typography';
import { Card } from '@/components/ui/card';
import { CameraIcon } from '@heroicons/react/24/outline';

interface GigCoverImageProps {
    handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    coverImage: File | null;
}

export const GigCoverImage: React.FC<GigCoverImageProps> = ({
    handleImageChange,
    coverImage,
}) => {
    return (
        <div>
            <Paragraph weight={'semibold'}>Cover image</Paragraph>
            <Card
                className="py-4 relative z-0 cursor-pointer"
                style={{
                    minWidth: 400,
                    maxWidth: 512,
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    zIndex: 0,
                }}
            >
                <CameraIcon className="size-4" />
                <Paragraph weight={'medium'} className="flex items-center gap-2">
                    Click to select an image
                </Paragraph>
                <Caption color={'tertiary'}>
                    Only image files are supported. (PNG, JPG, JPEG)
                </Caption>
            </Card>
            <input
                id="coverImage"
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
            {coverImage && (
                <Caption className='mt-2' color={'tertiary'} weight={"bold"}>
                    {coverImage.name}
                </Caption>
            )}
        </div>
    );
};