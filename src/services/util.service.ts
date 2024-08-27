export const searchFieldsCreator = (fields: string[], search: string) => {
  if (!search) return undefined;
  let res: any[] = [];
  fields.forEach((field) => {
    let ele: any = {};

    ele[field] = {
      contains: search ?? '',
      mode: 'insensitive',
    };

    res.push(ele);
  });
  return res;
};

// export const filterFieldsCreator = (
//   filters: { field: string; condition: string; value: string }[],
//   fields: string[]
// ) => {
//   if (!filters) return [];

//   let res: any[] = [];
//   filters.forEach((filter) => {
//     let ele: any = {};
//     if (!fields.includes(filter.field)) return;

//     ele[filter.field] = {
//       [filter.condition]: isNaN(parseInt(filter.value))
//         ? filter.value
//         : parseInt(filter.value),
//       mode: isNaN(parseInt(filter.value)) ? 'insensitive' : undefined,
//     };
//     res.push(ele);
//   });
//   return res;
// };

// export const orderByCreator = (
//   sorts: { key: string; value: 'asc' | 'desc' }[]
// ) => {
//   if (!sorts) return [];

//   let res: any[] = [];
//   sorts.forEach((sort) => {
//     let ele: any = {};
//     ele[sort.key] = sort.value;
//     res.push(ele);
//   });
//   return res;
// };
