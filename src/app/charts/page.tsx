import { PieChartCard } from "./components/pie-chart-card";
import { LineChartCard } from "./components/line-chart-card";
import { BarChartCard } from "./components/bar-chart-card";
import { AreaChartCard } from "./components/area-chart-card";
import { HorizontalBarChartCard } from "./components/horizontal-bar-chart-card";
import { ComposedChartCard } from "./components/composed-chart-card";
import { BackToHomepage } from "@/components/back-to-homepage";

export default function ChartsPage() {
  return (
    <div className="p-8">
      <BackToHomepage />
      <h1 className="font-bold font-merriweather text-3xl mb-8">
        Dashboard
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <PieChartCard />
        <LineChartCard />
        <BarChartCard />
        <AreaChartCard />
        <HorizontalBarChartCard />
        <ComposedChartCard />
      </div>
    </div>
  )
}
