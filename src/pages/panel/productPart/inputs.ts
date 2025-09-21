export default () => [
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id',
  },
  {
    type: 'input',
    name: 'name',
    responseKey: 'name',
    label: 'نام',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'code',
    responseKey: 'code',
    label: 'کد',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'count_per_bunch',
    responseKey: 'count_per_bunch',
    label: 'تعداد در دسته',
    placeholder: ' ',
    inputType: 'number',
    col: 'col-md-6 col-12',
  },
  {
    type: 'input',
    name: 'initial_stock',
    responseKey: 'initial_stock',
    label: 'موجودی اولیه',
    placeholder: ' ',
    inputType: 'number',
    col: 'col-md-6 col-12',
  }
]
