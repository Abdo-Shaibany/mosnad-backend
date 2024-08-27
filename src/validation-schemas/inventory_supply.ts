import { check, ValidationChain } from 'express-validator';

export const createInventorySupplyValidation: ValidationChain[] = [
  check('inventoryId')
    .notEmpty()
    .withMessage('inventoryId cannot be empty.')
    .isInt({ gt: 0 })
    .withMessage('inventoryId must be a positive integer.'),

  check('supplierId')
    .notEmpty()
    .withMessage('supplierId cannot be empty.')
    .isInt({ gt: 0 })
    .withMessage('supplierId must be a positive integer.'),

  check('PO')
    .optional()
    .isLength({ min: 3 })
    .withMessage('PO must be at least 3 characters.')
    .isString()
    .withMessage('PO must be a string.'),

  check('note').optional().isString().withMessage('Note must be a string.'),

  check('refNumber')
    .optional()
    .isString()
    .withMessage('refNumber must be a string.'),

  check('productsSupply')
    .isArray()
    .withMessage('Products supply must be an array.')
    .notEmpty()
    .withMessage('Products supply cannot be empty.')
    .custom((value) => {
      for (const product of value) {
        if (
          !product.productId ||
          typeof product.productId !== 'number' ||
          product.productId <= 0
        ) {
          throw new Error('Each product supply must have a valid product ID.');
        }
        if (!product.variantName || typeof product.variantName !== 'string') {
          throw new Error(
            'Each product supply must have a valid variant name.'
          );
        }
        if (!product.variantSKU || typeof product.variantSKU !== 'string') {
          throw new Error('Each product supply must have a valid variant SKU.');
        }
        if (!product.amount || parseInt(product.amount) <= 0) {
          throw new Error('Each product supply must have a valid amount.');
        }
      }
      return true;
    }),
];

export const updateInventorySupplyValidation: ValidationChain[] = [
  check('id')
    .notEmpty()
    .withMessage('id cannot be empty.')
    .isInt({ gt: 0 })
    .withMessage('id must be a positive integer.'),

  check('status')
    .optional()
    .isIn(['pending', 'cancelled', 'done'])
    .withMessage(
      'status must be one of the following: pending, cancelled, done.'
    ),

  check('productsSupply')
    .isArray()
    .withMessage('Products supply must be an array.')
    .notEmpty()
    .withMessage('Products supply cannot be empty.')
    .custom((value) => {
      for (const product of value) {
        if (
          !product.id ||
          typeof product.id !== 'number' ||
          product.id <= 0
        ) {
          throw new Error('Each product supply must have a valid ID.');
        }
        if (
          !product.actualAmount ||
          typeof parseInt(product.actualAmount) !== 'number' ||
          parseInt(product.actualAmount) <= 0
        ) {
          throw new Error('Each amount should be a number.');
        }
      }
      return true;
    }),
];
