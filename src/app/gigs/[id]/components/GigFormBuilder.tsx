import { Gig } from '@/utils/types';

import { FormBuilder } from '@/forms-builder/components/FormBuilder';


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
			formName={name as string}
		/>
	);
};

export default GigFormBuilder;
