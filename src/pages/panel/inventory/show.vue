<template>
  <entity-show
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :edit-route-name="editRouteName"
    :show-expand-button="false"
  />
  <q-separator class="q-my-md" />
  <entity-index
    ref="entityIndexRef"
    :value="listInputs"
    :title="listLabel"
    :api="listApi"
    :table="table"
    :table-keys="tableKeys"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="false"
    :show-search-button="true"
    :row-key="itemIdentifyKey"
  >
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'quantity'">
        <div class="ltr">
          {{ inputData.col.value }}
        </div>
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import getInputs from './inputs';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { EntityShow, EntityIndex } from 'quasar-crud';
import InventoryAPI, { type InventoryItemType } from 'src/repositories/inventory';

const inventoryAPI = new InventoryAPI();
const route = useRoute();

const entityId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0));

const api = ref(inventoryAPI.endpoints.byId(entityId.value));
const listApi = ref(inventoryAPI.endpoints.items(entityId.value));
const label = ref('مشاهده انبار');
const listLabel = ref('موجودی انبار');
const indexRouteName = ref('Panel.Inventory.List');
const showRouteName = ref('Panel.Inventory.Show');
const editRouteName = ref('Panel.Inventory.Edit');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id',
  },
  ...getInputs()
]);
const listInputs = ref([
  {
    type: 'hidden',
    name: 'nonZero',
    value: '1'
  }
]);

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
      name: 'item_type',
      required: true,
      label: 'نوع',
      align: 'left',
      field: (row: InventoryItemType) => {
        if (row.item_type === 'App\\Models\\ProductPart') {
          return 'زیر محصول'
        } else if (row.item_type === 'App\\Models\\RawMaterial') {
          return 'مواد اولیه'
        } else if (row.item_type === 'App\\Models\\Product') {
          return 'محصول'
        }
      }
    },
    {
      name: 'item.name',
      required: true,
      label: 'نام',
      align: 'left',
      field: (row: InventoryItemType) => row.item?.name
    },
    {
      name: 'quantity',
      required: true,
      label: 'تعداد بر اساس حواله ها',
      align: 'left',
      field: (row: InventoryItemType) => row.quantity
    },
    {
      name: 'initial_stock',
      required: true,
      label: 'موجودی اولیه',
      align: 'left',
      field: (row: InventoryItemType) => row.item?.initial_stock
    },
    {
      name: 'current_stock',
      required: true,
      label: 'موجودی محاسبه شده',
      align: 'left',
      field: (row: InventoryItemType) => row.current_stock
    },
    {
      name: 'unit',
      required: true,
      label: 'واحد',
      align: 'left',
      // @ts-ignore
      field: (row: InventoryItemType) => row.item?.unit_small ? row.item.unit_small : 'عدد'
    },
  ],
});
const itemIdentifyKey = ref('id');
</script>
