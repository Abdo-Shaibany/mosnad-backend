import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import banksLocation from './src/routes/user';
import logger from './src/middleware/logger';
import notFound from './src/middleware/not-found';
import cors from 'cors';

import activty from "./src/routes/activity";
import auth from './src/routes/auth';
import roles from './src/routes/roles';
import user from './src/routes/user';

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

app.use('/api/activty', activty);
app.use('/api/auth', auth);
app.use('/api/roles', roles);
app.use('/api/user', user);


app.use(notFound);

// Set up a route for file uploads

app.listen(port, () => console.log(`server is running on port ${port}`));
