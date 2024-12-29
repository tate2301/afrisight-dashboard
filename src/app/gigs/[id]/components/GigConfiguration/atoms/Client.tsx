import { ClientSelection } from "@/components/gig/create-gig-components/ClientSelection";
import apiClient from "@/hooks/useApiFetcher";
import useDisclosure from "@/hooks/useDisclosure";
import { Gig } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

const ClientAtom = ({ formik, gig }: { formik: any; gig: Gig }) => {
    const { onOpen: openAddClientModal } = useDisclosure();

    const clientsQuery = useQuery({
        queryKey: ['clients'],
        queryFn: async () => {
            const res = await apiClient.get('/admin/client');
            return res.docs.map((doc: any) => ({
                data: {
                    name: doc.firstname,
                    email: doc.user.email,
                    profilePic: doc.profilePic,
                    _id: doc.user._id,
                },
                label: doc.firstname,
                value: doc.user._id,
            }));
        },
    });
    return (
        <ClientSelection
            clientsQuery={clientsQuery}
            formik={formik}
            openAddClientModal={openAddClientModal}
        />
    );
};

export default ClientAtom