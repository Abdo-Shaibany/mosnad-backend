export const updateProductSupplyValidationSchema = {
  products: {
    isArray: {
      errorMessage: "products should be an array",
    },
    notEmpty: {
      errorMessage: "products cannot be empty",
    },
    custom: {
      options: (value: any) => {
        return value.length > 0;
      },
      errorMessage: "products must have one product within it",
    },
  },
  "products.*.id": {
    notEmpty: {
      errorMessage: "id cannot be empty",
    },
    custom: {
      options: (value: string) => {
        const _value = parseInt(value);
        return !isNaN(_value);
      },
      errorMessage: "id of product must be a numbers!",
    },
  },
  "products.*.confirmed": {
    optional: true,
    custom: {
      options: (value: string) => {
        const _value = parseInt(value);
        return !isNaN(_value);
      },
      errorMessage: "variantId must be a numbers!",
    },
  },
  "products.*.rejected": {
    notEmpty: {
      errorMessage: "amount cannot be empty",
    },
    custom: {
      options: (value: string) => {
        const _value = parseInt(value);
        return !isNaN(_value);
      },
      errorMessage: "variantId must be a numbers!",
    },
  },
};
