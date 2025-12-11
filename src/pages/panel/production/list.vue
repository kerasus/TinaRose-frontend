<template>
  <div class="q-mb-md">
    <q-btn
      v-if="userManager.isFabricCutter"
      color="primary"
      label="ثبت برش کاری جدید"
      :to="{ name: 'Panel.Production.Create', params: { worker_role: 'fabric-cutter' }}" />
    <q-btn
      v-if="userManager.isColoringWorker"
      color="primary"
      label="ثبت رنگ کاری جدید"
      :to="{ name: 'Panel.Production.Create', params: { worker_role: 'coloring' }}" />
    <q-btn
      v-if="userManager.isMoldingWorker"
      color="primary"
      label="ثبت اتوکاری جدید"
      :to="{ name: 'Panel.Production.Create', params: { worker_role: 'molding' }}" />
  </div>
  <entity-index
    ref="entityIndexRef"
    :value="inputs"
    :title="label"
    :api="api"
    :table="table"
    :table-keys="tableKeys"
    :show-route-name="showRouteName"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="false"
    :show-search-button="true"
    :row-key="itemIdentifyKey">
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <q-btn
            v-if="!inputData.props.row.approved_at"
            color="success"
            class="q-mr-md"
            @click="confirmApproveProductionItem(inputData.props.row)">
            تایید
          </q-btn>
          <delete-btn
            :row="inputData.props.row"
            :api="productionAPI"
            @change="afterRemove" />
          <q-btn
            v-if="inputData.props.row.description"
            color="primary"
            flat>
            توضیحات
            <q-tooltip>
              {{ inputData.props.row.description }}
            </q-tooltip>
          </q-btn>
        </div>
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
  <q-dialog
    v-model="approveDialog"
    :persistent="approveLoading">
    <confirmation
      title="تایید تولید"
      message="آیا از تایید تولید اطمینان دارید؟"
      submit-label="بله"
      cancel-label="انصراف"
      icon="dangerous"
      title-color="warning"
      :loading="approveLoading"
      @submit="approveProductionItem"
      @cancel="onCancelApproveProductionItem">
      <div
        v-if="selectedProductionItemToApprove"
        class="row">
        <div class="col-md-6 col-xs-6">
          پرسنل:
          {{ selectedProductionItemToApprove.user.firstname }}
          {{ selectedProductionItemToApprove.user.lastname }}
        </div>
        <div class="col-md-6 col-xs-6">
          زیر محصول:
          {{ selectedProductionItemToApprove.product_part?.name }}
        </div>
        <div class="col-md-6 col-xs-6">
          پارچه:
          {{ selectedProductionItemToApprove.fabric?.name }}
        </div>
        <div class="col-md-6 col-xs-6">
          رنگ:
          {{ selectedProductionItemToApprove.color?.name }}
        </div>
        <div class="col-md-6 col-xs-6">
          تعداد دسته:
          {{ parseFloat(selectedProductionItemToApprove.bunch_count.toString() ?? '0').toLocaleString('fa') }}
        </div>
        <div class="col-md-6 col-xs-6">
          تعداد گلبرگ:
          {{ ((selectedProductionItemToApprove.product_part?.count_per_bunch ?? 0) * (selectedProductionItemToApprove.bunch_count ?? 0)).toLocaleString('fa') }}
        </div>
        <div class="col-md-6 col-xs-6">
          تاریخ تولید:
          {{ selectedProductionItemToApprove.production_date ? dateManager.miladiToShamsi(selectedProductionItemToApprove.production_date, 'YYYY-MM-DD', 'jYYYY/jMM/jDD') : '-' }}
        </div>
        <div class="col-md-6 col-xs-6">
          زمان ایجاد:
          {{ selectedProductionItemToApprove.created_at ? dateManager.miladiToShamsi(selectedProductionItemToApprove.created_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') : '-' }}
        </div>
      </div>
    </confirmation>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { ref, shallowRef } from 'vue'
import { useUser } from 'src/stores/user'
import { EntityIndex } from 'quasar-crud'
import { useDate } from 'src/composables/Date'
import { userRoleOptions } from 'src/repositories/user'
import DeleteBtn from 'src/components/controls/deleteBtn.vue'
import Confirmation from 'src/components/cards/confirmation.vue'
import ProductionAPI, { type ProductionType } from 'src/repositories/production'
import FormBuilderSelectUser from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue'
import FormBuilderSelectColor from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectColor.vue'
import FormBuilderSelectFabric from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectFabric.vue'
import FormBuilderSelectProductPart from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectProductPart.vue'

const $q = useQuasar()
const dateManager = useDate()
const userManager = useUser()
const productionAPI = new ProductionAPI()

const formBuilderSelectUserComponent = shallowRef(FormBuilderSelectUser)
const formBuilderSelectColorComponent = shallowRef(FormBuilderSelectColor)
const formBuilderSelectFabricComponent = shallowRef(FormBuilderSelectFabric)
const formBuilderSelectProductPartComponent = shallowRef(FormBuilderSelectProductPart)

const approveDialog = ref(false)
const approveLoading = ref(false)
const selectedProductionItemToApprove = ref<ProductionType | null>(null)
const api = ref(productionAPI.endpoints.base)
const label = ref('تولید ها')
const showRouteName = ref('Panel.Production.Show')
const itemIdentifyKey = ref('id')

const tableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page'
})

const managerInputs = [
  {
    type: formBuilderSelectUserComponent,
    name: 'user_id',
    col: 'col-md-4 col-12'
  },
  {
    type: formBuilderSelectProductPartComponent,
    name: 'product_part_id',
    col: 'col-md-4 col-12'
  },
  {
    type: formBuilderSelectFabricComponent,
    name: 'fabric_id',
    col: 'col-md-4 col-12'
  },
  {
    type: formBuilderSelectColorComponent,
    name: 'color_id',
    col: 'col-md-4 col-12'
  },
  {
    type: 'select',
    name: 'role',
    label: 'نقش',
    placeholder: ' ',
    options: userRoleOptions.filter((item)=>item.value !== 'Manager' && item.value !== 'Accountant'),
    col: 'col-md-4 col-12'
  },
  {
    type: 'date',
    name: 'production_date',
    outsideLabel: 'تاریخ تولید',
    clearable: true,
    col: 'col-md-4 col-12'
  }
]
const moldingWorkerInputs = [
  {
    type: 'hidden',
    name: 'user_id',
    value: userManager.me?.id
  },
  {
    type: formBuilderSelectProductPartComponent,
    name: 'product_part_id',
    col: 'col-md-4 col-12'
  },
  {
    type: 'date',
    name: 'production_date',
    outsideLabel: 'تاریخ تولید',
    clearable: true,
    col: 'col-md-4 col-12'
  }
]
const fabricCutterWorkerInputs = [
  {
    type: 'hidden',
    name: 'user_id',
    value: userManager.me?.id
  },
  {
    type: formBuilderSelectProductPartComponent,
    name: 'product_part_id',
    col: 'col-md-4 col-12'
  },
  {
    type: formBuilderSelectFabricComponent,
    name: 'fabric_id',
    col: 'col-md-4 col-12'
  },
  {
    type: 'date',
    name: 'production_date',
    outsideLabel: 'تاریخ تولید',
    clearable: true,
    col: 'col-md-4 col-12'
  }
]
const coloringWorkerInputs = [
  {
    type: 'hidden',
    name: 'user_id',
    value: userManager.me?.id
  },
  {
    type: formBuilderSelectProductPartComponent,
    name: 'product_part_id',
    col: 'col-md-4 col-12'
  },
  {
    type: formBuilderSelectColorComponent,
    name: 'color_id',
    col: 'col-md-4 col-12'
  },
  {
    type: 'date',
    name: 'production_date',
    outsideLabel: 'تاریخ تولید',
    clearable: true,
    col: 'col-md-4 col-12'
  }
]

const managerColumns = {
  columns: [
    {
      name: 'user',
      required: true,
      label: 'پرسنل',
      align: 'left',
      field: (row: ProductionType) => row.user?.firstname + ' ' + row.user?.lastname
    },
    {
      name: 'product_part',
      required: true,
      label: 'زیر محصول',
      align: 'left',
      field: (row: ProductionType) => row.product_part?.name
    },
    {
      name: 'fabric_id',
      required: true,
      label: 'پارچه',
      align: 'left',
      field: (row: ProductionType) => row.fabric?.name
    },
    {
      name: 'color',
      required: true,
      label: 'رنگ',
      align: 'left',
      field: (row: ProductionType) => row.color?.name
    },
    {
      name: 'bunch_count',
      required: true,
      label: 'تعداد دسته',
      align: 'left',
      field: (row: ProductionType) => parseFloat(row.bunch_count.toString() ?? '0').toLocaleString('fa')
    },
    {
      name: 'total_bunchss',
      required: true,
      label: 'تعداد گلبرگ',
      align: 'left',
      field: (row: ProductionType) => ((row.product_part?.count_per_bunch ?? 0) * (row.bunch_count ?? 0)).toLocaleString('fa')
    },
    {
      name: 'production_date',
      required: true,
      label: 'تاریخ تولید',
      align: 'left',
      field: (row: ProductionType) =>
        row.production_date ? dateManager.miladiToShamsi(row.production_date, 'YYYY-MM-DD', 'jYYYY/jMM/jDD') : '-'
    },
    {
      name: 'approver',
      required: true,
      label: 'تایید کننده',
      align: 'left',
      field: (row: ProductionType) => row.approver ? row.approver?.firstname + ' ' + row.approver?.lastname : '-'
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان تایید',
      align: 'left',
      field: (row: ProductionType) =>
        row.approved_at ? dateManager.miladiToShamsi(row.approved_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') : '-'
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: ProductionType) =>
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
}
const moldingWorkerColumns = {
  columns: [
    {
      name: 'product_part',
      required: true,
      label: 'زیر محصول',
      align: 'left',
      field: (row: ProductionType) => row.product_part?.name
    },
    {
      name: 'bunch_count',
      required: true,
      label: 'تعداد',
      align: 'left',
      field: (row: ProductionType) => parseFloat(row.bunch_count.toString() ?? '0').toLocaleString('fa')
    },
    {
      name: 'production_date',
      required: true,
      label: 'تاریخ تولید',
      align: 'left',
      field: (row: ProductionType) =>
        row.production_date ? dateManager.miladiToShamsi(row.production_date, 'YYYY-MM-DD', 'jYYYY/jMM/jDD') : '-'
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: ProductionType) =>
        row.created_at ? dateManager.miladiToShamsi(row.created_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') : '-'
    }
  ]
}
const fabricCutterWorkerColumns = {
  columns: [
    {
      name: 'product_part',
      required: true,
      label: 'زیر محصول',
      align: 'left',
      field: (row: ProductionType) => row.product_part?.name
    },
    {
      name: 'fabric_id',
      required: true,
      label: 'پارچه',
      align: 'left',
      field: (row: ProductionType) => row.fabric?.name
    },
    {
      name: 'bunch_count',
      required: true,
      label: 'تعداد',
      align: 'left',
      field: (row: ProductionType) => parseFloat(row.bunch_count.toString() ?? '0').toLocaleString('fa')
    },
    {
      name: 'production_date',
      required: true,
      label: 'تاریخ تولید',
      align: 'left',
      field: (row: ProductionType) =>
        row.production_date ? dateManager.miladiToShamsi(row.production_date, 'YYYY-MM-DD', 'jYYYY/jMM/jDD') : '-'
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: ProductionType) =>
        row.created_at ? dateManager.miladiToShamsi(row.created_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') : '-'
    }
  ]
}
const coloringWorkerColumns = {
  columns: [
    {
      name: 'product_part',
      required: true,
      label: 'زیر محصول',
      align: 'left',
      field: (row: ProductionType) => row.product_part?.name
    },
    {
      name: 'color',
      required: true,
      label: 'رنگ',
      align: 'left',
      field: (row: ProductionType) => row.color?.name
    },
    {
      name: 'bunch_count',
      required: true,
      label: 'تعداد',
      align: 'left',
      field: (row: ProductionType) => parseFloat(row.bunch_count.toString()).toLocaleString()
    },
    {
      name: 'production_date',
      required: true,
      label: 'تاریخ تولید',
      align: 'left',
      field: (row: ProductionType) =>
        row.production_date ? dateManager.miladiToShamsi(row.production_date, 'YYYY-MM-DD', 'jYYYY/jMM/jDD') : '-'
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: ProductionType) =>
        row.created_at ? dateManager.miladiToShamsi(row.created_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') : '-'
    }
  ]
}

const table = ref(getTableColumns())
const inputs = ref(getFilterInputs())
const entityIndexRef = ref()

function getFilterInputs () {
  if (userManager.isManager || userManager.isAccountant) {
    return managerInputs
  }
  if (userManager.isMoldingWorker) {
    return moldingWorkerInputs
  }
  if (userManager.isFabricCutter) {
    return fabricCutterWorkerInputs
  }
  if (userManager.isColoringWorker) {
    return coloringWorkerInputs
  }
}

function getTableColumns () {
  if (userManager.isManager || userManager.isAccountant) {
    return managerColumns
  }
  if (userManager.isMoldingWorker) {
    return moldingWorkerColumns
  }
  if (userManager.isFabricCutter) {
    return fabricCutterWorkerColumns
  }
  if (userManager.isColoringWorker) {
    return coloringWorkerColumns
  }
}

function afterRemove () {
  reloadList()
  $q.notify({
    message: 'حذف با موفقیت انجام شد.',
    type: 'positive'
  })
}

function confirmApproveProductionItem (production: ProductionType) {
  approveDialog.value = true
  selectedProductionItemToApprove.value = production
}

async function approveProductionItem () {
  try {
    approveLoading.value = true
    const result = await productionAPI.approve(selectedProductionItemToApprove.value.id)
    $q.notify({
      message: result.message,
      type: 'positive'
    })
    approveDialog.value = false
    reloadList()
  } finally {
    approveLoading.value = false
  }
}

function onCancelApproveProductionItem () {
  selectedProductionItemToApprove.value = null
  approveDialog.value = false
}

function reloadList () {
  entityIndexRef.value.getData()
}
</script>
