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
import { useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BingoGame from "./components/BingoGame";

export default function BingoPage() {
  const bingoIsActive = useSelector((state) => state.bingo.isActive);

  return (
    <>
      <PageMeta
        title="Bingo"
        description="This is the football bingo game"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <BingoGame isActive={bingoIsActive} />

        </div>

        <div className="col-span-12 xl:col-span-5">
          {!bingoIsActive &&
            <BingoMaker />
          }
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
