import { Gig } from "@/utils/types";

import { FormBuilder } from "@/forms-builder/components/FormBuilder";

import { Tabs } from "@radix-ui/themes";
import { TabPanel } from "@/components/ui/aria-components/Tabs";

const GigFormBuilder = ({
    _id,
    name,
    description,
    form,
}: { _id: string } & Pick<Gig, 'description' | 'name' | 'form'>) => {
    return (
        <FormBuilder
            gig_id={_id}
            formDescription={description}
            formName={name}
        />
    );
};


export default GigFormBuilder