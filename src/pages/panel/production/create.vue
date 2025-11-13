<template>
  <entity-create
    ref="entityCreateRef"
    v-model:value="inputs"
    :title="createFormlabel"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :before-send-data="beforeSendData"
    :show-expand-button="false"
    :show-close-button="false"
    :show-save-button="false">
    <template #after-form-builder>
      <div class="q-mt-md flex justify-end">
        <q-btn
          color="primary"
          @click="onCreateEntity">
          ثبت
        </q-btn>
      </div>
    </template>
  </entity-create>
  <q-separator class="q-my-md" />
  <entity-index
    ref="entityIndexRef"
    :value="listInputs"
    :title="listLabel"
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
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { ref, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import Digit from 'src/composables/Digit'
import { useUser } from 'src/stores/user'
import { useDate } from 'src/composables/Date'
import { EntityCreate, EntityIndex } from 'quasar-crud'
import { FormBuilderAssist } from 'quasar-form-builder'
import getInputs, { type WorkerRoleType } from './inputs'
import ProductionAPI, { type ProductionType } from 'src/repositories/production'
import FormBuilderSelectColor from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectColor.vue'
import FormBuilderSelectFabric from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectFabric.vue'
import FormBuilderSelectProduct from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectProduct.vue'
import FormBuilderSelectProductPart from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectProductPart.vue'

const $q = useQuasar()
const route = useRoute()
const dateManager = useDate()
const userManager = useUser()
const productionAPI = new ProductionAPI()

const formBuilderSelectColorComponent = shallowRef(FormBuilderSelectColor)
const formBuilderSelectFabricComponent = shallowRef(FormBuilderSelectFabric)
const FormBuilderSelectProductComponent = shallowRef(FormBuilderSelectProduct)
const formBuilderSelectProductPartComponent = shallowRef(FormBuilderSelectProductPart)

const entityIndexRef = ref()
const entityCreateRef = ref()
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
      label: 'تعداد',
      align: 'left',
      field: (row: ProductionType) => row.bunch_count
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
      field: (row: ProductionType) => row.bunch_count
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
      field: (row: ProductionType) => row.bunch_count
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
      field: (row: ProductionType) => row.bunch_count
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
const assemblerColumns = {
  columns: [
    {
      name: 'product',
      required: true,
      label: 'محصول',
      align: 'left',
      field: (row: ProductionType) => row.product?.name
    },
    {
      name: 'bunch_count',
      required: true,
      label: 'تعداد',
      align: 'left',
      field: (row: ProductionType) => row.bunch_count
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
const assemblerInputs = [
  {
    type: 'hidden',
    name: 'user_id',
    value: userManager.me?.id
  },
  {
    type: FormBuilderSelectProductComponent,
    name: 'product_id',
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

const itemIdentifyKey = ref('id')
const tableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page'
})
const table = ref(getTableColumns())
const api = ref(productionAPI.endpoints.base)
const createFormlabel = ref('تولید جدید')
const listLabel = ref('تولیدات')
const indexRouteName = ref('Panel.Production.List')
const showRouteName = ref('Panel.Production.Show')
const entityIdKey = ref('id')
const entityParamKey = ref('id')

const inputs = ref([
  ...getInputs(route.params.worker_role as WorkerRoleType)
])
const listInputs = ref(getFilterInputs())

function beforeSendData (formData: Record<string, any>) {
  formData.bunch_count = Digit.toEnDigit(formData.bunch_count)
}

function getFilterInputs () {
  if (userManager.isMoldingWorker) {
    return moldingWorkerInputs
  }
  if (userManager.isFabricCutter) {
    return fabricCutterWorkerInputs
  }
  if (userManager.isColoringWorker) {
    return coloringWorkerInputs
  }
  if (userManager.isAssembler) {
    return assemblerInputs
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
  if (userManager.isAssembler) {
    return assemblerColumns
  }
}

function onCreateEntity () {
  entityCreateRef.value.createEntity(false)
    .then(()=>{
      $q.notify({
        message: 'ثبت با موفقیت انجام شد.',
        type: 'positive'
      })
    })
    .finally(()=>{
      entityIndexRef.value.reload()
    })
}

FormBuilderAssist.setAttributeByName(inputs.value, 'user_id', 'value', userManager.me?.id)
</script>
