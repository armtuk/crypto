import {ChartPoint, ChartSize2D, SpaceAxis, SpaceDimension} from "./model/graph";
import {useContext, useEffect, useId, useRef} from "react";
import {AxisGrapher, LineGrapher, PointGrapher} from "./graphing/DrawOps";
import {ChartStackContext} from "./ChartStackContext";

export interface ChartProps<T extends ChartPoint> {
  name: string
  size: ChartSize2D
  scales: [number, number]
  dimensions: [SpaceDimension, SpaceDimension]
  data: T[]
}

export interface ChartPointLayerProps<T extends ChartPoint> {
  chartProps: ChartProps<T>
  grapher: PointGrapher<T>
  layerIndex: number
}

export interface ChartLineLayerProps<T extends ChartPoint> {
  chartProps: ChartProps<T>
  grapher: LineGrapher<T>
  layerIndex: number
}

export interface ChartAxisLayerProps<T extends ChartPoint> {
  chartProps: ChartProps<T>
  grapher: AxisGrapher<T>
  layerIndex: number
}

export type ChartLayerProps<T extends ChartPoint> = ChartPointLayerProps<T> | ChartLineLayerProps<T> | ChartAxisLayerProps<T>;

export const ChartPointLayer = <T extends ChartPoint,>(props: ChartPointLayerProps<T>) => {
  useEffect(() => {
    const chart = props.chartProps
    const canvas = document.getElementById(props.chartProps.name) as HTMLCanvasElement
    const c2d = canvas?.getContext('2d')
    if (c2d) {
      chart.data.map(e => {
        c2d.translate(chart.dimensions[0].min, chart.dimensions[1].min)
        c2d.translate(e.values[0] * chart.scales[0], e.values[1] * chart.scales[1])
        props.grapher.graph(c2d, e)
        c2d.resetTransform()
      })
    }
  }, [props]);

  return <canvas id={props.chartProps.name} width={props.chartProps.size.width} height={props.chartProps.size.height} className="absolute">
  </canvas>
}

export function ChartLineLayer<T extends ChartPoint,>(props: ChartLineLayerProps<T>) {
  const { size, showAxis } = useContext(ChartStackContext)

  useEffect(() => {
    const chart = props.chartProps
    const canvas = document.getElementById(chart.name) as HTMLCanvasElement
    const c2d = canvas?.getContext('2d')
    if (c2d) {
      chart.data.map((e, i) => {
        const nextE = chart.data[i + 1]
        c2d.strokeStyle="grey"
        if (nextE) {
          c2d.translate(chart.dimensions[0].min, chart.dimensions[1].min)
          props.grapher.graph(c2d, e, nextE)
          c2d.resetTransform()
        }
      })
    }
  }, [props]);

  const axis: SpaceAxis = {
    labelStep: (props.chartProps.dimensions[0].max - props.chartProps.dimensions[0].max) / 10,
    tickerStep: (props.chartProps.dimensions[0].max - props.chartProps.dimensions[0].max) / 40,
    drawLineAt: "min",
    dim: {min: props.chartProps.dimensions[0].min, max: props.chartProps.dimensions[0].max},
    axisType: "epoch"
  } as SpaceAxis

  return <>
      <canvas id={props.chartProps.name} width={size.width} height={size.height} className="absolute"></canvas>
    {showAxis && (<ChartAxis orientation="vertical" scale={props.chartProps.scales[0]} axis={axis}></ChartAxis>)}
    </>
}


export interface ChartAxisProps {
  axis: SpaceAxis
  orientation: "horizontal" | "vertical"
  scale: number
}

const AXIS_PADDING = 40
const TICK_LENGTH = 6
const LABEL_FONT_SIZE = 12

