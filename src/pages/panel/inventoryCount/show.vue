<template>
  <entity-show
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :show-expand-button="false"
    :show-edit-button="false"
    :after-load-input-data="afterLoadInputData" />
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
      <template v-if="inputData.col.name === 'quantity'">
        <div class="ltr">
          {{ inputData.col.value }}
        </div>
      </template>
      <template v-else-if="inputData.col.name === 'color'">
        <template v-if="inputData.props.row.color">
          <span :style="{ backgroundColor: inputData.props.row.color.color_hex, width: '10px', height:'10px', display: 'inline-block', marginLeft: '5px' }" />
          {{ inputData.props.row.color.name }}
        </template>
        <template v-else>
          -
        </template>
      </template>
      <template v-else-if="inputData.col.name === 'actual_quantity'">
        <div
          v-if="!entityData?.is_locked"
          class="q-mb-md">
          <q-input
            v-model="inputData.props.row.actual_quantity"
            :loading="updateItemLoading"
            :error="!inputData.props.row.actual_quantity"
            type="number" />
        </div>
        <template v-else>
          {{ inputData.col.value }}
        </template>
      </template>
      <template v-else-if="inputData.col.name === 'count_notes'">
        <div
          v-if="!entityData?.is_locked"
          class="q-mb-md">
          <q-input
            v-model="inputData.props.row.count_notes"
            :disable="entityData?.is_locked"
            :loading="updateItemLoading" />
        </div>
        <template v-else>
          {{ inputData.col.value }}
        </template>
      </template>
      <template v-else-if="inputData.col.name === 'action'">
        <div class="q-mb-md">
          <q-btn
            label="ثبت"
            color="primary"
            :disable="entityData?.is_locked"
            :loading="updateItemLoading"
            @click="updateItem(inputData.props.row)" />
        </div>
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
  <q-separator
    v-if="!entityData?.is_locked"
    class="q-my-md" />
  <portlet
    v-if="!entityData?.is_locked"
    title="ثبت مورد جدید">
    <template #actions>
      <q-btn
        color="primary"
        icon="add"
        flat
        :disable="!isValidForm"
        :loading="newItemLoading"
        @click="addItem" />
    </template>
    <div class="row q-col-gutter-md">
      <div class="col-md-2 col-12">
        <div class="outsideLabel">نوع</div>
        <div>
          <q-select
            v-model="transferItemType"
            :options="transferItemTypeOptions"
            emit-value
            map-options />
        </div>
      </div>
      <div class="col-md-2 col-12">
        <select-product
          v-if="transferItemType === 'App\\Models\\Product'"
          v-model:value="selectedProduct"
          :emit-value="false"
          :map-options="false" />
        <select-product-part
          v-else-if="transferItemType === 'App\\Models\\ProductPart'"
          v-model:value="selectedProductPart"
          :emit-value="false"
          :map-options="false" />
        <select-raw-material
          v-else-if="transferItemType === 'App\\Models\\RawMaterial'"
          v-model:value="selectedRawMaterial"
          :emit-value="false"
          :map-options="false" />
      </div>
      <div class="col-md-2 col-12">
        <select-color
          v-if="transferItemType"
          v-model:value="selectedColor"
          :emit-value="false"
          :map-options="false" />
      </div>
      <div class="col-md-2 col-12">
        <div class="outsideLabel">موجودی شمارش شده</div>
        <q-input
          v-model="quantity"
          :disable="!selectedTransferId"
          :loading="newItemLoading"
          type="number" />
      </div>
      <div class="col-md-4 col-12">
        <div class="outsideLabel">یادداشت مسئول</div>
        <q-input
          v-model="notes"
          :disable="!selectedTransferId"
          :loading="newItemLoading" />
      </div>
    </div>
  </portlet>
  <q-separator
    v-if="!entityData?.is_locked"
    class="q-my-md" />
  <div
    v-if="!entityData?.is_locked"
    class="row q-col-gutter-md">
    <div class="col-md-6 col-12 flex justify-center">
      <q-btn
        color="primary"
        label="اتمام انبار گردانی"
        :loading="finalizeLoading"
        @click="onClickFinalizeInventoryCount" />
      <q-dialog
        v-model="showDialog"
        :persistent="finalizeLoading">
        <confirmation
          title="اتمام انبار گردانی"
          message="از اتمام انبار گردانی اطمینان دارید؟"
          submit-label="بله"
          cancel-label="انصراف"
          icon="dangerous"
          title-color="error"
          :loading="finalizeLoading"
          @submit="onFinalizeInventoryCount"
          @cancel="hideDialog" />
      </q-dialog>
    </div>
    <div class="col-md-6 col-12 flex justify-center">
      <confirmation-button
        btn-color="red"
        btn-title="انصراف و حذف انبارگردانی"
        confirmation-title="حذف انبارگردانی"
        confirmation-message="آیا از حذف انبارگردانی اطمینان دارید؟"
        :loading="removeInventoryCountLoading"
        @accept="removeInventoryCount" />
    </div>
  </div>
