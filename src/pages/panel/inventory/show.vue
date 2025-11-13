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
    :show-expand-button="false" />
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
    :row-key="itemIdentifyKey">
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'color'">
        <template v-if="inputData.props.row.color">
          <span :style="{ backgroundColor: inputData.props.row.color.color_hex, width: '10px', height:'10px', display: 'inline-block', marginLeft: '5px' }" />
          {{ inputData.props.row.color.name }}
        </template>
        <template v-else>
          -
        </template>
      </template>
      <template v-else-if="inputData.col.name === 'quantity'">
        <div class="ltr">
          {{ inputData.col.value }}
        </div>
      </template>
      <template v-else-if="inputData.col.name === 'action'">
        <div class="action-column-entity-index">
          <q-btn
            v-if="parseFloat(inputData.props.row.quantity) === 0"
            color="red"
            flat
            icon="delete"
            :loading="removeEmptyItemLoading"
            @click="removeEmptyItem(inputData.props.row.inventory_id, inputData.props.row.id)" />
        </div>
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import getInputs from './inputs'
import { useQuasar } from 'quasar'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { EntityShow, EntityIndex } from 'quasar-crud'
import InventoryAPI, { type InventoryItemType } from 'src/repositories/inventory'

const $q = useQuasar()
const route = useRoute()
const inventoryAPI = new InventoryAPI()

const entityId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0))

const entityIndexRef = ref()
const api = ref(inventoryAPI.endpoints.byId(entityId.value))
const listApi = ref(inventoryAPI.endpoints.items(entityId.value))
const label = ref('مشاهده انبار')
const listLabel = ref('موجودی انبار')
const indexRouteName = ref('Panel.Inventory.List')
const showRouteName = ref('Panel.Inventory.Show')
const editRouteName = ref('Panel.Inventory.Edit')
const entityIdKey = ref('id')
const entityParamKey = ref('id')
const removeEmptyItemLoading = ref(false)

const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id'
  },
  ...getInputs()
])
const listInputs = ref([
  // {
  //   type: 'hidden',
  //   name: 'nonZero',
  //   value: '1'
  // }
])

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
      name: 'color',
      required: true,
      label: 'رنگ',
      align: 'left',
      field: (row: InventoryItemType) => row.color?.name
    },
    {
      name: 'quantity',
      required: true,
      label: 'موجودی',
      align: 'left',
      field: (row: InventoryItemType) => parseFloat(row.quantity.toString() ?? '0').toLocaleString('fa')
    },
    {
      name: 'unit',
      required: true,
      label: 'واحد',
      align: 'left',
      // @ts-ignore
      field: (row: InventoryItemType) => row.item?.unit_small ? row.item.unit_small : 'عدد'
    },
    {
      name: 'action',
      required: true,
      label: 'حذف',
      align: 'left'
    }
  ]
})
const itemIdentifyKey = ref('id')

async function removeEmptyItem (inventoryId: number, inventoryItemId: number) {
  try {
    removeEmptyItemLoading.value = true
    const result = await inventoryAPI.destroyInventoryItem(inventoryId, inventoryItemId)
    $q.notify({
      message: result.message,
      type: 'positive'
    })
  } finally {
    removeEmptyItemLoading.value = false
    entityIndexRef.value.reload()
  }
}
</script>
