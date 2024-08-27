import express from 'express';
import { checkSchema } from 'express-validator';
import { createOptionValidation } from 'src/validation-schemas/option';

import schemaErrorHandler from 'src/middleware/schema-error';
import { validatePagedRequest } from 'src/validation-schemas/get_request';
import { createTransactionValidation, updateTransactionValidation } from 'src/validation-schemas/transaction';

const router = express.Router();

// router.get('/', getAllBanks);

// router.post(
//   '/getPaged',
//   validatePagedRequest,
//   schemaErrorHandler,
//   getPagedBanks
// );

// router.get('/:id', getBankById);

// router.post('/', createTransactionValidation, schemaErrorHandler, createBank);

// router.delete('/:id', deleteBank);
export default router;
