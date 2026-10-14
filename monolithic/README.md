# Monolithic application

Express + Mongoose implementation of the users, products and orders API. See the [root README](../README.md) for the API table and the comparison with the microservices version.

## Run

```bash
npm install
MONGO_URI=mongodb://localhost:27017/ecommerce JWT_SECRET=change-me npm start
```

| Variable | Default |
| --- | --- |
| `PORT` | `3000` |
| `MONGO_URI` | `mongodb://localhost:27017/ecommerce` |
| `JWT_SECRET` | `dev-secret-change-me` (development only) |

`GET /health` returns `{"status":"ok"}`.

## Layout

```
src/
├── app.js           # Entry point: connects to MongoDB, then listens
├── controllers/     # Request handlers
├── models/          # Mongoose schemas (User, Product, Order)
├── routes/          # Express routers
└── middleware/      # JWT signing and verification
```
