# Comparación de Arquitecturas: Monolítica vs Microservicios

## Prueba de Concepto

Desarrollo de una aplicación e-commerce básica implementada en dos arquitecturas diferentes para comparar rendimiento, escalabilidad y resiliencia:

- Una implementación monolítica con todos los componentes integrados
- Una implementación basada en microservicios con servicios independientes
- Pruebas de rendimiento para determinar ventajas y desventajas de cada enfoque

---

## ¿Qué es una Comparación de Arquitecturas?

Una comparación de arquitecturas es un análisis detallado que evalúa diferentes enfoques estructurales para el desarrollo de aplicaciones, permitiendo identificar cuál es más adecuado para requisitos específicos de escalabilidad, mantenibilidad y rendimiento.

> [!TIP]  
> Esta comparación te ayudará a tomar decisiones fundamentadas sobre qué arquitectura elegir para tu próximo proyecto, basándote en datos empíricos y no solo en tendencias.

---

## Concepto Aplicado: E-Commerce de Productos

Hemos desarrollado un sistema e-commerce básico que permite gestionar usuarios, productos y órdenes. El sistema se ha implementado utilizando dos enfoques arquitectónicos diferentes:

### Arquitecturas Implementadas

- **Arquitectura Monolítica:**  
  Una aplicación única que contiene todos los módulos de usuarios, productos y órdenes.
- **Arquitectura de Microservicios:**  
  Servicios independientes para usuarios, productos y órdenes, con comunicación a través de API Gateway.

> [!TIP]  
> Cada arquitectura tiene sus propias fortalezas y debilidades. El monolito es más simple pero menos flexible, mientras que los microservicios son más complejos pero ofrecen mayor escalabilidad.

---

## Comparación de Arquitecturas

| Característica | Arquitectura Monolítica | Arquitectura de Microservicios |
|----------------|-------------------------|-------------------------------|
| Despliegue     | Único, todo junto       | Múltiples servicios independientes |
| Escalabilidad  | Escala toda la aplicación | Escala servicios individuales |
| Complejidad    | Baja a media           | Media a alta                  |
| Desarrollo     | Más rápido inicialmente | Más tiempo de configuración inicial |
| Resiliencia    | Un fallo afecta todo    | Fallos aislados por servicio |
| Mantenimiento  | Simple pero puede volverse complejo | Componentes más pequeños y manejables |

---

## Estructura del Proyecto

