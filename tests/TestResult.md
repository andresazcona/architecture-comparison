# Architecture comparison: sample report

> Sample of the report format produced by `generate-report.js`. The environment these figures were measured in was not recorded, and they have not been reproduced against the current code. Regenerate them by following [README.md](README.md) before drawing conclusions.

## Performance metrics

| Metric | Monolith | Microservices | Winner | Difference |
| --- | --- | --- | --- | --- |
| Requests per second | 1300.45 | 1500.85 | Microservices | 15.37% |
| Failure rate | 0.04% | 0.02% | Microservices | 50.00% |
| Avg response time | 140.30 ms | 120.75 ms | Microservices | 13.43% |
| 95th percentile response time | 240.15 ms | 250.30 ms | Monolith | 4.04% |
| Success rate | 99.95% | 99.98% | Microservices | 3.01% |

## Microservices resilience

| Metric | Value |
| --- | --- |
| Error rate during service failure | 0.03% |
| Avg response time during failure | 210.10 ms |

## Reading the report

- Monolith wins: 2. Microservices wins: 3.
- Results depend on the test environment and configuration; real-world performance varies with infrastructure, code optimization and traffic patterns.
- Microservices trade higher operational complexity for independent scaling and failure isolation; the monolith avoids inter-service latency.
