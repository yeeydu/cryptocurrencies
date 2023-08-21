import React, { useEffect, useState } from "react";
import axios from "axios";
import { Crypto } from "./Types";
import type { ChartData, ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import moment from "moment";
import CryptoSummaryCalc from "./CryptoSummaryCalc";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CalculateValues() {
  //                               Crypto[] Crypto type and Array or null
  const [cryptos, setCryptos] = useState<Crypto[] | null>(null);
  const [selected, setSelected] = useState<Crypto[]>([]);

  // charts variables
  const [data, setData] = useState<ChartData<"pie">>();

  // API GET ALl cryptos
  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en";
    axios.get(url).then((response) => {
      setCryptos(response.data);
    });
  }, []);

  // Pie data
  useEffect(() => {
    if (selected.length === 0) return;
    setData({
      labels: selected.map((s) => s.name),
      datasets: [
        {
          label: "# of Votes",
          data: selected.map((s) => s.owned * s.current_price),
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [selected]);

  //void if you know its not returning nothing
  function updateOwned(crypto: Crypto, amount: number): void {
    // copy selected as temporary
    let temp = [...selected];
    // verified selected crypto is the same as crypto.id
    let tempObj = temp.find((c) => c.id === crypto.id);
    // pass the amunt select to the temp object
    if (tempObj) {
      tempObj.owned = amount;
      setSelected(temp);
    }
  }

  const delete_coin = (crypto: Crypto)=> {
    let coin = [...selected];
    let tempObj = coin.find((c) => c.id === crypto.id);
    setSelected((coin) =>
      coin.filter((tempObj: { id: any }) => tempObj.id !== tempObj.id)
    );
  }

  return (
    <div className="container mt-4">
      <div className="row g-3">
        <p>
          Select Crypto currency and amount to calculate its values, you can add
          more by selecting another one.
        </p>
        <div className="col">
          <select
            className="form-select mb-2"
            onChange={(e) => {
              const coin = cryptos?.find(
                (x) => x.id === e.target.value
              ) as Crypto;
              setSelected([...selected, coin]);
            }}
            defaultValue="default"
          >
            <option>Choose option</option>
            {cryptos
              ? cryptos.map((crypto: Crypto) => {
                  return (
                    <option key={crypto.id} value={crypto.id}>
                      {crypto.name}
                    </option>
                  );
                })
              : null}
          </select>

          {selected.map((s) => {
            return (
              <CryptoSummaryCalc
                crypto={s}
                updateOwned={updateOwned}
                delete_coin={delete_coin}
              />
            );
          })}
          <div>
            <strong>
              {selected
                ? "Your portfolio value is: € " +
                  selected
                    .map((s) => {
                      if (isNaN(s.owned)) {
                        return 0;
                      }
                      return s.current_price * s.owned;
                    }) // reducer func to sum values
                    .reduce((prev, current) => {
                      return prev + current;
                    }, 0)
                    .toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                : null}
            </strong>
            {/* <div className=" m-1">
              <button
                className="btn btn-secondary btn-sm mb-1"
                onClick={()=> delete_coin}
              >
                Clear values
              </button> 
            </div> */}
          </div>
        </div>
        <div className="col">
          {/* {selected ? <CryptoSummaryCalc crypto={selected} /> : null} */}
          {/*render a line chart*/}
          {data ? (
            <div style={{ width: 500 }}>
              <Pie data={data} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
