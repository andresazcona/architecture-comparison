import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// This test checks system resilience when one component fails

const errorRate = new Rate('error_rate');
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const SERVICE_TO_FAIL = __ENV.SERVICE_TO_FAIL || 'product'; // Options: user, product, order

export let options = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp-up to 50 users
    { duration: '1m', target: 50 },  // Sustained load with 50 users
    { duration: '30s', target: 0 },  // Ramp-down
  ],
};

export default function() {
  // We'll test routes that don't involve the failed service
  if (SERVICE_TO_FAIL === 'product') {
    // Test user and order routes
    const userRes = http.get(`${BASE_URL}/api/users/profile`);
    check(userRes, {
      'user service available': (r) => r.status !== 503, 
    }) ? null : errorRate.add(1);
    
    // Also test for graceful failures when requesting product data
    const productRes = http.get(`${BASE_URL}/api/products`);
    check(productRes, {
      'product service unavailable but handled gracefully': (r) => r.status !== 500,
    }) ? null : errorRate.add(1);
  } 
  else if (SERVICE_TO_FAIL === 'user') {
    // Test product and order routes
    const productRes = http.get(`${BASE_URL}/api/products`);
    check(productRes, {
      'product service available': (r) => r.status !== 503,
    }) ? null : errorRate.add(1);
  }
  else if (SERVICE_TO_FAIL === 'order') {
    // Test user and product routes
    const userRes = http.get(`${BASE_URL}/api/users/profile`);
    const productRes = http.get(`${BASE_URL}/api/products`);
    
    check(userRes, {
      'user service available': (r) => r.status !== 503,
    }) ? null : errorRate.add(1);
    
    check(productRes, {
      'product service available': (r) => r.status !== 503,
    }) ? null : errorRate.add(1);
  }
  
  sleep(1);
}