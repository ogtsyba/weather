import "chartjs-adapter-luxon";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import "./App.css";
import { WeatherChart } from "./components/WeatherChart/WeatherChart";
import { Home } from "./components/Home/Home";
import { Auth } from "./components/Auth/Auth";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/weather" element={<WeatherChart />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
