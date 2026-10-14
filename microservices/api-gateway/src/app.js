const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Route prefix -> upstream service (overridable, e.g. for Kubernetes)
const upstreams = {
    '/api/users': process.env.USER_SERVICE_URL || 'http://user-service:3000',
    '/api/products': process.env.PRODUCT_SERVICE_URL || 'http://product-service:3000',
    '/api/orders': process.env.ORDER_SERVICE_URL || 'http://order-service:3000',
};

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Forward the request (method, full path, body, bearer token) to the owning service
for (const [prefix, target] of Object.entries(upstreams)) {
    app.use(prefix, async (req, res) => {
        const headers = { 'content-type': 'application/json' };
        if (req.headers.authorization) headers.authorization = req.headers.authorization;
        const hasBody = !['GET', 'HEAD'].includes(req.method);
        try {
            const upstream = await fetch(target + req.originalUrl, {
                method: req.method,
                headers,
                body: hasBody ? JSON.stringify(req.body ?? {}) : undefined,
                signal: AbortSignal.timeout(5000),
            });
            res
                .status(upstream.status)
                .type(upstream.headers.get('content-type') || 'application/json')
                .send(await upstream.text());
        } catch (err) {
            res.status(503).json({ message: 'Upstream service unavailable' });
        }
    });
}

app.listen(PORT, () => console.log(`API Gateway is running on port ${PORT}`));
