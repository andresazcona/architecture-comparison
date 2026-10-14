// Functional smoke test: runs the same user flow as architecture-test.js once
// and asserts on every response. Usage: node tests/smoke.js [BASE_URL]
// Requires Node 18+ (global fetch) and a running monolith or API gateway.
const assert = require('node:assert/strict');

const BASE_URL = process.argv[2] || process.env.BASE_URL || 'http://localhost:3000';
const unique = Date.now();
const user = { username: `smoke${unique}`, email: `smoke${unique}@example.com`, password: 'password123' };

async function call(method, path, body, token) {
    const res = await fetch(BASE_URL + path, {
        method,
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: body && JSON.stringify(body),
    });
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : null };
}

(async () => {
    let r = await call('POST', '/api/users/register', user);
    assert.equal(r.status, 201, 'register');

    r = await call('POST', '/api/users/register', user);
    assert.equal(r.status, 409, 'duplicate register is rejected');

    r = await call('POST', '/api/users/login', { email: user.email, password: 'wrong' });
    assert.equal(r.status, 401, 'wrong password is rejected');

    r = await call('POST', '/api/users/login', { email: user.email, password: user.password });
    assert.equal(r.status, 200, 'login');
    const token = r.body.token;
    assert.ok(token, 'login returns a token');

    r = await call('GET', '/api/users/profile');
    assert.equal(r.status, 403, 'profile without token');

    r = await call('GET', '/api/users/profile', null, token);
    assert.equal(r.status, 200, 'profile');
    assert.equal(r.body.username, user.username);
    assert.equal(r.body.password, undefined, 'password hash is never returned');

    r = await call('POST', '/api/products', { name: 'Widget', price: 19.99, description: 'A widget' });
    assert.equal(r.status, 403, 'creating a product requires a token');

    r = await call('POST', '/api/products', { name: 'Widget', price: 19.99, description: 'A widget' }, token);
    assert.equal(r.status, 201, 'create product');
    const productId = r.body._id;

    r = await call('GET', '/api/products');
    assert.equal(r.status, 200, 'list products');
    assert.ok(r.body.some((p) => p._id === productId), 'created product is listed');

    r = await call('PUT', `/api/products/${productId}`, { price: 24.5 }, token);
    assert.equal(r.status, 200, 'update product');
    assert.equal(r.body.price, 24.5);

    r = await call('POST', '/api/orders', { productId, quantity: 2 }, token);
    assert.equal(r.status, 201, 'create order');
    const orderId = r.body._id;

    r = await call('GET', '/api/orders', null, token);
    assert.equal(r.status, 200, 'list orders');
    assert.ok(r.body.some((o) => o._id === orderId), 'created order is listed');

    r = await call('GET', `/api/orders/${orderId}`, null, token);
    assert.equal(r.status, 200, 'get order');
    assert.equal(r.body.quantity, 2);

    r = await call('DELETE', `/api/products/${productId}`, null, token);
    assert.equal(r.status, 204, 'delete product');

    console.log(`Smoke test passed against ${BASE_URL}`);
})().catch((err) => {
    console.error(`Smoke test FAILED against ${BASE_URL}: ${err.message}`);
    process.exit(1);
});
