<script setup lang="ts">
import { useQuasar } from 'quasar'
import { ref, shallowRef } from 'vue'
import { useUser } from 'src/stores/user'
import { EntityIndex } from 'quasar-crud'
import { useDate } from 'src/composables/Date'
import { type UserRolesType } from 'src/repositories/user'
import DeleteBtn from 'src/components/controls/deleteBtn.vue'
import TransferPackageAPI, { type TransferPackageType } from 'src/repositories/transferPackage'
import FormBuilderSelectUser from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue'

defineProps<{
  userId?: number,
  role: UserRolesType,
}>()

const $q = useQuasar()
const dateManager = useDate()
const userManager = useUser()
const transferPackageAPI = new TransferPackageAPI()

const FormBuilderSelectUserComponent = shallowRef(FormBuilderSelectUser)

const entityIndexRef = ref()
// const workerFilters = [
//   {
//     type: 'hidden',
//     name: 'from_user_id',
//     value: props.userId
//   },
//   {
//     type: 'hidden',
//     name: 'to_user_id',
//     value: props.userId
//   },
//   {
//     type: 'date',
//     name: 'transfer_date',
//     outsideLabel: 'تاریخ حواله',
//     clearable: true,
//     col: 'col-md-4 col-12'
//   }
// ]

const itemIdentifyKey = ref('id')
const tableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page'
})
const table = ref({
  columns: [
    {
      name: 'name',
      required: true,
      label: 'نام',
      align: 'left',
      field: (row: TransferPackageType) => row.name
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: TransferPackageType) => row.created_at ?
        dateManager.miladiToShamsi(row.created_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') : '-'
    },
    {
      name: 'actions',
      required: true,
      label: 'عملیات',
      align: 'left',
      field: () => ''
    }
  ]
})
const api = ref(transferPackageAPI.endpoints.base)
const listLabel = ref('پک حواله ها')
const showRouteName = ref('Panel.TransferPackage.Show')
const createRouteName = ref('Panel.TransferPackage.Create')

const listInputs = ref([
  {
    type: 'input',
    name: 'name',
    label: 'نام',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  }
])

function afterRemove () {
  reloadList()
  $q.notify({
    message: 'حذف با موفقیت انجام شد.',
    type: 'positive'
  })
}

function reloadList () {
  entityIndexRef.value.reload()
}

function getTransferStatusColor (status: string) {
  if (status === 'pending') {
    return 'warning'
  } else if (status === 'approved') {
    return 'green'
  } else if (status === 'rejected') {
    return 'red'
  }

  return 'info'
}
</script>

<template>
  <entity-index
    ref="entityIndexRef"
    :value="listInputs"
    :title="listLabel"
    :api="api"
    :table="table"
    :table-keys="tableKeys"
    :create-route-name="createRouteName"
    :show-route-name="showRouteName"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="false"
    :show-search-button="true"
    :row-key="itemIdentifyKey">
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <delete-btn
            v-if="userManager.isManager || true"
            :row="inputData.props.row"
            :api="transferPackageAPI"
            @delete="afterRemove" />
          <q-btn
            color="primary"
            flat
            icon="visibility"
            :to="{ name: showRouteName, params: { id: inputData.props.row.id } }" />
        </div>
      </template>
      <template v-else-if="inputData.col.name === 'status'">
        <q-badge :color="getTransferStatusColor(inputData.props.row.status)">
          {{ inputData.props.row.status_label }}
        </q-badge>
        <span v-if="inputData.props.row.status !== 'pending'">
          در
        </span>
        <span v-if="inputData.props.row.status === 'approved'">
          {{ dateManager.miladiToShamsi(inputData.props.row.approved_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') }}
        </span>
        <span v-if="inputData.props.row.status === 'rejected'">
          {{ dateManager.miladiToShamsi(inputData.props.row.rejected_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') }}
        </span>
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>
