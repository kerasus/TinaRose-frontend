import { inventoryTypeOptions } from 'src/repositories/inventory'

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
    col: 'col-md-6 col-12'
  },
  {
    type: 'select',
    name: 'type',
    responseKey: 'type',
    label: 'نوع انبار',
    placeholder: ' ',
    options: inventoryTypeOptions,
    col: 'col-md-6 col-12'
  },
  {
    type: 'input',
    name: 'description',
    responseKey: 'description',
    label: 'توضیحات',
    placeholder: ' ',
    col: 'col-md-12 col-12'
  }
]
