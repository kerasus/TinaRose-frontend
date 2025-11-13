<template>
  <entity-index
    ref="entityIndexRef"
    :value="inputs"
    :title="label"
    :api="api"
    :table="table"
    :table-keys="tableKeys"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="false"
    :show-search-button="true"
    :row-key="itemIdentifyKey">
    <template #toolbar>
      <q-btn
        flat
        round
        icon="search"
        @click="search">
        <q-tooltip>
          جستجو
        </q-tooltip>
      </q-btn>
      <q-btn
        flat
        round
        icon="fa-regular fa-file-excel"
        :loading="exportCSVLoading"
        @click="exportCSV">
        <q-tooltip>
          خروجی اکسل
        </q-tooltip>
      </q-btn>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { EntityIndex } from 'quasar-crud'
import { userRoleOptions } from 'src/repositories/user'
import ProductionAPI from 'src/repositories/production'
import { FormBuilderAssist } from 'quasar-form-builder'
import FormBuilderSelectUser from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue'
import FormBuilderSelectColor from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectColor.vue'
import FormBuilderSelectFabric from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectFabric.vue'
import FormBuilderSelectProductPart from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectProductPart.vue'

const productionAPI = new ProductionAPI()

const formBuilderSelectUserComponent = shallowRef(FormBuilderSelectUser)
const formBuilderSelectColorComponent = shallowRef(FormBuilderSelectColor)
const formBuilderSelectFabricComponent = shallowRef(FormBuilderSelectFabric)
const formBuilderSelectProductPartComponent = shallowRef(FormBuilderSelectProductPart)

const entityIndexRef = ref()
const exportCSVLoading = ref(false)
const api = ref(productionAPI.endpoints.summary)
const label = ref('گزارش تولیدات')
const itemIdentifyKey = ref('id')

const tableKeys = ref({
  data: '',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page'
})

const table = ref({
  columns: [
    {
      name: 'product_part',
      required: true,
      label: 'زیر محصول',
      align: 'left',
      field: (row: any) => row.product_part_name
    },
    {
      name: 'color_name',
      required: true,
      label: 'رنگ',
      align: 'left',
      field: (row: any) => row.color_name ? row.color_name : '-'
    },
    {
      name: 'fabric_name',
      required: true,
      label: 'پارچه',
      align: 'left',
      field: (row: any) => row.fabric_name ? row.fabric_name : '-'
    },
    {
      name: 'total_bunch',
      required: true,
      label: 'تعداد دسته',
      align: 'left',
      field: (row: any) => parseFloat(row.total_bunch).toLocaleString()
    },
    {
      name: 'total_petals',
      required: true,
      label: 'تعداد گلبرک',
      align: 'left',
      field: (row: any) => parseFloat(row.total_petals).toLocaleString()
    }
  ]
})
const inputs = ref([
  {
    type: 'select',
    name: 'role',
    label: 'نقش',
    placeholder: ' ',
    options: userRoleOptions.filter((item)=>item.value !== 'Manager' && item.value !== 'Accountant'),
    col: 'col-md-3 col-12'
  },
  {
    type: 'date',
    name: 'production_date_from',
    outsideLabel: 'تاریخ تولید از',
    clearable: true,
    col: 'col-md-3 col-12'
  },
  {
    type: 'date',
    name: 'production_date_to',
    outsideLabel: 'تاریخ تولید تا ',
    clearable: true,
    col: 'col-md-3 col-12'
  },
  {
    type: formBuilderSelectProductPartComponent,
    name: 'product_part_id',
    col: 'col-md-3 col-12'
  },
  {
    type: formBuilderSelectUserComponent,
    name: 'user_id',
    col: 'col-md-3 col-12'
  },
  {
    type: formBuilderSelectFabricComponent,
    name: 'fabric_id',
    col: 'col-md-3 col-12'
  },
  {
    type: formBuilderSelectColorComponent,
    name: 'color_id',
    col: 'col-md-3 col-12'
  }
])

async function exportCSV () {
  exportCSVLoading.value = true
  const filter = FormBuilderAssist.getFormData(inputs.value)
  try {
    const exportResult = await productionAPI.summaryExport(filter)
    const url = window.URL.createObjectURL(exportResult.blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', exportResult.filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } finally {
    exportCSVLoading.value = false
  }
}

async function search () {
  entityIndexRef.value.reload()
}
</script>
