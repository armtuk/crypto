import type {FC} from "react";
import {useQuery} from "@tanstack/react-query";
import {api} from "@alexrmturner/plexq-ts-api/dist/wsapi/Api";
import {BinanceAPI} from "@/binance/api.ts";
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

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

export const BinanceChart: FC = () => {
  const klines = useQuery({
    queryFn: (): Promise<{date: Date, open: number, high: number, low: number, close: number}[]> => {
      const now = Date.now()
      return api<number[][]>(BinanceAPI.klines("SOLUSDT", now - 86400000, now, "5m"))
        .then(x => x.data.map(kline => ({
            date: new Date(kline[0]),
            open: kline[1],
            high: kline[2],
            low: kline[3],
            close: kline[4]
          }))
        )
    },
    queryKey: ["binance-ticker-sol"],
    staleTime: 5000,
  })

  console.log("Klines",klines.data)

  const chartData = klines.isSuccess ? klines.data: []

  return <Card className="py-4 sm:py-0 h-full">
    <CardContent className="px-2 sm:p-6 h-full">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-full w-full"
      >
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false}/>
          <YAxis dataKey="open">
          </YAxis>
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }}
          />
          <Line
            dataKey="open"
            type="natural"
            stroke={`var(--color-open)`}
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="close"
            type="natural"
            stroke={`var(--color-close)`}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </CardContent>
  </Card>

}