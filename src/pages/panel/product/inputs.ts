export default () => [
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id'
  },
  {
    type: 'input',
    name: 'name',
    responseKey: 'name',
    label: 'نام',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: 'input',
    name: 'code',
    responseKey: 'code',
    label: 'کد',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: 'input',
    name: 'initial_stock',
    responseKey: 'initial_stock',
    label: 'موجودی اولیه',
    placeholder: ' ',
    inputType: 'number',
    col: 'col-md-4 col-12'
  },
  {
    type: 'input',
    name: 'unit_small',
    responseKey: 'unit_small',
    label: 'واحد جز',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: 'input',
    name: 'unit_large',
    responseKey: 'unit_large',
    label: 'واحد کل',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: 'input',
    name: 'conversion_rate',
    responseKey: 'conversion_rate',
    label: 'تعداد واحد جز در واحد کل',
    placeholder: ' ',
    inputType: 'number',
    col: 'col-md-4 col-12'
  }
]
