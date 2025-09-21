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
    :row-key="itemIdentifyKey"
  >
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <q-btn
            color="primary"
            flat
            icon="visibility"
            :to="{ name: showRouteName, params: { id: inputData.props.row.id } }"
          />
        </div>
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { EntityIndex } from 'quasar-crud';
import { useDate } from 'src/composables/Date';
import InventoryAPI, { type InventoryType, inventoryTypeOptions } from 'src/repositories/inventory';

const dateManager = useDate();
const inventoryAPI = new InventoryAPI();

const api = ref(inventoryAPI.endpoints.base);
const label = ref('انبار ها');
const createRouteName = ref('Panel.Inventory.Create');
const showRouteName = ref('Panel.Inventory.Show');
const itemIdentifyKey = ref('id');

const tableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page',
});

const table = ref({
  columns: [
    {
      name: 'name',
      required: true,
      label: 'نام',
      align: 'left',
      field: (row: InventoryType) => row.name,
    },
    {
      name: 'type',
      required: true,
      label: 'نوع',
      align: 'left',
      field: (row: InventoryType) => {
        if (!row.type) {
          return '-'
        }

        const target = inventoryTypeOptions.find(item=>item.value===row.type)

        return target?.label
      },
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: InventoryType) =>
        row.created_at ? dateManager.miladiToShamsi(row.created_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') : '-',
    },
    {
      name: 'actions',
      required: true,
      label: 'عملیات',
      align: 'left',
      field: () => '',
    },
  ],
});

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
    type: 'input',
    name: 'name',
    responseKey: 'name',
    label: 'نام',
    placeholder: ' ',
    col: 'col-md-3 col-12',
  },
  {
    type: 'select',
    name: 'type',
    label: 'نوع انبار',
    placeholder: ' ',
    options: inventoryTypeOptions,
    col: 'col-md-3 col-12'
  },
]);
const entityIndexRef = ref();

</script>
