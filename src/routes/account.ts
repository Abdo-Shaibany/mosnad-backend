import express from 'express';


import auth from 'src/middleware/auth';
import { getAccountBySupplierId, getPlatformAccount } from 'src/controllers/account';

const router = express.Router();

router.get('/mainAccount', auth, getPlatformAccount);
router.get('/:id', auth, getAccountBySupplierId);


export default router;
