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
    type: 'color',
    name: 'color_hex',
    responseKey: 'color_hex',
    outsideLabel: 'رنگ',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  }
]
