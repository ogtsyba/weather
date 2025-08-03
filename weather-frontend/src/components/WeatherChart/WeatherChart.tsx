import React, { useState } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  TimeScale,
  Tooltip,
} from "chart.js";
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import { WeatherChartInput } from "./WeatherChartInput";
import { WeatherChartView } from "./WeatherChartView";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  TimeScale,
  Legend,
  CandlestickController,
  CandlestickElement,
);

export const WeatherChart: React.FC = () => {
  const date = new Date().toISOString().split("T")[0];

  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState<string>(date);

  return (
    <div className="bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto bg-gray-800 text-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-cyan-400">
          Weather Candlestick Chart 📈
        </h2>

        <WeatherChartInput
          city={city}
          setCity={setCity}
          startDate={startDate}
          setStartDate={setStartDate}
        />
        <WeatherChartView city={city} startDate={startDate} />
      </div>
    </div>
  );
};
