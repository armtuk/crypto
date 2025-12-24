import {ChartPoint2D} from "./model/graph";
import {useEffect} from "react";
import {PointGrapher} from "./graphing/DrawOps";

export interface ChartLayerProps<T extends ChartPoint2D> {
  name: string
  size: {
    width: number
    height: number
  }
  data: T[]
  grapher: PointGrapher<T>
}

export const ChartPointLayer: React.FC = <T extends ChartPoint2D,>(props: ChartLayerProps<T>) => {

  useEffect(() => {
    const canvas = document.getElementById(props.name) as HTMLCanvasElement
    const c2d = canvas?.getContext('2d')
    props.data.map(e => {
      c2d.translate(e.x, e.y)
      props.grapher.graph(c2d, e)
      c2d.resetTransform()
    })
  }, []);

  return <canvas id={props.name} width={props.size.width} height={props.size.height}>
  </canvas>
}
export const ChartLineLayer: React.FC = <T extends ChartPoint2D,>(props: ChartLayerProps<T>) => {

  useEffect(() => {
    const canvas = document.getElementById(props.name) as HTMLCanvasElement
    const c2d = canvas?.getContext('2d')
    props.data.map(e => {
      c2d.translate(e.x, e.y)
      props.grapher.graph(c2d, e)
      c2d.resetTransform()
    })
  }, []);

  return <canvas id={props.name} width={props.size.width} height={props.size.height}>
  </canvas>
}
