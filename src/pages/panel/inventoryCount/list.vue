<template>
  <entity-index
    ref="entityIndexRef"
    :value="inputs"
    :title="label"
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
      <template v-if="inputData.col.name === 'is_locked'">
        <div class="action-column-entity-index">
          <q-badge
            :color="inputData.props.row.is_locked ? 'green' : 'red'"
            class="q-px-sm">
            {{ inputData.props.row.is_locked ? 'بسته شده' : 'باز' }}
          </q-badge>
        </div>
      </template>
      <template v-else-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <q-btn
            color="primary"
            flat
            icon="visibility"
            :to="{ name: showRouteName, params: { id: inputData.props.row.id } }" />
        </div>
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { EntityIndex } from 'quasar-crud'
import { useDate } from 'src/composables/Date'
import InventoryCountAPI ,{ type InventoryCountType } from 'src/repositories/inventoryCount'
import FormBuilderSelectUser from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue'
import FormBuilderSelectInventory from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectInventory.vue'

const dateManager = useDate()
const inventoryCountAPI = new InventoryCountAPI()

const FormBuilderSelectUserComponent = shallowRef(FormBuilderSelectUser)
const FormBuilderSelectInventoryComponent = shallowRef(FormBuilderSelectInventory)

const api = ref(inventoryCountAPI.endpoints.base)
const label = ref('انبار گردانی ها')
const createRouteName = ref('Panel.InventoryCount.Create')
const showRouteName = ref('Panel.InventoryCount.Show')
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
      name: 'inventory',
      required: true,
      label: 'انبار',
      align: 'left',
      field: (row: InventoryCountType) => row.inventory?.name
    },
    {
      name: 'counter',
      required: true,
      label: 'مسئول مربوطه',
      align: 'left',
      field: (row: InventoryCountType) => row.counter?.firstname + ' ' + row.counter?.lastname
    },
    {
      name: 'is_locked',
      required: true,
      label: 'بسته شده',
      align: 'center'
    },
    {
      name: 'count_date',
      required: true,
      label: 'تاریخ انبار گردانی',
      align: 'left',
      field: (row: InventoryCountType) =>
        row.count_date ? dateManager.miladiToShamsi(row.count_date, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') : '-'
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: InventoryCountType) =>
        row.created_at ? dateManager.miladiToShamsi(row.created_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') : '-'
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

const inputs = ref([
  {
    type: 'hidden',
    name: 'sortation_field',
    value: 'created_at'
  },
  {
    type: 'hidden',
    name: 'sortation_order',
    value: 'asc'
  },
  {
    type: FormBuilderSelectInventoryComponent,
    name: 'inventory_id',
    label: 'انبار',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderSelectUserComponent,
    name: 'counter_user_id',
    label: 'مسئول مربوطه',
    col: 'col-md-3 col-12'
  },
  {
    type: 'date',
    name: 'count_date_since_date',
    label: 'از تاریخ',
    clearable: true,
    col: 'col-md-3 col-12'
  },
  {
    type: 'date',
    name: 'count_date_till_date',
    label: 'تا تاریخ',
    clearable: true,
    col: 'col-md-3 col-12'
  }
])
const entityIndexRef = ref()

</script>
