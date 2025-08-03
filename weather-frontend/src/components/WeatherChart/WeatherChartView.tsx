import React, { useRef } from "react";
import { useWeatherData } from "../../hooks/fetchWeatherHook";
import { Chart as ChartJS, ChartOptions } from "chart.js";
import { Chart } from "react-chartjs-2";

// Describes the data format required by the 'chartjs-chart-financial' plugin
interface CandlestickDataPoint {
  x: number;
  o: number;
  h: number;
  l: number;
  c: number;
}

type WeatherChartViewProps = { city: string; startDate: string };

export const WeatherChartView: React.FC<WeatherChartViewProps> = ({
  city,
  startDate,
}) => {
  const { chartData, isLoading, error } = useWeatherData(city, startDate);

  const chartRef = useRef<ChartJS<"candlestick", CandlestickDataPoint[]> | null>(null);

  const chartOptions: ChartOptions<"candlestick"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Weather Candlestick Chart" },
    },

    scales: {
      x: {
        type: "time",
        // adapters: { date: { zone: "utc" } },
        time: {
          unit: "hour",
          tooltipFormat: "MMM dd, yyyy HH:mm",
          displayFormats: { hour: "HH:mm" },
        },
        title: { display: true, text: "Date" },
      },
      y: { title: { display: true, text: "Temperature (°C)" }, min: -20, max: 45 },
    },
  };

  return (
    <div className="relative h-[40rem] p-4 bg-gray-900 rounded-lg">
      {isLoading && (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>Loading chart data...</p>
        </div>
      )}
      {error && !isLoading && (
        <div className="flex items-center justify-center h-full text-red-400">
          <p>{error}</p>
        </div>
      )}
      {!isLoading && !error && chartData.datasets.length > 0 && (
        <Chart
          ref={chartRef}
          type="candlestick"
          data={chartData}
          options={chartOptions}
        />
      )}
    </div>
  );
};
