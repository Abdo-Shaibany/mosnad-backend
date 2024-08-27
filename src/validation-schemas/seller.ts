import { check, ValidationChain } from 'express-validator';

export const sellerCreateValidation: ValidationChain[] = [
    check('name')
        .notEmpty()
        .withMessage('Name cannot be empty.')
        .isString()
        .withMessage('Name must be a string.'),
    check('address')
        .notEmpty()
        .withMessage('Address cannot be empty.')
        .isString()
        .withMessage('Address must be a string.'),
    check('phone')
        .notEmpty()
        .withMessage('Phone cannot be empty.')
        .isString()
        .withMessage('Phone must be a string.'),
    check('user.email')
        .notEmpty()
        .withMessage('Email cannot be empty.')
        .isEmail()
        .withMessage('Invalid email format.'),
    check('user.username')
        .notEmpty()
        .withMessage('Username cannot be empty.')
        .isString()
        .withMessage('Username must be a string.'),
];

export const sellerUpdateValidation: ValidationChain[] = [
    check('id')
        .notEmpty()
        .withMessage('ID cannot be empty.')
        .isNumeric()
        .withMessage('ID must be a number.'),
    check('name')
        .notEmpty()
        .withMessage('Name cannot be empty.')
        .isString()
        .withMessage('Name must be a string.'),
    check('address')
        .notEmpty()
        .withMessage('Address cannot be empty.')
        .isString()
        .withMessage('Address must be a string.'),
    check('phone')
        .notEmpty()
        .withMessage('Phone cannot be empty.')
        .isString()
        .withMessage('Phone must be a string.'),
];