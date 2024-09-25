import { useGetCurrentTabFromQuery } from "@/components/shells";
import PageWithTableShell from "@/components/shells/gig";
import StoreItemCard from "@/components/store-item-card";
import { DataTable } from "@/components/ui/datatable";
import GeneralLayout from "@/layout/GeneralLayout";
import { Button, Checkbox, Flex, Grid } from "@radix-ui/themes";
import { ColumnDef } from "@tanstack/react-table";

const tabs = ["All", "Active", "Drafts", "Archived"];



export default function Store() {
  const currentTab = useGetCurrentTabFromQuery(tabs);
  return (
    <GeneralLayout>
      <PageWithTableShell title="In-App Store" activeTab={currentTab} tabs={tabs} total={0} currentPage={1} pageSize={10} fetchSurveys={() => Promise.resolve()}>
        <Grid columns={{ initial: "1", sm: "2", md: "3", lg: "4" }} gap={"3"} className="p-4">
          <StoreItemCard
            _id="1"
            title="Item 1"
            totalSales={100}
            totalSupply={100}
            views={100}
            price={100}
            createdAt="2024-02-02"
            status="active"
          />
        </Grid>
      </PageWithTableShell>
    </GeneralLayout>
  )
}