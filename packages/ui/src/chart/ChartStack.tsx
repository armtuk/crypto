import {ChartSize2D} from "./model/graph";
import {PropsWithChildren} from "react";
import {ChartStackContext} from "@/chart/ChartStackContext";

export interface ChartStackProps {
  size: ChartSize2D
  showAxis: boolean
}

export const ChartStack: React.FC<PropsWithChildren<ChartStackProps>> = (props) => {
  console.log("ChartStack")

  const childSize = () => {
    return props.size
  }

  return <div className="relative">
    <ChartStackContext value={{size: childSize(), showAxis: props.showAxis}}>
      {props.children}
    </ChartStackContext>
  </div>
}