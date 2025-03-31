const fs = require('fs');

// Load test results
const monolithResults = JSON.parse(fs.readFileSync('./test-results/monolith-results.json'));
const microservicesResults = JSON.parse(fs.readFileSync('./test-results/microservices-results.json'));
const resilienceResults = JSON.parse(fs.readFileSync('./test-results/resilience-results.json'));

// Extract metrics
function extractMetrics(results) {
  return {
    requestsPerSecond: results.metrics.http_reqs.rate,
    failureRate: results.metrics.http_req_failed.rate,
    avgResponseTime: results.metrics.http_req_duration.avg,
    p95ResponseTime: results.metrics.http_req_duration.p(95),
    successRate: results.metrics.success_rate.rate,
    errorRate: results.metrics.error_rate.rate,
  };
}

const monolithMetrics = extractMetrics(monolithResults);
const microservicesMetrics = extractMetrics(microservicesResults);

// Generate comparison
const comparison = {
  requestsPerSecond: {
    monolith: monolithMetrics.requestsPerSecond,
    microservices: microservicesMetrics.requestsPerSecond,
    winner: monolithMetrics.requestsPerSecond > microservicesMetrics.requestsPerSecond ? 'monolith' : 'microservices',
    diffPercentage: Math.abs((monolithMetrics.requestsPerSecond - microservicesMetrics.requestsPerSecond) / 
      ((monolithMetrics.requestsPerSecond + microservicesMetrics.requestsPerSecond) / 2) * 100).toFixed(2)
  },
  failureRate: {
    monolith: monolithMetrics.failureRate,
    microservices: microservicesMetrics.failureRate,
    winner: monolithMetrics.failureRate < microservicesMetrics.failureRate ? 'monolith' : 'microservices',
    diffPercentage: Math.abs((monolithMetrics.failureRate - microservicesMetrics.failureRate) / 
      ((monolithMetrics.failureRate + microservicesMetrics.failureRate) / 2 || 0.001) * 100).toFixed(2)
  },
  avgResponseTime: {
    monolith: monolithMetrics.avgResponseTime,
    microservices: microservicesMetrics.avgResponseTime,
    winner: monolithMetrics.avgResponseTime < microservicesMetrics.avgResponseTime ? 'monolith' : 'microservices',
    diffPercentage: Math.abs((monolithMetrics.avgResponseTime - microservicesMetrics.avgResponseTime) / 
      ((monolithMetrics.avgResponseTime + microservicesMetrics.avgResponseTime) / 2) * 100).toFixed(2)
  },
  p95ResponseTime: {
    monolith: monolithMetrics.p95ResponseTime,
    microservices: microservicesMetrics.p95ResponseTime,
    winner: monolithMetrics.p95ResponseTime < microservicesMetrics.p95ResponseTime ? 'monolith' : 'microservices',
    diffPercentage: Math.abs((monolithMetrics.p95ResponseTime - microservicesMetrics.p95ResponseTime) / 
      ((monolithMetrics.p95ResponseTime + microservicesMetrics.p95ResponseTime) / 2) * 100).toFixed(2)
  },
  successRate: {
    monolith: monolithMetrics.successRate,
    microservices: microservicesMetrics.successRate,
    winner: monolithMetrics.successRate > microservicesMetrics.successRate ? 'monolith' : 'microservices',
    diffPercentage: Math.abs((monolithMetrics.successRate - microservicesMetrics.successRate) / 
      ((monolithMetrics.successRate + microservicesMetrics.successRate) / 2) * 100).toFixed(2)
  }
};

// Extract resilience metrics
const resilienceMetrics = {
  errorRate: resilienceResults.metrics.error_rate.rate,
  avgResponseTime: resilienceResults.metrics.http_req_duration.avg
};

// Generate overall recommendation
let monolithWins = 0;
let microservicesWins = 0;

Object.values(comparison).forEach(metric => {
  if (metric.winner === 'monolith') monolithWins++;
  else microservicesWins++;
});

