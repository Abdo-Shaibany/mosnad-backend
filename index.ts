import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import suppliers from './src/routes/suppliers';
import banks from './src/routes/banks';
import banksLocation from './src/routes/banks_locations';
import bankCurrencies from './src/routes/banks_currencies';
import products from './src/routes/products';
import images from './src/routes/images';
import auth from './src/routes/auth';
import accounts from './src/routes/account';
import seller from './src/routes/seller';
import inventorySupply from './src/routes/supply_inventory';
import productForSales from './src/routes/product_for_sales';
import transactions from './src/routes/transaction';
import categories from './src/routes/categories';
import inventories from './src/routes/inventories';
import logger from './src/middleware/logger';
import notFound from './src/middleware/not-found';
import errorHandler from './src/middleware/error';
import cors from 'cors';
import { authorizeRoles } from 'src/middleware/role';

const port = process.env['PORT'] || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Body parser middleware
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/suppliers', suppliers);

app.use('/api/products', products);
app.use('/api/inventory-supplies', inventorySupply);
app.use('/api/products-for-sales', productForSales);
app.use('/api/transactions', transactions);

app.use('/api/categories', categories);
app.use('/api/inventories', inventories);
app.use('/api/banks', banks);
app.use('/api/banks-locations', banksLocation);
app.use('/api/banks-currencies', bankCurrencies);
app.use('/api/images', images);
app.use('/api/auth', auth);
app.use('/api/accounts', accounts);
app.use('/api/seller', seller);

app.use(notFound);
app.use(errorHandler);

// Set up a route for file uploads

app.listen(port, () => console.log(`server is running on port ${port}`));
