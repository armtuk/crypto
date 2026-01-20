import type {FC} from "react";
import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {api} from "@alexrmturner/plexq-ts-api/dist/wsapi/Api";
import {BinanceAPI} from "@/binance/api";

import {
  Card,
} from "@/components/ui/card"
import {
  type ChartConfig,
} from "@/components/ui/chart"
import {ChartStack} from "@/chart/ChartStack";
import {ChartLineLayer, ChartPointLayer} from "@/chart/ChartLayer";
import {BasicLineGrapher, buildChartProps, CandleStickGrapher} from "@/chart/graphing/DrawOps";
import {ChartCandleStick} from "@/chart/model/graph";
import { Spinner } from "@/components/ui/spinner"

const chartConfig = {
  views: {
    label: "Page Views",
  },
  open: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  close: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export const BinanceChart: FC<UseQueryResult<{date: Date, open: number, high: number, low: number, close: number}[]>> = (props: UseQueryResult<{date: Date, open: number, high: number, low: number, close: number}[]>) => {
  const klines = props

  console.log("Klines",klines.data)

  const chartData = klines.isSuccess ? klines.data: []

  const size = {height: 800, width: 1200}

  if (chartData && chartData.length) {
    const chartProps = buildChartProps("Line", chartData.map(
      x => new ChartCandleStick(x.date.getTime(), x.open, x.close, x.low, x.high)
    ), size)

    console.log("Chart props", chartProps)

    const lineProps = {
      chartProps: chartProps,
      grapher: new BasicLineGrapher(chartProps),
      layerIndex: 1
    }

    const pointProps = {
      chartProps: chartProps,
      //grapher: new Point2DGrapherCircle(6),   new CandleStickGrapher(chartProps.scale, 6),
      grapher: new CandleStickGrapher(chartProps.scales, 4),
      layerIndex: 1
    }

    return <Card className="py-4 sm:py-0 h-full">
      <ChartStack size={size} showAxis={true}>
        <ChartLineLayer {...lineProps}/>
        <ChartPointLayer {...pointProps}/>
      </ChartStack>
    </Card>
  }
  else {
    return <Spinner/>
  }


}