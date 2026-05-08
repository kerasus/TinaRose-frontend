export default () => [
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id'
  },
  {
    type: 'input',
    name: 'title',
    responseKey: 'title',
    label: 'عنوان',
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
    name: 'description',
    responseKey: 'description',
    label: 'توضیحات',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  }
]
