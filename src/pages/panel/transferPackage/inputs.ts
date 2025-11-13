import { shallowRef } from 'vue'
import FormBuilderSelectTransferPackageItem from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectTransferPackageItem.vue'

const FormBuilderSelectTransferPackageItemComponent = shallowRef(FormBuilderSelectTransferPackageItem)

export default () => {
  return [
    {
      type: 'input',
      name: 'name',
      responseKey: 'name',
      label: 'نام',
      placeholder: ' ',
      col: 'col-12'
    },
    {
      type: 'input',
      name: 'description',
      responseKey: 'description',
      label: 'توضیحات',
      placeholder: ' ',
      col: 'col-12'
    },
    {
      type: FormBuilderSelectTransferPackageItemComponent,
      name: 'items',
      responseKey: 'items',
      readonly: false,
      col: 'col-12'
    }
  ]
}
