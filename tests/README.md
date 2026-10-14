# Tests

| File | What it does |
| --- | --- |
| `smoke.js` | Functional check of the whole user flow (register, login, products, orders, auth failures). Plain Node, no dependencies. Run by CI. |
| `architecture-test.js` | k6 load test: the same flow under ramping load (up to 100 virtual users). |
| `resilience-test.js` | k6 test run while one microservice is stopped. |
| `generate-report.js` | Builds `test-results/comparison-report.md` from the k6 JSON output. |
| `run-comparison-tests.bat` | Windows driver that runs everything in sequence. |

## Smoke test

```bash
node tests/smoke.js http://localhost:3000
```

Works against the monolith and against the API gateway.

## Load and resilience tests

Install [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/), then either run the Windows driver (it starts the monolith with `npm start` and the microservices with Docker Compose, so run `npm install` in `monolithic/` first and have MongoDB available on `localhost:27017`):

```bat
cd tests
run-comparison-tests.bat
```

or run the pieces by hand, one architecture at a time:

```bash
# Monolith or gateway listening on :3000
k6 run --out json=test-results/monolith-results.json architecture-test.js --env BASE_URL=http://localhost:3000

# Resilience: stop one service first, then name it
cd ../microservices && docker compose stop product-service && cd ../tests
k6 run --out json=test-results/resilience-results.json resilience-test.js --env SERVICE_TO_FAIL=product
```

Save the monolith run as `monolith-results.json`, the microservices run as `microservices-results.json` and the resilience run as `resilience-results.json` in `tests/test-results/`, then:

```bash
node generate-report.js    # writes test-results/comparison-report.md
```

## Reading the results

Compare requests per second, average and p95 response time, error rate and the behaviour under a failed service. Run on the same machine and repeat a few times: the load is synthetic and the numbers depend heavily on the environment. [TestResult.md](TestResult.md) shows the report format.
