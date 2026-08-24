import EcommerceMetrics from "@/components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import PageMeta from "@/components/common/PageMeta";
import GamesList from "./components/GamesList";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";

export default function Home() {
  return (
    <>
      <PageMeta title="Games" description="This is Football Games page" />

      <div className="flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs items={[
            { label: 'Home' },
          ]} />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Dashboard"
              titlePrefix="Football"
              gradientText=" Games"
              description=""
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <GamesList />
        </div>
        <div className="col-span-12 space-y-6 xl:col-span-7">
        </div>

        <div className="col-span-12 xl:col-span-5">
        </div>

        <div className="col-span-12">
        </div>

        <div className="col-span-12 xl:col-span-5">
        </div>

        <div className="col-span-12 xl:col-span-7">
        </div>
      </div>
    </>
  );
}
