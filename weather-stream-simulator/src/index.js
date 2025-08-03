const uws = require("uWebSockets.js");

const PORT = 8765;
const INTERVAL_MS = 1000; // ~10 events/second
const cities = {
  Berlin: [52.52, 13.41],
  NewYork: [40.71, -74.01],
  Tokyo: [35.68, 139.69],
  SaoPaulo: [-23.55, -46.63],
  CapeTown: [-33.92, 18.42],
};
const cityNames = Object.keys(cities);

uws
  .App()
  .ws("/*", {
    /* WebSocket behavior */
    idleTimeout: 300, // Close idle connections to prevent memory leaks

    open: (ws) => {
      console.log("🟢 Client connected");

      /*
       * Attach the interval to the WebSocket connection object (ws)
       * so we can clear it in the 'close' handler.
       */
      ws.interval = setInterval(async () => {
        const city = cityNames[Math.floor(Math.random() * cityNames.length)];
        const [lat, lon] = cities[city];

        console.log("Fetch weather", { city, lat, lon });

        try {
          // const response = await fetch(
          //   `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
          // );
          // const data = await response.json();
          const temperature = (Math.random() * 60) - 20;
          const data = {
            latitude: 52.52,
            longitude: 13.419998,
            generationtime_ms: 0.09810924530029297,
            utc_offset_seconds: 0,
            timezone: "GMT",
            timezone_abbreviation: "GMT",
            elevation: 38,
            current_weather_units: {
              time: "iso8601",
              interval: "seconds",
              temperature: "°C",
              windspeed: "km/h",
              winddirection: "°",
              is_day: "",
              weathercode: "wmo code",
            },
            current_weather: {
              time: "2025-07-23T13:15",
              interval: 900,
              temperature,
              windspeed: 12.2,
              winddirection: 246,
              is_day: 1,
              weathercode: 61,
            },
          };

          const weather = data.current_weather;

          if (weather) {
            const event = {
              city,
              timestamp: weather.time,
              temperature: weather.temperature,
              windspeed: weather.windspeed,
              winddirection: weather.winddirection,
            };
            /*
             * Before sending, check if the socket is still subscribed/open.
             * uWS.js handles closing connections gracefully.
             */
            if (ws.getTopics().length > 0 || !ws.isClosed) {
              const message = JSON.stringify(event);
              console.log("Send a message", message);
              ws.send(message);
            }
          }
        } catch (err) {
          console.error("Error fetching weather data:", err.message);
        }
      }, INTERVAL_MS);
    },

    close: (ws, code, message) => {
      console.log("🔴 Client disconnected", code, message.toString());
      /*
       * Clear the interval associated with this specific client
       * to stop the simulation and prevent a memory leak.
       */
      clearInterval(ws.interval);
    },
  })
  .listen(PORT, (token) => {
    if (token) {
      console.log(
        `🌍 Weather WebSocket server running at ws://localhost:${PORT}`,
      );
    } else {
      console.log(`🔴 Failed to listen on port ${PORT}`);
    }
  });
