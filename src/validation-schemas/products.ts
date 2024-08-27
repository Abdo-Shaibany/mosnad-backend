import { check, ValidationChain } from 'express-validator';

export const createProductValidationSchema: ValidationChain[] = [
  check('id')
    .optional({ nullable: true })
    .isInt({ gt: 0 })
    .withMessage('id must be a positive integer.'),

  check('name')
    .exists()
    .withMessage('name is required.')
    .isString()
    .withMessage('name must be a string.')
    .isLength({ min: 3 })
    .withMessage('name must be at least 3 characters long.'),

  check('categoryId')
    .exists()
    .withMessage('categoryId is required.')
    .isInt({ gt: 0 })
    .withMessage('categoryId must be a positive integer.'),

  check('length')
    .exists()
    .withMessage('length is required.')
    .isFloat({ gt: 0 })
    .withMessage('length must be a positive float.'),

  check('width')
    .exists()
    .withMessage('width is required.')
    .isFloat({ gt: 0 })
    .withMessage('width must be a positive float.'),

  check('height')
    .exists()
    .withMessage('height is required.')
    .isFloat({ gt: 0 })
    .withMessage('height must be a positive float.'),

  check('brand')
    .exists()
    .withMessage('brand is required.')
    .isString()
    .withMessage('brand must be a string.')
    .isLength({ min: 3 })
    .withMessage('brand must be at least 3 characters long.'),

  check('expiredAt')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('expiredAt must be a valid ISO date string.'),

  check('variantsBasic.*.type')
    .exists()
    .withMessage('variant type is required.')
    .isString()
    .withMessage('variant type must be a string.'),

  check('variantsBasic.*.value')
    .exists()
    .withMessage('variant value is required.')
    .isString()
    .withMessage('variant value must be a string.'),

  check('variants.*.id')
    .optional({ nullable: true })
    .isInt({ gt: 0 })
    .withMessage('variant id must be a positive integer.'),

  check('variants.*.value')
    .exists()
    .withMessage('variant value is required.')
    .isString()
    .withMessage('variant value must be a string.'),

  check('variants.*.SKU')
    .optional({ nullable: true })
    .isString()
    .withMessage('SKU must be a string.'),

  check('variants.*.imageId')
    .optional({ nullable: true })
    .isInt({ gt: 0 })
    .withMessage('imageId must be a positive integer or null.'),

  check('supplierId')
    .exists()
    .withMessage('supplierId is required.')
    .isInt({ gt: 0 })
    .withMessage('supplierId must be a positive integer.'),

  check('imageId')
    .exists()
    .withMessage('imageId is required.')
    .isInt({ gt: 0 })
    .withMessage('imageId must be a positive integer.'),
];
