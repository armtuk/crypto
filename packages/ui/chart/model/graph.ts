export interface SpaceDimension {
  min: number
  max: number
}
export interface SpaceAxis {
  labelStep: number
  tickerStep: number
  drawLineAt: "zero" | "min" | "max" | "none"
  dim: SpaceDimension
}

export interface ChartSpace2D {
  x: SpaceAxis
  y: SpaceAxis
}

export interface ChartPoint2D {
  x: number
  y: number
}

export interface ChartPoint3D extends ChartPoint2D {
  x: number
  y: number
  z: number
}

export class ChartCandleStick implements ChartPoint2D {
  constructor(
    public timestamp: number,
    public open: number,
    public close: number,
    public high: number,
    public low: number,
    ) {}

  get x(): number {
    return (this.open + this.close) / 2
  }

  get y(): number {
    return this.timestamp
  }
}

export interface ChartPointData<T extends ChartPoint2D> {
  data: T[]
}

export interface ChartLayer {
  name: string
  space: ChartSpace2D
}