function formatAxisLabel(value: number, axisType: SpaceAxis["axisType"]): string {
  switch (axisType) {
    case "date":
    case "epoch":
      return new Date(value * 1000).toLocaleDateString()
    case "epochMillis":
      return new Date(value).toLocaleTimeString()
    case "number":
    case "discrete":
    default:
      return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
}

export function ChartAxis(props: ChartAxisProps) {
  const { size } = useContext(ChartStackContext)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasId = useId()
  const { axis, orientation, scale } = props
  const { dim, labelStep, tickerStep, drawLineAt } = axis

  const isHorizontal = orientation === "horizontal"
  const canvasWidth = isHorizontal ? size.width : (AXIS_PADDING + TICK_LENGTH)
  const canvasHeight = isHorizontal ? (AXIS_PADDING + TICK_LENGTH): size.height

  const getAxisLinePosition = (): number => {
    const range = dim.max - dim.min
    switch (drawLineAt) {
      case "zero":
        if (dim.min < 0 && dim.max > 0) {
          return isHorizontal
            ? canvasHeight - AXIS_PADDING
            : (0 - dim.min) * scale
        }
        return isHorizontal ? canvasHeight - AXIS_PADDING : AXIS_PADDING
      case "min":
        return isHorizontal ? canvasHeight - AXIS_PADDING : AXIS_PADDING
      case "max":
        return isHorizontal ? AXIS_PADDING : canvasWidth - AXIS_PADDING
      case "none":
      default:
        return -1
    }
  }

  const getCanvasPosition = (): React.CSSProperties => {
    switch (drawLineAt) {
      case "zero":
        if (dim.min < 0 && dim.max > 0) {
          const zeroPos = (0 - dim.min) * scale
          return isHorizontal
            ? { top: zeroPos - AXIS_PADDING, left: 0 }
            : { top: 0, left: zeroPos - ( TICK_LENGTH + AXIS_PADDING ) }
        }
        return isHorizontal ? { bottom: 0, left: 0 } : { top: 0, left: 0 }
      case "min":
        return isHorizontal ? { bottom: 0, left: 0 } : { top: 0, left: 0 }
      case "max":
        return isHorizontal ? { top: 0, left: 0 } : { top: 0, right: 0 }
      case "none":
      default:
        return { display: "none" }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    //ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "grey"
    ctx.fillStyle = "grey"
    ctx.font = `${LABEL_FONT_SIZE}px sans-serif`
    ctx.lineWidth = 1

    const linePos = getAxisLinePosition()
    if (linePos < 0) return

    const drawAxisLine = (linePos: number, length: number) => {
      ctx.beginPath()
      if (isHorizontal) {
        ctx.moveTo(0, linePos)
        ctx.lineTo(length, linePos)
      }
      else {
        ctx.moveTo(linePos, 0)
        ctx.lineTo(linePos, length)
      }
      ctx.stroke()
    }

    const drawAxisTick = (linePos: number, length: number) => {
      ctx.beginPath()
      if (isHorizontal) {
        ctx.moveTo( linePos, -length / 2)
        ctx.lineTo(linePos, length / 2)
      }
      else {
        ctx.moveTo( -length / 2, linePos)
        ctx.lineTo(length / 2, linePos)
      }
      ctx.stroke()
    }

    for (let value = dim.min; value <= dim.max; value += tickerStep) {
      ctx.resetTransform()
      if (isHorizontal) {
        ctx.translate(value, 0)
      } else {
        ctx.translate(0, value)
      }
      drawAxisTick(value, TICK_LENGTH)
    }

    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    for (let value = dim.min; value <= dim.max; value += labelStep) {
      const incPos = (value - dim.min) * scale
      const label = formatAxisLabel(value, axis.axisType)
      isHorizontal ? ctx.fillText(label, incPos, linePos + AXIS_PADDING) : ctx.fillText(label, linePos + AXIS_PADDING, incPos)
    }
  }, [axis, orientation, scale, size])

  return (
    <canvas
      ref={canvasRef}
      id={canvasId}
      width={canvasWidth}
      height={canvasHeight}
      className="absolute"
      style={getCanvasPosition()}
    />
  )
}

export type ChartLayer = <T extends ChartPoint>(props: ChartPointLayerProps<T>) => React.ReactNode