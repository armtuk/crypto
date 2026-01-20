import {ChartStack} from "@/chart/ChartStack";
import {ChartLineLayer, ChartPointLayer} from "@/chart/ChartLayer";
import {BasicLineGrapher, buildChartProps, Point2DGrapherCircle} from "@/chart/graphing/DrawOps";
import {ChartPoint} from "@/chart/model/graph";

export const TestChart: React.FC = () => {
  console.log("TestChart");
  const testData: ChartPoint[] = [
    {values: [0, 0]},
    {values: [1, 1]},
    {values: [2, 0]},
    {values: [3, 3]},
    {values: [4, -1]},
    {values: [5, 2]},
  ]

  const size = {width: 1200, height: 800};

  const pointsProps = {
    chartProps: buildChartProps("Points", testData, size),
    grapher: new Point2DGrapherCircle(3),
    layerIndex: 2
  }

  const chartProps = buildChartProps("Line", testData, size)
  console.log("scale", chartProps.scales[0])
  const lineProps = {
    chartProps: chartProps,
    grapher: new BasicLineGrapher(chartProps),
    layerIndex: 1
  }

  return <ChartStack showAxis={true} size={{width: 1200, height: 800}}>
    <ChartLineLayer {...lineProps}/>
    <ChartPointLayer {...pointsProps}/>
  </ChartStack>
}