- **monolithic/**: Implementación de la arquitectura monolítica.
  - **src/**: Código fuente para la aplicación monolítica.
    - **controllers/**: Controladores para usuarios, productos y órdenes.
    - **models/**: Modelos de datos para usuarios, productos y órdenes.
    - **routes/**: Define las rutas API para la aplicación.
    - **middleware/**: Funciones middleware para autenticación.
    - **app.js**: Punto de entrada para la aplicación monolítica.
  - **package.json**: Archivo de configuración para dependencias npm.
  - **README.md**: Documentación específica para la aplicación monolítica.

- **microservices/**: Implementación de la arquitectura de microservicios.
  - **api-gateway/**: Punto de entrada para enrutar peticiones a los microservicios apropiados.
    - **src/**: Código fuente para el API Gateway.
    - **Dockerfile**: Instrucciones para construir la imagen Docker para el API Gateway.
    - **package.json**: Archivo de configuración para dependencias npm.
  - **user-service/**: Microservicio para la gestión de usuarios.
  - **product-service/**: Microservicio para la gestión de productos.
  - **order-service/**: Microservicio para la gestión de órdenes.
  - **docker-compose.yml**: Define los servicios y redes para ejecutar los microservicios juntos.

- **kubernetes/**: Contiene configuraciones de despliegue de Kubernetes para cada microservicio y el API Gateway.

---

## Arquitectura Monolítica

La arquitectura monolítica integra todos los componentes en una única aplicación:

- **Backend:** Node.js con Express
- **Base de Datos:** MySQL para gestionar usuarios, productos y órdenes
- **Estructura:** Todos los módulos (usuarios, productos, órdenes) en una sola aplicación

### Endpoints del Monolito

| Método | Ruta              | Descripción                 |
|--------|--------------------|----------------------------|
| GET    | /api/users         | Obtener todos los usuarios |
| POST   | /api/users/register| Registrar nuevo usuario    |
| POST   | /api/users/login   | Iniciar sesión de usuario  |
| GET    | /api/products      | Obtener todos los productos|
| POST   | /api/products      | Crear nuevo producto       |
| GET    | /api/orders        | Obtener órdenes del usuario|
| POST   | /api/orders        | Crear nueva orden          |

---

## Arquitectura de Microservicios

La arquitectura de microservicios divide la funcionalidad en servicios independientes:

- **API Gateway:** Dirige el tráfico a los servicios apropiados
- **Servicio de Usuarios:** Gestiona registro, autenticación y perfiles
- **Servicio de Productos:** Administra el catálogo de productos
- **Servicio de Órdenes:** Maneja las órdenes de compra
- **Comunicación:** API REST entre servicios
- **Contenerización:** Docker para aislar cada servicio
- **Orquestación:** Kubernetes para gestionar contenedores

> [!NOTE]  
> Cada microservicio tiene su propia base de datos y puede ser desarrollado, desplegado y escalado de forma independiente.

---

## Sistema de Pruebas de Rendimiento

Hemos desarrollado un conjunto completo de pruebas para comparar ambas arquitecturas:

- **Performance Testing:** Análisis de tiempos de respuesta y throughput
- **Pruebas de Carga:** Comportamiento bajo diferentes niveles de usuarios concurrentes
- **Pruebas de Resiliencia:** Comportamiento cuando un componente falla
- **Pruebas de Escalabilidad:** Capacidad de manejar cargas crecientes

### Métricas Evaluadas

| Métrica | Descripción |
|---------|-------------|
| Requests Per Second | Número de solicitudes manejadas por segundo |
| Avg Response Time | Tiempo promedio de respuesta |
| P95 Response Time | Tiempo de respuesta para el 95% de solicitudes |
| Error Rate | Porcentaje de solicitudes que fallan |
| Success Rate | Porcentaje de solicitudes exitosas |

> [!CAUTION]  
> Las pruebas de rendimiento deben ejecutarse en entornos similares para obtener resultados comparables.

---

## Ventajas y Desafíos

### Ventajas del Monolito

- **Simplicidad:** Más fácil de desarrollar y desplegar inicialmente
- **Rendimiento:** Menos latencia en comunicaciones internas
- **Transacciones:** Transacciones atómicas más sencillas
- **Depuración:** Más fácil seguir el flujo de ejecución

### Desafíos del Monolito

- **Escalabilidad:** Todo debe escalarse junto, incluso partes poco utilizadas
- **Resiliencia:** Un fallo afecta toda la aplicación
- **Mantenimiento:** Con el tiempo, puede volverse complejo y difícil de mantener

### Ventajas de Microservicios

- **Escalabilidad:** Escala independientemente por servicio
- **Resiliencia:** Fallos aislados por servicio
- **Flexibilidad:** Tecnologías diferentes por servicio
- **Desarrollo:** Equipos independientes por servicio

### Desafíos de Microservicios

- **Complejidad:** Mayor sobrecarga operativa
- **Comunicación:** Latencia entre servicios
- **Consistencia:** Desafíos con transacciones distribuidas
- **Depuración:** Flujos más complejos de rastrear

---

## Instrucciones de Configuración

### 1. Aplicación Monolítica

```bash
# Navegar al directorio monolítico
cd monolithic

# Instalar dependencias
npm install

# Iniciar la aplicación
node src/app.js
```

### 2. Microservicios

```bash
# Navegar al directorio de microservicios
cd microservices

# Construir y ejecutar los servicios con Docker Compose
docker-compose up --build
```

### 3. Kubernetes

```bash
# Asegúrate de tener un cluster de Kubernetes en ejecución
kubectl config current-context

# Aplicar las configuraciones de despliegue
kubectl apply -f kubernetes/
```

---

## Ejecución de Pruebas de Comparación

Para determinar cuál arquitectura tiene mejor desempeño, ejecute el script de pruebas:

```bash
# Navegar al directorio del proyecto
cd architecture-comparison

# Ejecutar las pruebas de comparación
.\run-comparison-tests.bat
```

### Resultados de las Pruebas

Una vez completadas las pruebas, se generará un informe detallado en `test-results/comparison-report.md` que mostrará:

- Comparación de velocidad de respuesta
- Throughput (solicitudes por segundo)
- Tasas de error
- Recomendación general basada en datos

> [!TIP]  
> Analice los datos de ambas arquitecturas y considere qué métricas son más importantes para su caso de uso específico al elegir una arquitectura.

---

## Uso de la API

- Tanto la aplicación monolítica como los microservicios exponen APIs RESTful para la gestión de usuarios, productos y órdenes. Consulte los archivos `README.md` respectivos en los directorios `monolithic` y `microservices` para obtener documentación detallada de la API.

---

## Recursos Adicionales Recomendados

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [K6 Load Testing](https://k6.io/)
- [Microservices vs Monolithic Architecture](https://martinfowler.com/articles/microservices.html)
- [Patterns of Microservices Architecture](https://microservices.io/patterns/index.html)
- [The Twelve-Factor App](https://12factor.net/)

---
