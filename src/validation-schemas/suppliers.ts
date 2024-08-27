import { check, ValidationChain } from 'express-validator';

// Validation for CreateSupplierAccount
export const validateCreateSupplierAccount: ValidationChain[] = [
  check('account.id')
    .optional({ nullable: true })
    .isInt({ gt: 0 })
    .withMessage('Bank ID must be a positive integer.'),

  check('account.account_number')
    .exists()
    .withMessage('Account number is required.')
    .isString()
    .withMessage('Account number must be a string.')
    .notEmpty()
    .withMessage('Account number cannot be empty.'),

  check('account.account_name')
    .exists()
    .withMessage('Account name is required.')
    .isString()
    .withMessage('Account name must be a string.')
    .notEmpty()
    .withMessage('Account name cannot be empty.'),

  check('account.bankId')
    .exists()
    .withMessage('Bank ID is required.')
    .isInt({ gt: 0 })
    .withMessage('Bank ID must be a positive integer.'),

  check('account.bank_currencyId')
    .exists()
    .withMessage('Bank currency ID is required.')
    .isInt({ gt: 0 })
    .withMessage('Bank currency ID must be a positive integer.'),

  // check('account.supplier_id')
  //   .optional()
  //   .isInt({ gt: 0 })
  //   .withMessage('Supplier ID must be a positive integer.'),

  check('account.bank_locationId')
    .exists()
    .withMessage('Bank location ID is required.')
    .isInt({ gt: 0 })
    .withMessage('Bank location ID must be a positive integer.'),
];

// Validation for CreateSupplier
export const validateCreateSupplier: ValidationChain[] = [
  check('id')
    .optional({ nullable: true })
    .isInt({ gt: 0 })
    .withMessage('Supplier ID must be a positive integer.'),

  check('name')
    .exists()
    .withMessage('Name is required.')
    .isString()
    .withMessage('Name must be a string.')
    .notEmpty()
    .withMessage('Name cannot be empty.'),

  check('company')
    .exists()
    .withMessage('Company is required.')
    .isString()
    .withMessage('Company must be a string.')
    .notEmpty()
    .withMessage('Company cannot be empty.'),

  check('company_address')
    .exists()
    .withMessage('Company address is required.')
    .isString()
    .withMessage('Company address must be a string.')
    .notEmpty()
    .withMessage('Company address cannot be empty.'),

  check('phone')
    .exists()
    .withMessage('Phone is required.')
    .isString()
    .withMessage('Phone must be a string.')
    .matches(/^[0-9]+$/)
    .withMessage('Phone must contain only digits.')
    .notEmpty()
    .withMessage('Phone cannot be empty.'),

  // Include validation for the CreateSupplierAccount object
  ...validateCreateSupplierAccount,
];
