const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Product service is running on port ${PORT}`);
});