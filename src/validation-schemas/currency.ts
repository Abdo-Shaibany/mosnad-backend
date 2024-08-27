export const createCurrencyValidationSchema = {
    text: {
      notEmpty: {
        errorMessage: "text cannot be empty",
      },
      isString: {
        errorMessage: "text must be a string!",
      },
    },
    short: {
      notEmpty: {
        errorMessage: "short cannot be empty",
      },
      isString: {
        errorMessage: "short must be a string!",
      },
    },
  };
  
  export const updateCurrencyValidationSchema = {
    ...createCurrencyValidationSchema,
    id: {
      notEmpty: {
        errorMessage: "id cannot be empty",
      },
      custom: {
        options: (value: string) => {
          const _value = parseInt(value);
          return !isNaN(_value);
        },
        errorMessage: "id must be a numbers!",
      },
    },
  };