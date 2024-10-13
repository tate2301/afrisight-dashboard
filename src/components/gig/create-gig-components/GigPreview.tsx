import { Avatar } from '@radix-ui/themes';
import { Paragraph, Caption } from '@/components/design-sytem/typography';
import Image from 'next/image';
import Box from '@/components/design-sytem/box';
import Flex from '@/components/design-sytem/flex';

type GigPreviewProps = {
    clientsQuery: any;
    rewardPoliciesQuery: any;
    previewImage: string;
    formValues: any; // Add this prop
};

export const GigPreview = ({ clientsQuery, rewardPoliciesQuery, previewImage, formValues }: GigPreviewProps) => {
    const selectedClient = clientsQuery.data?.find(
        (client: any) => client.value === formValues.client
    );

    const selectedRewardPolicy = rewardPoliciesQuery.data?.find(
        (item: any) => item.value === formValues.rewardPolicy
    );

    return (
        <Box className="col-span-1 h-fit sticky top-[48px] space-y-4 py-8">
            {selectedClient?.data ? (
                <Flex alignItems="center" style={{ gap: '0.75rem' }}>
                    <Avatar
                        fallback={selectedClient.data.name[0]}
                        src={selectedClient.data.profilePic}
                    />
                    <Box>
                        <Paragraph weight="bold" color="primary">
                            {selectedClient.data.name || 'No name'}
                        </Paragraph>
                        <Caption>{selectedClient.data.email}</Caption>
                    </Box>
                </Flex>
            ) : (
                <ClientSkeleton />
            )}
            <Box
                css={{
                    backgroundColor: '$gray1',
                    borderRadius: 16,
                    height: 400,
                    overflow: 'hidden',
                    position: 'relative',
                }}
                className="pressable-shadow"
            >
                <Image src={previewImage} alt="Gig preview" layout="fill" objectFit="cover" />
            </Box>
            <Box>
                <Paragraph weight="bold" color="primary" className="mb-2">
                    {formValues.title || 'Gig Title'}
                </Paragraph>
                <Paragraph className="mb-2">
                    {formValues.description || 'Gig description will appear here.'}
                </Paragraph>
                <Flex>
                    {selectedRewardPolicy && (
                        <>
                            <Paragraph color="primary">
                                US$ {selectedRewardPolicy.data.dollarValue}
                            </Paragraph>
                            <Paragraph>&bull;</Paragraph>
                            <Paragraph color="primary">
                                {selectedRewardPolicy.data.pointsValue}XP
                                {selectedRewardPolicy.data.voucher && <> &bull; Plus Voucher</>}
                            </Paragraph>
                        </>
                    )}
                </Flex>
            </Box>
        </Box>
    );
};

const ClientSkeleton = () => (
    <Flex alignItems="center" style={{ gap: '0.75rem' }}>
        <Box css={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '$gray3' }} />
        <Box>
            <Box css={{ width: '100px', height: '1em', backgroundColor: '$gray3', marginBottom: '0.5em' }} />
            <Box css={{ width: '150px', height: '1em', backgroundColor: '$gray3' }} />
        </Box>
    </Flex>
);
