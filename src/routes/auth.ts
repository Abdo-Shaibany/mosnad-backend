import express from 'express';

import schemaErrorHandler from 'src/middleware/schema-error';


import { loginValidation } from 'src/validation-schemas/auth';
import { login } from 'src/controllers/auth';

const router = express.Router();

router.post(
    '/login',
    loginValidation,
    schemaErrorHandler,
    login
);

export default router;
