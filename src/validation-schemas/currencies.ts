import { check, ValidationChain } from 'express-validator';

export const createCurrencyValidation: ValidationChain[] = [
  check('text')
    .isLength({ min: 3 })
    .withMessage('Text must be at least 3 characters.')
    .notEmpty()
    .withMessage('Text cannot be empty.')
    .isString()
    .withMessage('Text must be a string.'),
  check('id')
    .optional({
      nullable: true,
    })
    .isInt({ gt: 0 })
    .withMessage('ID must be a number.'),
  check('short')
    .isLength({ min: 2 })
    .withMessage('Short must be at least 2 characters.')
    .notEmpty()
    .withMessage('Short cannot be empty.')
    .isString()
    .withMessage('Short must be a string.'),
];
