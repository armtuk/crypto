import { createContext } from 'react'
import {ChartSize2D} from "@/chart/model/graph";

interface ChartStackContextProps {
  size: ChartSize2D
}

const defaultChartStackContext = {
  size: {
    width: 1200,
    height: 900,
  },
  showAxis: true
}

export const ChartStackContext = createContext(defaultChartStackContext)