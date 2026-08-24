import EcommerceMetrics from "@/components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import PageMeta from "@/components/common/PageMeta";
import BingoGrid from "./components/BingoGrid";
import BingoSelector from "./components/BingoSelector";
import BingoMaker from "./components/BingoMaker";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import BingoGame from "./components/BingoGame";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";

export default function BingoPage() {
  const bingoIsActive = useAppSelector((state) => state.bingo.isActive);
  return (
    <>
      <PageMeta
        title="Bingo"
        description="This is the football bingo game"
      />
      <div className="flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs items={[
            { label: 'Home', path: '/dashboard' },
            { label: 'Bingo' }
          ]} />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Live"
              titlePrefix="Bingo"
              gradientText=" Game"
              description="Configure your high-stakes bingo card. Predict match events and dominate the leaderboard."
            />

          </div>
        </div>
        {bingoIsActive ?
          <BingoGame isActive={bingoIsActive} />
          :
          <BingoMaker />
        }



      </div>

    </>
  );
}
