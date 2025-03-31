## Instrucciones para Usar los Scripts de Prueba

### Requisitos Previos

1. **Instalar k6** (herramienta de pruebas de carga):
   ```bash
   # Windows (usando Chocolatey)
   choco install k6
   
   # Linux
   sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
   echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
   sudo apt-get update
   sudo apt-get install k6
   
   # macOS
   brew install k6
   ```

2. **Node.js** (versión 14 o superior) para el generador de informes
3. **Docker y Docker Compose** (para ejecutar los microservicios)
4. **Kubectl** (opcional, para pruebas con Kubernetes)

### Ejecución de las Pruebas

#### Para Windows:

```bash
# Navegar a la carpeta de tests
cd path\to\tests

# Ejecutar el script de pruebas completo
.\run-comparison-tests.bat
```

#### Para Linux/Mac:

```bash
# Navegar a la carpeta de tests
cd path/to/tests

# Dar permisos de ejecución
chmod +x run-comparison-tests.sh

# Ejecutar el script de pruebas
./run-comparison-tests.sh
```

### Pruebas Manuales

Si deseas ejecutar pruebas específicas manualmente:

#### Probar solo la arquitectura monolítica:

```bash
# Asegúrate que la aplicación monolítica esté corriendo
cd ../monolithic
npm start

# En otra terminal, ejecutar las pruebas
cd ../tests
k6 run architecture-test.js --env BASE_URL=http://localhost:3000
```

#### Probar solo la arquitectura de microservicios:

```bash
# Asegúrate que los microservicios estén corriendo
cd ../microservices
docker-compose up -d

# En otra terminal, ejecutar las pruebas
cd ../tests
k6 run architecture-test.js --env BASE_URL=http://localhost:3000
```

#### Pruebas de resiliencia:

```bash
# Para microservicios (con un servicio caído)
# Primero, detén el servicio que quieras simular como caído
docker stop microservices-product-service-1

# Luego ejecuta la prueba de resiliencia
k6 run resilience-test.js --env BASE_URL=http://localhost:3000 --env SERVICE_TO_FAIL=product
```

### Generación Manual de Informes

Si ya tienes resultados de pruebas y quieres regenerar el informe:

```bash
# Asegúrate de tener las salidas JSON de k6 en test-results/
node generate-report.js
```

### Interpretación de Resultados

El informe generado (`test-results/comparison-report.md`) contiene:

- Métricas comparativas de ambas arquitecturas
- Gráficos de rendimiento (si se generaron)
- Una recomendación basada en los datos obtenidos

Para una interpretación óptima:
- Enfócate en las métricas más relevantes para tu caso de uso
- Considera el contexto de despliegue real
- Revisa tanto el rendimiento como la resiliencia

## Personalización de las Pruebas

Puedes modificar los scripts para adaptarlos a tus necesidades:

- En `architecture-test.js`: ajusta las etapas de carga, umbrales o casos de prueba
- En `resilience-test.js`: modifica los escenarios de fallo
- En `generate-report.js`: personaliza las métricas analizadas

## Notas Importantes

- Ejecuta las pruebas en entornos similares para obtener resultados comparables
- Las pruebas simulan cargas sintéticas y el comportamiento real puede variar
- Considera ejecutar pruebas múltiples veces para obtener resultados más confiables

Para más información sobre interpretación avanzada de resultados, consulta la documentación de k6: [https://k6.io/docs/](https://k6.io/docs/)