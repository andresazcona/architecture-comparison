@echo off
echo === Architecture Performance Comparison Test ===

REM Create results directory
mkdir test-results

echo.
echo === Testing Monolithic Architecture ===
echo Starting monolithic server...
cd ../monolithic
start /B npm start
REM Wait for server to start
timeout /t 10 /nobreak

echo Running tests against monolithic architecture...
k6 run --out json=../tests/test-results/monolith-results.json ../tests/architecture-test.js --env BASE_URL=http://localhost:3000

echo Stopping monolithic server...
REM Find and kill the Node.js process
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
  taskkill /F /PID %%a
)

echo.
echo === Testing Microservices Architecture ===
echo Starting microservices with Docker Compose...
cd ../microservices
docker-compose up -d
REM Wait for services to start
timeout /t 20 /nobreak

echo Running tests against microservices architecture...
k6 run --out json=../tests/test-results/microservices-results.json ../tests/architecture-test.js --env BASE_URL=http://localhost:3000

echo Stopping microservices...
docker-compose down

echo.
echo === Running Resilience Tests ===
echo Starting microservices for resilience test...
docker-compose up -d
REM Wait for services to start
timeout /t 20 /nobreak

echo Stopping product service to test resilience...
docker stop microservices_product-service_1

echo Running resilience test...
k6 run --out json=../tests/test-results/resilience-results.json ../tests/resilience-test.js --env BASE_URL=http://localhost:3000 --env SERVICE_TO_FAIL=product

echo Stopping all microservices...
docker-compose down

echo.
echo === Generating Comparison Report ===
cd ../tests
node generate-report.js

echo.
echo Testing completed! See test-results folder for detailed results.