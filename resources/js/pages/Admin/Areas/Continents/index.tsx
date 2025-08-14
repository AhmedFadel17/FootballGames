import EcommerceMetrics from "@/components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import PageMeta from "@/components/common/PageMeta";
import ContinentsTable from "./components/ContinentsTable";

export default function ContinentsPage() {
  return (
    <>
      <PageMeta
        title="Continents"
        description="This is Continents Admin Dashboard page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 p-4">
          <ContinentsTable />
        </div>
      </div>
    </>
  );
}
