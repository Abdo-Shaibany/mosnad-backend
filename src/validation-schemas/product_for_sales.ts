import { check, ValidationChain } from 'express-validator';

export const updateProductForSaleValidation: ValidationChain[] = [
  check('id')
    .notEmpty()
    .withMessage('id cannot be empty.')
    .isInt()
    .withMessage('id must be a number!'),

  check('status')
    .optional()
    .isIn(['active', 'pending'])
    .withMessage('status must be active or pending only!'),

  check('title')
    .isString()
    .withMessage('title must be a string!'),

  check('description')
    .isString()
    .withMessage('description must be a string!'),

  check('images')
    .isArray()
    .withMessage('images must be an array.')
    .notEmpty()
    .withMessage('image id cannot be empty.')
    .custom((value) => {
      value.forEach((imageId: string) => {
        const _value = parseInt(imageId);
        if (isNaN(_value)) {
          throw new Error('image id must be a number!');
        }
      });
      return true;
    }),

  check('variants')
    .isArray()
    .withMessage('variants must be an array.')
    .notEmpty()
    .withMessage('variants cannot be empty.')
    .custom((value) => {
      value.forEach((variant: any) => {
        if (!variant.id) {
          throw new Error('variant id cannot be empty.');
        }
        if (!variant.cost) {
          throw new Error('variant cost cannot be empty.');
        }
        if (!variant.costCurrency) {
          throw new Error('variant costCurrency cannot be empty.');
        }
        if (!variant.priceCurrency) {
          throw new Error('variant priceCurrency cannot be empty.');
        }
        if (!variant.price) {
          throw new Error('variant price cannot be empty.');
        }
        if (variant.status !== false) {
          throw new Error('variant status cannot be empty.');
        }
      });
      return true;
    }),
];