import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Crypto } from "./types/CryptoType";
import type { ChartData, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment";

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
  const [cryptos, setCryptos] = useState<Crypto[] | null>(null);
  const [selected, setSelected] = useState<Crypto | null>();
  const [top5, setTop5] = useState<Crypto[] | null>(null);
  const [low5, setLow5] = useState<Crypto[] | null>(null);

  const [range, setRange] = useState<string>("30");

  const [data, setData] = useState<ChartData<"line">>();
  const [options, setOptions] = useState<ChartOptions<"line">>({
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  });

  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
    axios.get(url).then((response) => {
      setCryptos(response.data);
    });
  }, []);

  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C30d&locale=en&precision=2";
    axios.get(url).then((response) => {
      if (range === "7") {
        setTop5(
          response.data
            ? response.data.sort(
                (
                  a: { price_change_percentage_7d_in_currency: number },
                  b: { price_change_percentage_7d_in_currency: number }
                ) =>
                  b.price_change_percentage_7d_in_currency -
                  a.price_change_percentage_7d_in_currency
              )
            : null
        );
      } else if (range === "30") {
        setTop5(
          response.data
            ? response.data.sort(
                (
                  a: { price_change_percentage_30d_in_currency: number },
                  b: { price_change_percentage_30d_in_currency: number }
                ) =>
                  b.price_change_percentage_30d_in_currency -
                  a.price_change_percentage_30d_in_currency
              )
            : null
        );
      } else if (range === "1") {
        setTop5(
          response.data
            ? response.data.sort(
                (
                  a: { price_change_percentage_24h_in_currency: number },
                  b: { price_change_percentage_24h_in_currency: number }
                ) =>
                  b.price_change_percentage_24h_in_currency -
                  a.price_change_percentage_24h_in_currency
              )
            : null
        );
      }
    });
  });

  useEffect(() => {
    if (!selected) return;
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/${selected?.id}/market_chart?vs_currency=usd&days=${range}&interval=daily&precision=2
        }`
      )
      .then((response) => {
        setData({
          labels: response.data.prices.map((price: number[]) => {
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
          ],
        });
        setOptions({
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text:
                `${selected?.name} Price over last ` +
                range +
                (range === "1" ? " day" : " days"),
            },
          },
        });
      });
  }, [selected, range]);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-primary-subtle shadow p-3 rounded position-absolute w-100">
        <div className="container-fluid">
          <a className="navbar-brand text-primary">Cryptocurrency</a>
          <div className="position-absolute end-0 mx-3" id="navbarNav">
            <div className="btn-group">
              <select
                onChange={(evt) => {
                  const c = cryptos?.find((x) => x.id === evt.target.value);
                  setSelected(c);
                }}
                defaultValue="default"
                role="button"
                typeof="button"
                className="btn btn-outline-primary"
              >
                <option value="default">Choose an option</option>
                {cryptos
                  ? cryptos.map((crypto) => {
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
                }}
                role="button"
                typeof="button"
                className="btn btn-outline-primary"
              >
                {" "}
                <option value="30">30 days</option>
                <option value="7">7 days</option>
                <option value="1">Today</option>
              </select>
            </div>
          </div>
        </div>
      </nav>
      {/* <TimeList /> */}
      {/* <div className="position-absolute top-50 start-50">
        {selected ? <CryptoSummary crypto={selected} /> : null}
      </div> */}
      {data ? (
        <div
          className="position-absolute top-50 start-50 translate-middle mb-5"
          style={{
            width: 600,
          }}
        >
          <Line options={options} data={data} />
        </div>
      ) : null}
      <div className="container text-center fixed-bottom w-100">
        <div className="row w-100">
          <div className="col d-flex justify-content-start">
            <ul className="list-group">
              <li className="list-group-item active" aria-current="true">
                The biggest losses
              </li>
              {top5
                ? top5.slice(0, 5).map((crypto) => {
                    return (
                      <li className="list-group-item" key={crypto.id}>
                        {crypto.name}
                      </li>
                    );
                  })
                : null}
            </ul>
          </div>

          <div className="col d-flex justify-content-end">
            <ul className="list-group">
              <li className="list-group-item active" aria-current="true">
                The biggest gains
              </li>
              {top5
                ? top5
                    .reverse()
                    .slice(0, 5)
                    .map((crypto) => {
                      return (
                        <li className="list-group-item" key={crypto.id}>
                          {crypto.name}
                        </li>
                      );
                    })
                : null}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
