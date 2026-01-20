import {APIProvider, Get} from "@alexrmturner/plexq-ts-api";
import {conf} from "../conf/application.conf";

export class BinanceApiProvider extends APIProvider {
  constructor() {
    super();
  }

  baseUrl = () => "http://localhost:5173/api" //https://data-api.binance.vision";

  authHeaders(): Headers {
    return new Headers({
      "x-mbx-apikey": conf.binance.apiKey
    });
  }

  baseParams() {
    return {}
  }

}

export const binanceProvider = new BinanceApiProvider()

export const BinanceAPI = {
  klines: (symbol: string, startTime: number, endTime: number, interval: string) => Get(binanceProvider, `/v3/klines?symbol=${symbol}&startTime=${startTime}&endTime=${endTime}&interval=${interval}`)
}