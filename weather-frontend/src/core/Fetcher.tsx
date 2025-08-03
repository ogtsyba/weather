import { Component } from "react";
import axios from "axios";

type Properties = { city: string; startDate: Date };

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

export class Fetcher extends Component<Properties, any> {
  abortController: AbortController | undefined;

  state = { datasets: [], error: "" };

  componentDidMount() {
    this.fetchData().catch((err) => {
      console.error("Error fetching weather data:", err);
      this.setState({
        error: "Failed to fetch weather data. Ensure the backend is running",
        datasets: [], // clear prev data on error
      });
    });
  }

  componentDidUpdate(
    prevProps: Readonly<Properties>,
    // prevState: Readonly<any>,
    // snapshot?: any,
  ) {
    if (
      prevProps.city !== this.props.city ||
      prevProps.startDate !== this.props.startDate
    ) {
      this.fetchData().catch((err) => {
        console.error("Error fetching weather data:", err);
        this.setState({
          error: "Failed to fetch weather data. Ensure the backend is running",
          datasets: [], // clear prev data on error
        });
      });
    }
  }

  async fetchData() {
    const { city, startDate }: Properties = this.props;

    if (!city || !startDate) {
      // Set to a non-loading, empty state if inputs are cleared
      this.abortController = undefined;
      this.setState({
        datasets: [],
        error: "Please provide a valid city and start date",
      });
      return;
    }

    if (this.abortController) this.abortController.abort();

    this.abortController = new AbortController();

    const response = await axios.get<ApiResponse>("http://localhost:3001/weather", {
      params: { city, startDate: new Date(startDate).toISOString() },
      signal: this.abortController.signal,
    });

    if (response.data && response.data.content.length > 0) {
      const formattedData: CandlestickDataPoint[] = response.data.content.map((item) => ({
        x: new Date(item._id).getTime(),
        o: item.openTemperature,
        h: item.maxTemperature,
        l: item.minTemperature,
        c: item.closeTemperature,
      }));

      this.setState({ datasets: [{ label: `${city} Weather`, data: formattedData }] });
    }
  }
}
