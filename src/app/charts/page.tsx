import { PieChartCard } from "../sidebar/components/pie-chart-card";
import { LineChartCard } from "../sidebar/components/line-chart-card";
import { BarChartCard } from "../sidebar/components/bar-chart-card";
import { AreaChartCard } from "../sidebar/components/area-chart-card";
import { HorizontalBarChartCard } from "../sidebar/components/horizontal-bar-chart-card";
import { ComposedChartCard } from "../sidebar/components/composed-chart-card";

export default function ChartsPage() {
  return (
    <div className="p-8">
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
