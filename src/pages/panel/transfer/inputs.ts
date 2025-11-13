import { shallowRef } from 'vue'
import { type UserRolesType } from 'src/repositories/user'
import { inventoryTypeOptions } from 'src/repositories/inventory'
import FormBuilderSelectUser from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue'
import FormBuilderSelectTransferItem from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectTransferItem.vue'

const FormBuilderSelectUserComponent = shallowRef(FormBuilderSelectUser)
const FormBuilderSelectTransferItemComponent = shallowRef(FormBuilderSelectTransferItem)

export function getFormData (role: UserRolesType, formData: any, userId: number) {
  console.log(userId)
  return formData
  // if (role === 'Manager') {
  //   return formData
  // }
  //
  // return {
  //   from_user_id: formData.fromToType === 'Outgoing' ? userId : formData.user_id,
  //   to_user_id: formData.fromToType === 'Incoming' ? userId : formData.user_id,
  //   transfer_date: formData.transfer_date,
  //   description: formData.description,
  //   items: formData.items,
  // }
}

export default (role: UserRolesType) => {
  console.log(role)
  const managerInputs: any = [
    {
      type: FormBuilderSelectUserComponent,
      name: 'from_user_id',
      label: 'از',
      col: 'col-md-6 col-12'
    },
    {
      type: 'select',
      name: 'from_inventory_type',
      label: 'از نوع انبار',
      placeholder: ' ',
      options: inventoryTypeOptions,
      col: 'col-md-6 col-12'
    },
    {
      type: FormBuilderSelectUserComponent,
      name: 'to_user_id',
      label: 'به',
      col: 'col-md-6 col-12'
    },
    {
      type: 'select',
      name: 'to_inventory_type',
      label: 'به نوع انبار',
      placeholder: ' ',
      options: inventoryTypeOptions,
      col: 'col-md-6 col-12'
    },
    {
      type: 'date',
      name: 'transfer_date',
      outsideLabel: 'تاریخ حواله',
      clearable: true,
      col: 'col-md-4 col-12'
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
      type: FormBuilderSelectTransferItemComponent,
      name: 'items',
      readonly: false,
      col: 'col-12'
    }
  ]
  // const workerInputs: any = [
  //   {
  //     type: 'select',
  //     name: 'fromToType',
  //     label: 'نوع حواله',
  //     placeholder: ' ',
  //     options: [
  //       {
  //         label: 'ارسال به',
  //         value: 'Outgoing'
  //       },
  //       {
  //         label: 'دریافت از',
  //         value: 'Incoming'
  //       }
  //     ],
  //     col: 'col-md-4 col-12'
  //   },
  //   {
  //     type: FormBuilderSelectUserComponent,
  //     name: 'user_id',
  //     label: 'شخص',
  //     col: 'col-md-4 col-12'
  //   },
  //   {
  //     type: 'date',
  //     name: 'transfer_date',
  //     outsideLabel: 'تاریخ حواله',
  //     clearable: true,
  //     col: 'col-md-4 col-12'
  //   },
  //   {
  //     type: 'input',
  //     name: 'description',
  //     responseKey: 'description',
  //     label: 'توضیحات',
  //     placeholder: ' ',
  //     col: 'col-12',
  //   }
  // ]
  //
  // if (role === 'Manager') {
  //   return managerInputs
  // }

  return managerInputs
}
