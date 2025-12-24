import './App.css'
import {BinanceChart} from "@/BinanceChart.tsx";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";

const queryClient = new QueryClient()

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
      <div style={{width: "1200px", height: "1000px"}}>
        <BinanceChart/>
      </div>
      </QueryClientProvider>
    </>
  )
}

export default App