</template>

<script setup lang="ts">
import getInputs from './inputs'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { EntityShow, EntityIndex } from 'quasar-crud'
import { computed, ref, shallowRef, watch } from 'vue'
import Portlet from 'src/components/cards/portlet.vue'
import type { ColorType } from 'src/repositories/color'
import type { ProductType } from 'src/repositories/product'
import Confirmation from 'src/components/cards/confirmation.vue'
import type { ProductPartType } from 'src/repositories/productPart'
import type { RawMaterialType } from 'src/repositories/rawMaterial'
import ConfirmationButton from 'src/components/controls/confirmationButton.vue'
import SelectColor from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectColor.vue'
import SelectProduct from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectProduct.vue'
import SelectProductPart from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectProductPart.vue'
import SelectRawMaterial from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectRawMaterial.vue'
import FormBuilderSelectColor from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectColor.vue'
import FormBuilderSelectProduct from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectProduct.vue'
import FormBuilderSelectRawMaterial from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectRawMaterial.vue'
import FormBuilderSelectProductPart from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectProductPart.vue'
import InventoryCountAPI, { type InventoryCountType, type InventoryCountItemType, type InventoryCountUpdateItemType } from 'src/repositories/inventoryCount'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const inventoryCountAPI = new InventoryCountAPI()

const isValidForm = computed(() => {
  if (!transferItemType.value) {
    return false
  }

  if (transferItemType.value === 'App\\Models\\Product' && !selectedColor.value) {
    return false
  }

  if (transferItemType.value === 'App\\Models\\ProductPart' && !selectedColor.value) {
    return false
  }

  if (!transferItemType.value) {
    return false
  }

  return !!quantity.value
})
const selectedTransfer = computed(() => {
  if (transferItemType.value === 'App\\Models\\Product') {
    return selectedProduct.value
  }

  if (transferItemType.value === 'App\\Models\\ProductPart') {
    return selectedProductPart.value
  }

  if (transferItemType.value === 'App\\Models\\RawMaterial') {
    return selectedRawMaterial.value
  }

  return null
})
const selectedTransferId = computed(() => {
  if (selectedTransfer.value) {
    // @ts-ignore
    return selectedTransfer.value.id
  }

  return null
})
const entityId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0))

const FormBuilderSelectColorComponent = shallowRef(FormBuilderSelectColor)
const FormBuilderSelectProductComponent = shallowRef(FormBuilderSelectProduct)
const FormBuilderSelectRawMaterialComponent = shallowRef(FormBuilderSelectRawMaterial)
const FormBuilderSelectProductPartComponent = shallowRef(FormBuilderSelectProductPart)

const showDialog = ref(false)
const entityIndexRef = ref()
const entityData = ref<InventoryCountType | null>(null)
const api = ref(inventoryCountAPI.endpoints.byId(entityId.value))
const listApi = ref(inventoryCountAPI.endpoints.items(entityId.value))
const label = ref('اطلاعات کلی انبار گردانی')
const listLabel = ref('موارد انبار گردانی')
const indexRouteName = ref('Panel.InventoryCount.List')
const showRouteName = ref('Panel.InventoryCount.Show')
const entityIdKey = ref('id')
const entityParamKey = ref('id')

const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id'
  },
  ...getInputs(),
  {
    type: 'checkbox',
    name: 'is_locked',
    responseKey: 'is_locked',
    label: 'بسته شده',
    col: 'col-md-4 col-12'
  }
])
const listInputs = ref([
  {
    type: FormBuilderSelectProductComponent,
    name: 'product_id',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderSelectRawMaterialComponent,
    name: 'raw_material_id',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderSelectProductPartComponent,
    name: 'product_part_id',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderSelectColorComponent,
    name: 'color_id',
    col: 'col-md-3 col-12'
  },
  {
    type: 'checkbox',
    name: 'missing_actual',
    label: 'شمارش نشده',
    placeholder: ' ',
    value: false,
    col: 'col-md-3 col-12'
  }
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
      field: (row: InventoryCountItemType) => {
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
      field: (row: InventoryCountItemType) => row.item?.name
    },
    {
      name: 'color',
      required: true,
      label: 'رنگ',
      align: 'left',
      field: (row: InventoryCountItemType) => row.color?.name
    },
    {
      name: 'system_quantity',
      required: true,
      label: 'موجودی سیستمی',
      align: 'left',
      field: (row: InventoryCountItemType) => parseFloat(row.system_quantity.toString()).toLocaleString()
    },
    {
      name: 'unit',
      required: true,
      label: 'واحد',
      align: 'left',
      // @ts-ignore
      field: (row: InventoryCountItemType) => row.item?.unit_small ? row.item.unit_small : 'عدد'
    },
    {
      name: 'actual_quantity',
      required: true,
      label: 'موجودی شمارش شده',
      align: 'left',
      field: (row: InventoryCountItemType) => row.actual_quantity
    },
    {
      name: 'count_notes',
      required: true,
      label: 'یادداشت مسئول',
      align: 'left',
      field: (row: InventoryCountItemType) => row.count_notes
    },
    {
      name: 'action',
      required: true,
      label: 'ثبت',
      align: 'left',
      field: '-'
    }
  ]
})
const itemIdentifyKey = ref('id')

