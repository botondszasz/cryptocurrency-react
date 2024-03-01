import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import TimeList from "./components/TimeList";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import { Crypto } from "./types/CryptoType";
import CryptoSummary from "./components/CryptoSummary";
import { DropdownButton } from "react-bootstrap";
import type { ChartData, ChartOptions } from "chart.js";
import { Chart, Line } from "react-chartjs-2";
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

  const [range, setRange] = useState<string>();

  const [data, setData] = useState<ChartData<"line">>();
  const [options, setOptions] = useState<ChartOptions<"line">>({
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
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
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/${selected?.id}/market_chart?vs_currency=usd&days=${range}&interval=daily&precision=2`
      )
      .then((response) => {
        console.log(response.data);
        setData({
          labels: response.data.prices.map((price: number[]) => {
            return moment.unix(price[0] / 1000).format("MM-DD");
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
      });
  }, [selected, range]);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-primary-subtle shadow p-3 rounded position-absolute w-100">
        <div className="container-fluid">
          <a className="navbar-brand text-primary">Cryptocurrency</a>
          <div className="position-absolute end-0 mx-3" id="navbarNav">
            <div className="btn-group gap-2">
              <DropdownButton
                variant="outline-primary"
                title="Select currency"
                onSelect={function (evt) {
                  const c = cryptos?.find((x) => x.id == evt);
                  setSelected(c);
                }}
              >
                {cryptos
                  ? cryptos.map((crypto) => {
                      return (
                        <Dropdown.Item
                          eventKey={crypto.id}
                          key={crypto.id}
                          defaultValue={crypto.id}
                        >
                          {crypto.name}
                        </Dropdown.Item>
                      );
                    })
                  : null}
              </DropdownButton>

              <select
                onChange={(e) => {
                  setRange(e.target.value);
                }}
              >
                <option value="1">Today</option>
                <option value="7">7 days</option>
                <option value="30">30 days</option>
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
          className="position-absolute top-50 start-50 translate-middle"
          style={{
            width: 600,
          }}
        >
          <Line options={options} data={data} />
        </div>
      ) : null}
    </>
  );
}

export default App;