const recommendation = monolithWins > microservicesWins ? 
  "RECOMMENDATION: Monolithic architecture performed better in this test scenario." : 
  "RECOMMENDATION: Microservices architecture performed better in this test scenario.";

// Additional resilience recommendation
const resilienceRecommendation = resilienceMetrics.errorRate < 0.2 ? 
  "Microservices demonstrated good resilience with failed services." : 
  "Microservices showed poor resilience handling with failed services.";

// Generate report
const report = `
# Architecture Comparison Test Results

## Performance Metrics

| Metric | Monolith | Microservicios | Ganador | Diferencia |
|--------|----------|--------------|--------|------------|
| Requests Per Second | ${comparison.requestsPerSecond.monolith.toFixed(2)} | ${comparison.requestsPerSecond.microservices.toFixed(2)} | ${comparison.requestsPerSecond.winner} | ${comparison.requestsPerSecond.diffPercentage}% |
| Failure Rate | ${(comparison.failureRate.monolith * 100).toFixed(2)}% | ${(comparison.failureRate.microservices * 100).toFixed(2)}% | ${comparison.failureRate.winner} | ${comparison.failureRate.diffPercentage}% |
| Avg Response Time | ${comparison.avgResponseTime.monolith.toFixed(2)}ms | ${comparison.avgResponseTime.microservices.toFixed(2)}ms | ${comparison.avgResponseTime.winner} | ${comparison.avgResponseTime.diffPercentage}% |
| 95th Percentile Response | ${comparison.p95ResponseTime.monolith.toFixed(2)}ms | ${comparison.p95ResponseTime.microservices.toFixed(2)}ms | ${comparison.p95ResponseTime.winner} | ${comparison.p95ResponseTime.diffPercentage}% |
| Success Rate | ${(comparison.successRate.monolith * 100).toFixed(2)}% | ${(comparison.successRate.microservices * 100).toFixed(2)}% | ${comparison.successRate.winner} | ${comparison.successRate.diffPercentage}% |

## Resiliencia de Microservicios

| Metric | Value |
|--------|-------|
| Error Rate During Service Failure | ${(resilienceMetrics.errorRate * 100).toFixed(2)}% |
| Avg Response Time During Failure | ${resilienceMetrics.avgResponseTime.toFixed(2)}ms |

## Resumen
- Victorias del monolito: ${monolithWins}
- Victorias de microservicios: ${microservicesWins}

## ${recommendation}

### Hallazgos clave:
1. ${comparison.requestsPerSecond.winner === 'monolith' ? 'El monolito' : 'Los microservicios'} manejó más solicitudes por segundo (${comparison.requestsPerSecond.diffPercentage}% de diferencia)
2. ${comparison.avgResponseTime.winner === 'monolith' ? 'El monolito' : 'Los microservicios'} tuvo tiempos de respuesta promedio más rápidos (${comparison.avgResponseTime.diffPercentage}% de diferencia)
3. ${comparison.failureRate.winner === 'monolith' ? 'El monolito' : 'Los microservicios'} mostró mejor confiabilidad con tasas de fallo más bajas (${comparison.failureRate.diffPercentage}% de diferencia)
4. ${resilienceRecommendation}

### Consideraciones:
- Estos resultados se basan en el entorno de prueba específico y su configuración
- El rendimiento en el mundo real puede variar según la infraestructura, la optimización del código y los patrones de uso
- Los microservicios pueden mostrar mejores beneficios de escalabilidad a lo largo del tiempo y con escalado dirigido
- El monolito puede mostrar mejor rendimiento para cargas más bajas y despliegues más simples
`;

// Write report to file
if (!fs.existsSync('./test-results')) {
  fs.mkdirSync('./test-results');
}
fs.writeFileSync('./test-results/comparison-report.md', report);
console.log('Comparison report generated: test-results/comparison-report.md');