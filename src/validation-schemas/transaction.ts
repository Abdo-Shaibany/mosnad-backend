import { check, ValidationChain } from 'express-validator';

export const createTransactionValidation: ValidationChain[] = [
    check('fromId')
        .notEmpty()
        .withMessage('fromId cannot be empty.')
        .isInt()
        .withMessage('fromId must be an integer.'),

    check('toId')
        .notEmpty()
        .withMessage('toId cannot be empty.')
        .isInt()
        .withMessage('toId must be an integer.'),

    check('description')
        .notEmpty()
        .withMessage('description cannot be empty.')
        .isString()
        .withMessage('description must be a string.'),

    check('amount')
        .notEmpty()
        .withMessage('amount cannot be empty.')
        .isInt()
        .withMessage('amount must be an integer.'),

    check('bank_currencyId')
        .notEmpty()
        .withMessage('bank_currencyId cannot be empty.')
        .isInt()
        .withMessage('bank_currencyId must be an integer.'),
];

export const updateTransactionValidation: ValidationChain[] = [
    check('id')
        .notEmpty()
        .withMessage('id cannot be empty.')
        .isInt()
        .withMessage('id must be an integer.'),

    check('fromId')
        .optional()
        .isInt()
        .withMessage('fromId must be an integer.'),

    check('toId')
        .optional()
        .isInt()
        .withMessage('toId must be an integer.'),

    check('description')
        .optional()
        .isString()
        .withMessage('description must be a string.'),

    check('amount')
        .optional()
        .isInt()
        .withMessage('amount must be an integer.'),

    check('bank_currencyId')
        .optional()
        .isInt()
        .withMessage('bank_currencyId must be an integer.'),
];