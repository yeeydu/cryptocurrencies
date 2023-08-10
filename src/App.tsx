import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import CryptoSummary from "./components/CryptoSummary";
import { Crypto } from "./components/Types";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  //                               Crypto[] Crypto type and Array or null
  const [cryptos, setCryptos] = useState<Crypto[] | null>(null);
  const [selected, setSelected] = useState<Crypto | null>();
  const [range, setRange] = useState<string>("30");
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

  // API GET ALl cryptos
  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en";
    axios.get(url).then((response) => {
      setCryptos(response.data);
    });
  }, []);

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

  return (
    <>
      <div className="App">
        <select
          onChange={(e) => {
            const coin = cryptos?.find((x) => x.id === e.target.value);
            setSelected(coin);
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
        <select
          onChange={(e) => {
            setRange(e.target.value);
            //parseInt(setRange(e.target.value)); if days where numbers
          }}
        >
          <option value="30">30 days</option>
          <option value="7">7 days</option>
          <option value="1">1 day</option>
        </select>
      </div>
      {selected ? <CryptoSummary crypto={selected} /> : null}
      {/*render a line chart*/}
      {data ? (
        <div style={{ width: 600 }}>
          <Line options={options} data={data} />
        </div>
      ) : null}
    </>
  );
}

export default App;
