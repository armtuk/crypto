import {ChartCandleStick, ChartPoint2D} from "../model/graph";

export interface PointGrapher<T extends ChartPoint2D> {
  graph(c: CanvasRenderingContext2D, datum: T): void
}

export interface LineGrapher<T extends ChartPoint2D> {
  graph(c: CanvasRenderingContext2D, datumA: T, datumB: T): void
}


export class Point2DGrapherCircle implements PointGrapher<ChartPoint2D> {
  constructor(private circleSize: number) {
  }

  graph(c: CanvasRenderingContext2D, datum: ChartPoint2D): void {
    c.beginPath();
    c.arc(0, 0, this.circleSize, 0, 2 * Math.PI);
    c.stroke();
  }
}

export class CandleStickGrapher implements PointGrapher<ChartCandleStick> {
  constructor(private width: number) {
  }

  graph(c: CanvasRenderingContext2D, datum: ChartCandleStick): void {
    const midY = (datum.open + datum.close) / 2

    c.beginPath()
    c.rect(-this.width,datum.open - midY, this.width, datum.close - midY)
    c.fill()

    c.beginPath()
    c.moveTo(0, datum.low- midY)
    c.lineTo(0, datum.high - midY)
    c.stroke()
  }
}

export class BasicLineGrapher implements LineGrapher<ChartPoint2D> {
  graph(c: CanvasRenderingContext2D, datumA: ChartPoint2D, datumB: ChartPoint2D): void {
    c.beginPath()
    c.moveTo(0, 0)
    c.lineTo(datumB.x, datumB.y)
    c.stroke()
  }
}