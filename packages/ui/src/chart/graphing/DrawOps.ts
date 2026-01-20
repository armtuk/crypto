import {ChartPointLayerProps, ChartProps} from "@/chart/ChartLayer";
import {ChartCandleStick, ChartPoint, ChartScale, ChartSize2D, SpaceDimension} from "../model/graph";

export interface PointGrapher<T extends ChartPoint> {
  graph(c: CanvasRenderingContext2D, datum: T): void
}

export interface LineGrapher<T extends ChartPoint> {
  graph(c: CanvasRenderingContext2D, datumA: T, datumB: T): void
}

export interface AxisGrapherProps<T extends ChartPoint> {
  position: "left" | "right" | "top" | "bottom";
}

export abstract class AxisGrapher<T extends ChartPoint> {
  constructor(protected axisProps: AxisGrapherProps<T>) {}

  abstract graph(c: CanvasRenderingContext2D): void
}


export class Point2DGrapherCircle implements PointGrapher<ChartPoint> {
  constructor(private circleSize: number) {
  }

  graph(c: CanvasRenderingContext2D, datum: ChartPoint): void {
    c.beginPath();
    c.arc(0, 0, this.circleSize, 0, 2 * Math.PI);
    c.resetTransform()
    c.stroke();
  }
}

export class CandleStickGrapher implements PointGrapher<ChartCandleStick> {
  constructor(private scales: number[], private width: number) {
}

  graph(c: CanvasRenderingContext2D, datum: ChartCandleStick): void {
    console.log("candlestick", datum)
    const midY = (datum.open + datum.close) / 2
    const yScale = this.scales[1]!

    if (datum.open > datum.close) {
      c.strokeStyle = "green"
      c.fillStyle = "green"
    }
    else {
      c.strokeStyle = "darkred"
      c.fillStyle = "red"
    }

    c.beginPath()
    c.rect(-this.width, (datum.open - midY) * yScale, this.width * 2, (datum.close - midY) * yScale)
    c.fill()

    c.beginPath()
    c.moveTo(0, (datum.low - midY) * yScale)
    c.lineTo(0, (datum.high - midY) * yScale)
    c.stroke()
    c.resetTransform()
  }
}

export class BasicLineGrapher<T extends ChartPoint> implements LineGrapher<T> {
  constructor(private props: ChartProps<T>) {}

  graph(c: CanvasRenderingContext2D, datumA: T, datumB: T): void {
    const start = project2DPoint(this.props, datumA)
    const end = project2DPoint(this.props, datumB)
    c.beginPath()
    c.moveTo(start.values[0], start.values[1])
    c.lineTo(end.values[0], end.values[1])
    c.resetTransform()
    c.stroke()
  }
}
export type Grapher<T extends ChartPoint> = LineGrapher<T> | PointGrapher<T>

export const buildChartProps = <T extends ChartPoint>(name: string, data: T[], size: ChartSize2D): ChartProps<T> => {
  if (!data[0]) throw new Error("Emtpy data")
  const dimensions = data[0]!.values.map((_, i) => {
    const min = data.reduce((min, datum) => Math.min(min, datum.values[i]!), Infinity)
    const max = data.reduce((max, datum) => Math.max(max, datum.values[i]!), -Infinity)
    return {min, max} as SpaceDimension
  }) as [SpaceDimension, SpaceDimension]

  const scaleX = size.width / (dimensions[0]!.max - dimensions[0]!.min)
  const scaleY = size.height / (dimensions[1]!.max - dimensions[1]!.min)

  return {
    name,
    size,
    dimensions: dimensions,
    scales: [scaleX, scaleY],
    data,
  }
}

export const project2DPoint = <T extends ChartPoint>(props: ChartProps<T>, p: ChartPoint): ChartPoint => {
  return {values: [
    props.scales[0] * (p.values[0] - props.dimensions[0].min),
    props.scales[1] * (p.values[1] - props.dimensions[1].min),
  ]}
}