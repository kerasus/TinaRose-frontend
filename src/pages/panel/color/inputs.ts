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
    type: 'color',
    name: 'color_hex',
    responseKey: 'color_hex',
    label: 'رنگ',
    placeholder: ' ',
    col: 'col-md-6 col-12',
  }
]
