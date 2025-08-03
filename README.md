## Structure of backend app

* `__tests__` - e2e tests
* `core` - core services like auth/logger/db-connector
* `lib` - utils
* `servers` - server specific logic to run it
* `weather` - `weather` service, contains business logic and controllers
* `index.ts` - entry point for app
* `run.ts` - run servers


## Project setup

```bash
# Setup DNS resolution
cat <<EOF | sudo tee -a /etc/hosts
10.23.1.0 weather
10.23.2.10 api.weather
EOF

docker compose up --build
```


To configure the Backend app settings, use env variables.
You can modify them in `docker-compose.yaml`
`weather-change-aggregator.environment` parameter.

| Env var name       | Env var default value                         |
|:-------------------|:----------------------------------------------|
| `WA_WS_URL`        | `"ws://weather-stream-simulator:8765"`        |
| `WA_HTTP_PORT`     | `3000`                                        |
| `WA_HTTP_HOSTNAME` | `"0.0.0.0"`                                   |
| `WA_MONGODB_URL`   | `"mongodb://mongo/weather-change-aggregator"` |
| `WA_LOGGER_LEVEL`  | `"info"`                                      |
| `WA_SYNC_MS`       | `20000`                                       |


## Run backend tests

```bash
docker compose up -d --build mongo
cd ./weather-change-aggregator
npm run test:e2e
```
