import { shallowRef } from 'vue'
import FormBuilderSelectFabric from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectFabric.vue'

const FormBuilderSelectFabricComponent = shallowRef(FormBuilderSelectFabric)

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
    type: 'input',
    name: 'code',
    responseKey: 'code',
    label: 'کد',
    placeholder: ' ',
    col: 'col-md-6 col-12'
  },
  {
    type: 'color',
    name: 'color_hex',
    responseKey: 'color_hex',
    label: 'رنگ',
    placeholder: ' ',
    col: 'col-md-6 col-12'
  },
  {
    type: FormBuilderSelectFabricComponent,
    name: 'fabric_id',
    responseKey: 'fabric',
    col: 'col-md-6 col-12'
  }
]
