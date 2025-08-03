import React from "react";

type WeatherChartInputProps = {
  city: string;
  startDate: string;
  setCity: (val: string) => void;
  setStartDate: (val: string) => void;
};
export const WeatherChartInput: React.FC<WeatherChartInputProps> = (props) => {
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setCity(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setStartDate(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
      <div className="w-full sm:w-auto">
        <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
          City
        </label>
        <input
          type="text"
          id="city"
          value={props.city}
          onChange={handleCityChange}
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
          placeholder="e.g., London"
        />
      </div>
      <div className="w-full sm:w-auto">
        <label
          htmlFor="startDate"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          value={props.startDate}
          onChange={handleDateChange}
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
        />
      </div>
    </div>
  );
};
