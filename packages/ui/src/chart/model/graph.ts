export interface SpaceDimension {
  min: number
  max: number
}

export interface SpaceAxis {
  labelStep: number
  tickerStep: number
  drawLineAt: "zero" | "min" | "max" | "none"
  dim: SpaceDimension
  axisType: "number" | "date" | "discrete" | "epoch" | "epochMillis"
}

export interface ChartSpace2D {
  x: SpaceAxis
  y: SpaceAxis
}

export interface ChartPoint {
  values: [number, number, ...number[]]
}


export class ChartCandleStick implements ChartPoint {
  constructor(
    public timestamp: number,
    public open: number,
    public close: number,
    public low: number,
    public high: number,
    ) {}

  get values(): [number, number] {
    return [this.x, this.y]
  }

  get y() {
    return (this.open + this.close) / 2
  }

  get x(): number {
    return this.timestamp
  }
}

export interface ChartPointData<T extends ChartPoint> {
  data: T[]
}

export interface ChartLayer {
  name: string
  space: ChartSpace2D
}

export interface ChartSize2D {
  width: number
  height: number
}

export interface ChartScale {
  x: number
  y: number
}