const transferItemType = ref<'App\\Models\\Product' | 'App\\Models\\ProductPart' | 'App\\Models\\RawMaterial'>('App\\Models\\Product')
const transferItemTypeOptions = ref([
  {
    label: 'محصول',
    value: 'App\\Models\\Product'
  },
  {
    label: 'زیر محصول',
    value: 'App\\Models\\ProductPart'
  },
  {
    label: 'مواد اولیه',
    value: 'App\\Models\\RawMaterial'
  }
])
const selectedColor = ref<ColorType | undefined>(undefined)
const selectedProduct = ref<ProductType | undefined>(undefined)
const selectedProductPart = ref<ProductPartType | undefined>(undefined)
const selectedRawMaterial = ref<RawMaterialType | undefined>(undefined)
const quantity = ref<number | null>(null)
const notes = ref<string>('')
const newItemLoading = ref(false)
const updateItemLoading = ref(false)
const finalizeLoading = ref(false)
const removeInventoryCountLoading = ref(false)

function afterLoadInputData (data: InventoryCountType) {
  entityData.value = data
}

async function addItem () {
  if (!isValidForm.value) {
    return
  }

  const colorId = selectedColor.value?.id ? selectedColor.value.id : undefined
  const itemId = selectedTransferId.value ? selectedTransferId.value : undefined
  if (!colorId || !itemId) {
    return
  }

  try {
    newItemLoading.value = true
    await updateInventoryCountItem({
      color_id: colorId,
      item_id: itemId,
      item_type: transferItemType.value,
      actual_quantity: quantity.value ? quantity.value : 0,
      notes: notes.value
    })
    clearForm()
  } finally {
    newItemLoading.value = false
  }
}

async function updateItem (row: InventoryCountItemType) {
  const colorId = row.color?.id ? row.color.id : undefined
  const itemId = row.item?.id ? row.item.id : undefined
  const itemType = row.item_type ? row.item_type : undefined
  const actualQuantity = row.actual_quantity ? row.actual_quantity : undefined
  if (!itemId || !itemType || !actualQuantity) {
    return
  }

  try {
    updateItemLoading.value = true
    await updateInventoryCountItem({
      color_id: colorId,
      item_id: itemId,
      item_type: itemType,
      actual_quantity: actualQuantity,
      notes: row.count_notes
    })
  } finally {
    updateItemLoading.value = false
  }
}

function onClickFinalizeInventoryCount () {
  showDialog.value = true
}

async function onFinalizeInventoryCount () {
  try {
    finalizeLoading.value = true
    const result = await inventoryCountAPI.finalize(entityId.value, true)
    $q.notify({
      message: result.message,
      type: 'positive'
    })
  } finally {
    hideDialog()
    finalizeLoading.value = false
  }
}

async function updateInventoryCountItem (data: InventoryCountUpdateItemType) {
  try {
    const result = await inventoryCountAPI.updateItem(entityId.value, data)
    $q.notify({
      message: result.message,
      type: 'positive'
    })
  } finally {
    entityIndexRef.value.reload()
  }
}

function hideDialog () {
  showDialog.value = false
}

function clearForm () {
  selectedColor.value = undefined
  selectedProduct.value = undefined
  selectedProductPart.value = undefined
  selectedRawMaterial.value = undefined
  quantity.value = null
  notes.value = ''
}

async function removeInventoryCount () {
  try {
    removeInventoryCountLoading.value = true
    $q.notify({
      message: 'انبارگردانی با موفقیت حذف شد.',
      type: 'positive'
    })
    await inventoryCountAPI.delete(entityId.value)
    await router.push({ name: 'Panel.InventoryCount.List' })
  } finally {
    removeInventoryCountLoading.value = false
  }
}

watch(transferItemType, ()=>{
  clearForm()
})

</script>
