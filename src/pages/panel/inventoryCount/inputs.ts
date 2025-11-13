import { shallowRef } from 'vue'
import FormBuilderSelectUser from 'components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue'
import FormBuilderSelectInventory from 'components/controls/formBuilderCustomInput/FormBuilderSelectInventory.vue'

const FormBuilderSelectUserComponent = shallowRef(FormBuilderSelectUser)
const FormBuilderSelectInventoryComponent = shallowRef(FormBuilderSelectInventory)

export default () => [
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id'
  },
  {
    type: FormBuilderSelectInventoryComponent,
    name: 'inventory_id',
    responseKey: 'inventory',
    label: 'انبار',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderSelectUserComponent,
    name: 'counter_user_id',
    responseKey: 'counter',
    label: 'مسئول مربوطه',
    col: 'col-md-4 col-12'
  },
  {
    type: 'date',
    name: 'count_date',
    responseKey: 'count_date',
    label: 'تاریخ انبار گردانی',
    col: 'col-md-4 col-12'
  }
]
