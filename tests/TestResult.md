# Architecture Comparison Test Results

## Performance Metrics

| Metric                    | Monolith    | Microservicios | Ganador     | Diferencia |
|---------------------------|-------------|----------------|-------------|------------|
| Requests Per Second        | 1300.45     | 1500.85        | Microservicios | 15.37%     |
| Failure Rate              | 0.04%       | 0.02%          | Microservicios | 50.00%     |
| Avg Response Time         | 140.30ms    | 120.75ms       | Microservicios | 13.43%     |
| 95th Percentile Response  | 240.15ms    | 250.30ms       | Monolith    | 4.04%      |
| Success Rate              | 99.95%      | 99.98%         | Microservicios | 3.01%      |

## Resiliencia de Microservicios

| Metric                        | Value   |
|-------------------------------|---------|
| Error Rate During Service Failure | 0.03%   |
| Avg Response Time During Failure  | 210.10ms |

## Resumen
- Victorias del monolito: 2
- Victorias de microservicios: 3

## RECOMMENDATION: Microservices architecture performed better in this test scenario.

### Hallazgos clave:
1. Los microservicios manejaron más solicitudes por segundo (15.37% de diferencia)
2. Los microservicios tuvieron tiempos de respuesta promedio más rápidos (13.43% de diferencia)
3. El monolito mostró tiempos de respuesta más rápidos en el percentil 95 (4.04% de diferencia)
4. Los microservicios mostraron mejor confiabilidad con tasas de fallo más bajas (50.00% de diferencia)
5. Microservicios demostraron una tasa de error de 0.03% durante fallos del servicio.

### Consideraciones:
- Estos resultados se basan en el entorno de prueba específico y su configuración.
- El rendimiento en el mundo real puede variar según la infraestructura, la optimización del código y los patrones de uso.
- Los microservicios ofrecen una mejor escalabilidad y resistencia ante fallos, lo que es crucial para entornos de alto tráfico.
- Aunque el monolito muestra un buen desempeño en algunos aspectos, como el percentil 95, los microservicios sobresalen en otros escenarios más exigentes.

