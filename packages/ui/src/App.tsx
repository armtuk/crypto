import './App.css'
import {QueryClientProvider, QueryClient, useQuery} from "@tanstack/react-query";
import {TestChart} from "./TestChart";
import {BinanceChart} from "@/BinanceChart";
import {api} from "@alexrmturner/plexq-ts-api/dist/wsapi/Api";
import {BinanceAPI} from "@/binance/api";

function App() {
  const klines = useQuery({
    queryFn: (): Promise<{date: Date, open: number, high: number, low: number, close: number}[]> => {
      const now = Date.now()
      return api<any[][]>(BinanceAPI.klines("SOLUSDT", now - 36000 * 1000, now, "5m"))
        .then(x => x.data.map(kline => ({
            date: new Date(kline[0]!),
            open: parseFloat(kline[1]!),
            high: parseFloat(kline[2]!),
            low: parseFloat(kline[3]!),
            close: parseFloat(kline[4]!)
          }))
        )
    },
    queryKey: ["binance-ticker-sol"],
    staleTime: 5000,
  })

  return (
    <>
      <div style={{width: "1200px", height: "800px"}}>
        <BinanceChart {...klines}/>
      </div>
    </>
  )
}

export default App
