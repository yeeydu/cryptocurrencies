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
} from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment";
import CryptoSummaryCalc from "./CryptoSummaryCalc";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CalculateValues() {
  //                               Crypto[] Crypto type and Array or null
  const [cryptos, setCryptos] = useState<Crypto[] | null>(null);
  const [selected, setSelected] = useState<Crypto[]>([]);

  /*
   // charts variables
   const [data, setData] = useState<ChartData<"line">>();
   const [options, setOptions] = useState<ChartOptions<"line">>({
     responsive: true,
     plugins: {
       legend: {
         // position: "top" as const,
         display: false,
       },
       title: {
         display: true,
         text: "Chart.js Line Chart",
       },
     },
   });
 */
  // API GET ALl cryptos
  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en";
    axios.get(url).then((response) => {
      setCryptos(response.data);
    });
  }, []);
  /*
   // API Get selected crypto and range // if range is 1 day set intervals in hours
   useEffect(() => {
     if(!selected) return; // avoid error at load because nothing is selected
     axios
       .get(
         `https://api.coingecko.com/api/v3/coins/${selected?.id}/market_chart?vs_currency=eur&days=${range}&interval=daily` //${range === '1' ? 'interval=hourly':'interval=daily'} hourly interval only enterprise plan
       )
       .then((response) => {
         setData({
           // DATE values
           labels: response.data.prices.map((price: number[]) => {
             //divide value by 1000 because of miliseconds
             return moment
               .unix(price[0] / 1000)
               .format(range === "1" ? "HH:MM" : "MM-DD");
           }),
           datasets: [
             {
               label: "Dataset 1",
               data: response.data.prices.map((price: number[]) => {
                 return price[1];
               }),
               borderColor: "rgb(255, 99, 132)",
               backgroundColor: "rgba(255, 99, 132, 0.5)",
             },
             // {
             //   label: 'Dataset 2',
             //   data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
             //   borderColor: 'rgb(53, 162, 235)',
             //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
             // },
           ],
         }); // set
         setOptions({
           responsive: true,
           plugins: {
             legend: {
               //position: "top" as const,
               display: false,
             },
             title: {
               display: true,
               text:
                 `${selected?.name} Price over last ${range}` +
                 (range === "1" ? " day" : " days."),
             },
           },
         });
       });
   }, [selected, range]);
 */

  //void if you know its not returning nothing
  function updateOwned(crypto: Crypto, amount: number): void {
    console.log("updateOwned", crypto, amount);
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

  return (
    <div className="container mt-4">
      <div className="row g-3">
        <div className="col">
          <select
            className="form-select"
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
        </div>

        {selected.map((s) => {
          return <CryptoSummaryCalc crypto={s} updateOwned={updateOwned} />;
        })}

        {/* {selected ? <CryptoSummaryCalc crypto={selected} /> : null} */}
        {/*render a line chart*/}
        {/* {data ? (
         <div style={{ width: 600 }}>
           <Line options={options} data={data} />
         </div>
       ) : null} */}
      </div>
      {selected
        ? "Your portfolio´s value is worth: € " +
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
    </div>
  );
}
