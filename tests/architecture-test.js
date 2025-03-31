import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom metrics
const successRate = new Rate('success_rate');
const errorRate = new Rate('error_rate');
const latencyTrend = new Trend('latency');

// Configuration - change these values for different tests
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'; 
// Use BASE_URL=http://localhost:3000 for monolith
// Use BASE_URL=http://localhost:3000 for microservices API gateway

export let options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp-up to 10 users
    { duration: '1m', target: 50 },  // Ramp-up to 50 users
    { duration: '2m', target: 100 }, // Sustained load with 100 users
    { duration: '30s', target: 0 },  // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should complete below 500ms
    'success_rate': ['rate>0.95'],    // 95% of requests should be successful
  },
};

// Test data
const testUser = {
  email: `test${Date.now()}@example.com`,
  password: 'password123',
  name: 'Test User'
};

let authToken = null;
let createdProductId = null;
let createdOrderId = null;

export default function() {
  // User registration test
  const registerRes = http.post(`${BASE_URL}/api/users/register`, JSON.stringify(testUser), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(registerRes, {
    'user registration successful': (r) => r.status === 201 || r.status === 200,
  }) ? successRate.add(1) : errorRate.add(1);
  
  latencyTrend.add(registerRes.timings.duration);

  // User login test
  const loginRes = http.post(`${BASE_URL}/api/users/login`, JSON.stringify({
    email: testUser.email,
    password: testUser.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(loginRes, {
    'user login successful': (r) => r.status === 200,
    'received auth token': (r) => r.json('token') !== undefined,
  }) ? successRate.add(1) : errorRate.add(1);
  
  latencyTrend.add(loginRes.timings.duration);
  
  try {
    authToken = loginRes.json('token');
  } catch (e) {
    console.error('Failed to parse login response:', e);
  }
  
  if (authToken) {
    // Create product test
    const productRes = http.post(`${BASE_URL}/api/products`, JSON.stringify({
      name: `Test Product ${Date.now()}`,
      price: 19.99,
      description: 'Test product description'
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    });
    
    check(productRes, {
      'product creation successful': (r) => r.status === 201 || r.status === 200,
    }) ? successRate.add(1) : errorRate.add(1);
    
    latencyTrend.add(productRes.timings.duration);
    
    try {
      createdProductId = productRes.json('id') || productRes.json('_id');
    } catch (e) {
      console.error('Failed to parse product response:', e);
    }
    
    // Get products test
    const getProductsRes = http.get(`${BASE_URL}/api/products`);
    
    check(getProductsRes, {
      'get products successful': (r) => r.status === 200,
    }) ? successRate.add(1) : errorRate.add(1);
    
    latencyTrend.add(getProductsRes.timings.duration);
    
    if (createdProductId) {
      // Create order test
      const orderRes = http.post(`${BASE_URL}/api/orders`, JSON.stringify({
        products: [{
          productId: createdProductId,
          quantity: 1
        }]
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });
      
      check(orderRes, {
        'order creation successful': (r) => r.status === 201 || r.status === 200,
      }) ? successRate.add(1) : errorRate.add(1);
      
      latencyTrend.add(orderRes.timings.duration);
      
      try {
        createdOrderId = orderRes.json('id') || orderRes.json('_id');
      } catch (e) {
        console.error('Failed to parse order response:', e);
      }
      
      // Get orders test
      const getOrdersRes = http.get(`${BASE_URL}/api/orders`, {
        headers: { 
          'Authorization': `Bearer ${authToken}`
        },
      });
      
      check(getOrdersRes, {
        'get orders successful': (r) => r.status === 200,
      }) ? successRate.add(1) : errorRate.add(1);
      
      latencyTrend.add(getOrdersRes.timings.duration);
    }
  }
  
  sleep(1);
}