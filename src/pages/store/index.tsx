import {useGetCurrentTabFromQuery} from '@/components/shells';
import TablePageHeader from '@/components/shells/TablePageHeader';
import StoreItemCard from '@/components/store-item-card';
import {DataTable} from '@/components/ui/datatable';
import GeneralLayout from '@/layout/GeneralLayout';
import {Button, Checkbox, Flex, Grid} from '@radix-ui/themes';
import {ColumnDef} from '@tanstack/react-table';

const tabs = ['All', 'Active', 'Drafts', 'Archived'];

export default function Store() {
	const currentTab = useGetCurrentTabFromQuery(tabs);
	return (
		<GeneralLayout>
			<></>
		</GeneralLayout>
	);
}
