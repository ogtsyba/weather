// src/hooks/useWeatherData.ts
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChartData } from "chart.js";

// Describes the raw data from the API
interface WeatherInfo {
  _id: string;
  minTemperature: number;
  maxTemperature: number;
  openTemperature: number;
  closeTemperature: number;
}

// Describes the structure of the API response
interface ApiResponse {
  content: WeatherInfo[];
}

// Describes the data format required by the 'chartjs-chart-financial' plugin
export interface CandlestickDataPoint {
  x: number;
  o: number;
  h: number;
  l: number;
  c: number;
}

/**
 * Custom hook to fetch and process weather data for the chart.
 * @param city The city to fetch weather data for.
 * @param startDate The starting date for the weather data.
 * @returns An object containing the chart data, loading state, and any errors.
 */
export const useWeatherData = (city: string, startDate: string) => {
  const [chartData, setChartData] = useState<
    ChartData<"candlestick", CandlestickDataPoint[]>
  >({ datasets: [] });
  const abortControllerRef = useRef<AbortController | undefined>(undefined);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Skip fetching if essential parameters are missing
    if (!city || !startDate) {
      // Set to a non-loading, empty state if inputs are cleared
      abortControllerRef.current = undefined;
      setChartData({ datasets: [] });
      setError("Please provide a valid city and start date.");
      return;
    }

    async function fetchData() {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const response = await axios.get<ApiResponse>("http://api.weather:3000/weather", {
        params: { city, startDate: new Date(startDate).toISOString() },
        signal: abortControllerRef.current.signal,
      });

      if (!Array.isArray(response.data?.content)) {
        setError(`Response content is not array. city=${city}, startDate=${startDate}`);
        setChartData({ datasets: [] }); // Clear previous data
      }

      const formattedData: CandlestickDataPoint[] = response.data.content.map((item) => ({
        x: new Date(item._id).getTime(),
        o: item.openTemperature,
        h: item.maxTemperature,
        l: item.minTemperature,
        c: item.closeTemperature,
      }));

      setError("");
      setChartData({ datasets: [{ label: `${city} Weather`, data: formattedData }] });
    }

    fetchData()
      .catch((err) => {
        console.error("Error fetching weather data:", err);
        setError("Failed to fetch weather data. Ensure the backend is running.");
        setChartData({ datasets: [] }); // Clear previous data on error
      })
      .finally(() => {
        abortControllerRef.current = undefined;
      });

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [city, startDate]); // Re-run effect when city or startDate changes

  return { chartData, isLoading: !!abortControllerRef.current, error };
};
