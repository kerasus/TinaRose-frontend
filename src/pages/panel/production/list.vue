<template>
  <div class="q-mb-md">
    <q-btn
      v-if="userManager.canCreateProduction"
      color="primary"
      label="ثبت تولید جدید"
      :to="{ name: 'Panel.Production.CreateByOther' }" />
    <q-btn
      v-if="userManager.isFabricCutter"
      color="primary"
      label="ثبت برش کاری جدید"
      :to="{ name: 'Panel.Production.Create', params: { worker_role: 'fabric-cutter' } }" />
    <q-btn
      v-if="userManager.isColoringWorker"
      color="primary"
      label="ثبت رنگ کاری جدید"
      :to="{ name: 'Panel.Production.Create', params: { worker_role: 'coloring' } }" />
    <q-btn
      v-if="userManager.isMoldingWorker"
      color="primary"
      label="ثبت اتوکاری جدید"
      :to="{ name: 'Panel.Production.Create', params: { worker_role: 'molding' } }" />
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
    :row-key="itemIdentifyKey"
    @on-page-changed="onPageChanged">
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <q-btn
            color="success"
            unelevated
            dense
            :disable="!!inputData.props.row.approved_at"
            @click="confirmApproveProductionItem(inputData.props.row)">
            <q-icon
              name="check"
              class="q-mr-xs" />
            تایید
          </q-btn>

          <q-btn
            color="primary"
            icon="edit"
            unelevated
            dense
            :disable="!!inputData.props.row.approved_at"
            :to="{ name: showRouteName, params: { worker_role: getRoleForProductionType(inputData.props.row.type), id: inputData.props.row.id } }" />

          <delete-btn
            :row="inputData.props.row"
            :api="productionAPI"
            @change="afterRemove" />

          <q-btn
            v-if="inputData.props.row.description"
            color="primary"
            flat
            dense>
            <q-icon
              name="info"
              class="q-mr-xs" />
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
    :persistent="approveLoading">    <confirmation
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
        class="approve-summary">
        <div class="approve-summary__banner">
          <q-icon
            name="warning_amber"
            size="20px" />
          <span>
            با تایید این ردیف، امکان ویرایش و حذف آن وجود نخواهد داشت.
          </span>
        </div>

        <div class="approve-summary__grid">
          <div class="approve-summary__item">
            <span class="approve-summary__label">
              <q-icon name="person" />
              پرسنل
            </span>
            <span class="approve-summary__value">
              {{ selectedProductionItemToApprove.user.firstname }}
              {{ selectedProductionItemToApprove.user.lastname }}
            </span>
          </div>

          <div class="approve-summary__item">
            <span class="approve-summary__label">
              <q-icon name="category" />
              زیر محصول
            </span>
            <span class="approve-summary__value">
              {{ selectedProductionItemToApprove.product_part?.name ?? '-' }}
            </span>
          </div>

          <div class="approve-summary__item">
            <span class="approve-summary__label">
              <q-icon name="texture" />
              پارچه
            </span>
            <span class="approve-summary__value">
              {{ selectedProductionItemToApprove.fabric?.name ?? '-' }}
            </span>
          </div>

          <div class="approve-summary__item">
            <span class="approve-summary__label">
              <q-icon name="palette" />
              رنگ
            </span>
            <span class="approve-summary__value">
              {{ selectedProductionItemToApprove.color?.name ?? '-' }}
            </span>
          </div>

          <div class="approve-summary__item">
            <span class="approve-summary__label">
              <q-icon name="inventory_2" />
              تعداد دسته
            </span>
            <span class="approve-summary__value">
              {{
                parseFloat(
                  selectedProductionItemToApprove.bunch_count?.toString() ?? '0',
                ).toLocaleString('fa')
              }}
            </span>
          </div>

          <div class="approve-summary__item">
            <span class="approve-summary__label">
              <q-icon name="local_florist" />
              تعداد گلبرگ
            </span>
            <span class="approve-summary__value">
              {{
                (
                  (selectedProductionItemToApprove.product_part?.count_per_bunch ?? 0) *
                  (selectedProductionItemToApprove.bunch_count ?? 0)
                ).toLocaleString('fa')
              }}
            </span>
          </div>

          <div class="approve-summary__item">
            <span class="approve-summary__label">
              <q-icon name="event" />
              تاریخ تولید
            </span>
            <span class="approve-summary__value">
              {{
                selectedProductionItemToApprove.production_date
                  ? dateManager.miladiToShamsi(
                    selectedProductionItemToApprove.production_date,
                    'YYYY-MM-DD',
                    'jYYYY/jMM/jDD',
                  )
                  : '-'
              }}
            </span>
          </div>

          <div class="approve-summary__item">
            <span class="approve-summary__label">
              <q-icon name="schedule" />
              زمان ایجاد
            </span>
            <span class="approve-summary__value">
              {{
                selectedProductionItemToApprove.created_at
                  ? dateManager.miladiToShamsi(
                    selectedProductionItemToApprove.created_at,
                    'YYYY-MM-DDThh:mm:ss',
                    'hh:mm:ss jYYYY/jMM/jDD',
                  )
                  : '-'
              }}
            </span>
          </div>
        </div>
      </div>
    </confirmation>

  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { ref, shallowRef } from 'vue'
import { AxiosResponse } from 'axios'
import { useUser } from 'src/stores/user'
import { EntityIndex } from 'quasar-crud'
import { useDate } from 'src/composables/Date'
import DeleteBtn from 'src/components/controls/deleteBtn.vue'
import Confirmation from 'src/components/cards/confirmation.vue'
import { userRoleOptions, UserRolesForPathType } from 'src/repositories/user'
import FormBuilderSelectUser from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue'
import FormBuilderSelectColor from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectColor.vue'
import FormBuilderSelectFabric from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectFabric.vue'
import FormBuilderSelectProductPart from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectProductPart.vue'
import ProductionAPI, {
  getProductionTypeLabel,
  productionTypeOptions,
  type ProductionType,
  ProductionTypeType
} from 'src/repositories/production'

const $q = useQuasar()
const dateManager = useDate()
const userManager = useUser()
const productionAPI = new ProductionAPI()

const formBuilderSelectUserComponent = shallowRef(FormBuilderSelectUser)
const formBuilderSelectColorComponent = shallowRef(FormBuilderSelectColor)
const formBuilderSelectFabricComponent = shallowRef(FormBuilderSelectFabric)
const formBuilderSelectProductPartComponent = shallowRef(FormBuilderSelectProductPart)

const approveDialog = ref(false)
const currentPage = ref<number>(1)
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
    label: 'پرسنل',
    name: 'user_id',
    col: 'col-md-3 col-12'
  },
  {
    type: formBuilderSelectUserComponent,
    label: 'ثبت کننده',
    name: 'recorded_by',
    col: 'col-md-3 col-12'
  },
  {
    type: 'select',
    name: 'type',
    label: 'نوع تولید',
    placeholder: ' ',
    options: productionTypeOptions,
    col: 'col-md-3 col-12'
  },
  {
    type: formBuilderSelectProductPartComponent,
    name: 'product_part_id',
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
  },
  {
    type: 'select',
    name: 'role',
    label: 'نقش',
    placeholder: ' ',
    options: userRoleOptions.filter(
      (item) => item.value !== 'Manager' && item.value !== 'Accountant'
    ),
    col: 'col-md-3 col-12'
  },
  {
    type: 'date',
    name: 'production_date',
    outsideLabel: 'تاریخ تولید',
    clearable: true,
    col: 'col-md-3 col-12'
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
      name: 'recorder',
      required: true,
      label: 'ثبت کننده',
      align: 'left',
      field: (row: ProductionType) => row.recorder?.firstname + ' ' + row.recorder?.lastname
    },
    {
      name: 'operator',
      required: true,
      label: 'پرسنل',
      align: 'left',
      field: (row: ProductionType) => row.operator?.firstname + ' ' + row.operator?.lastname
    },
    {
      name: 'type',
      required: true,
      label: 'نوع تولید',
      align: 'left',
      field: (row: ProductionType) => getProductionTypeLabel(row.type)
    },
    {
      name: 'product_part',
      required: true,
      label: 'زیر محصول',
      align: 'left',
      field: (row: ProductionType) => row.product_part?.name
    },
    {
      name: 'product',
      required: true,
      label: 'محصول',
      align: 'left',
      field: (row: ProductionType) => row.product?.name
    },
    {
      name: 'equipment',
      required: true,
      label: 'تجهیز',
      align: 'left',
      field: (row: ProductionType) =>
        row.equipment ? `${row.equipment.title}(${row.equipment.code})` : '-'
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
      field: (row: ProductionType) =>
        parseFloat(row.bunch_count.toString() ?? '0').toLocaleString('fa')
    },
    {
      name: 'total_bunchss',
      required: true,
      label: 'تعداد گلبرگ',
      align: 'left',
      field: (row: ProductionType) =>
        ((row.product_part?.count_per_bunch ?? 0) * (row.bunch_count ?? 0)).toLocaleString('fa')
    },
    {
      name: 'production_date',
      required: true,
      label: 'تاریخ تولید',
      align: 'left',
      field: (row: ProductionType) =>
        row.production_date
          ? dateManager.miladiToShamsi(row.production_date, 'YYYY-MM-DD', 'jYYYY/jMM/jDD')
          : '-'
    },
    {
      name: 'downtime_reason',
      required: true,
      label: 'دلیل توقف',
      align: 'left',
      field: (row: ProductionType) => (row.downtime_reason ? row.downtime_reason.name : '-')
    },
    {
      name: 'downtime_duration',
      required: true,
      label: 'مدت توقف',
      align: 'left',
      field: (row: ProductionType) => (row.downtime_duration ? row.downtime_duration : '-')
    },
    {
      name: 'approver',
      required: true,
      label: 'تایید کننده',
      align: 'left',
      field: (row: ProductionType) =>
        row.approver ? row.approver?.firstname + ' ' + row.approver?.lastname : '-'
    },
    {
      name: 'approved_at',
      required: true,
      label: 'زمان تایید',
      align: 'left',
      field: (row: ProductionType) =>
        row.approved_at
          ? dateManager.miladiToShamsi(
            row.approved_at,
            'YYYY-MM-DDThh:mm:ss',
            'hh:mm:ss jYYYY/jMM/jDD'
          )
          : '-'
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: ProductionType) =>
        row.created_at
          ? dateManager.miladiToShamsi(
            row.created_at,
            'YYYY-MM-DDThh:mm:ss',
            'hh:mm:ss jYYYY/jMM/jDD'
          )
          : '-'
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
      name: 'equipment',
      required: true,
      label: 'تجهیز',
      align: 'left',
      field: (row: ProductionType) =>
        row.equipment ? `${row.equipment.title}(${row.equipment.code})` : '-'
    },
    {
      name: 'bunch_count',
      required: true,
      label: 'تعداد',
      align: 'left',
      field: (row: ProductionType) =>
        parseFloat(row.bunch_count.toString() ?? '0').toLocaleString('fa')
    },
    {
      name: 'production_date',
      required: true,
      label: 'تاریخ تولید',
      align: 'left',
      field: (row: ProductionType) =>
        row.production_date
          ? dateManager.miladiToShamsi(row.production_date, 'YYYY-MM-DD', 'jYYYY/jMM/jDD')
          : '-'
    },
    {
      name: 'downtime_reason',
      required: true,
      label: 'دلیل توقف',
      align: 'left',
      field: (row: ProductionType) => (row.downtime_reason ? row.downtime_reason.name : '-')
    },
    {
      name: 'downtime_duration',
      required: true,
      label: 'مدت توقف',
      align: 'left',
      field: (row: ProductionType) => (row.downtime_duration ? row.downtime_duration : '-')
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: ProductionType) =>
        row.created_at
          ? dateManager.miladiToShamsi(
            row.created_at,
            'YYYY-MM-DDThh:mm:ss',
            'hh:mm:ss jYYYY/jMM/jDD'
          )
          : '-'
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
      name: 'equipment',
      required: true,
      label: 'تجهیز',
      align: 'left',
      field: (row: ProductionType) =>
        row.equipment ? `${row.equipment.title}(${row.equipment.code})` : '-'
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
      field: (row: ProductionType) =>
        parseFloat(row.bunch_count.toString() ?? '0').toLocaleString('fa')
    },
    {
      name: 'production_date',
      required: true,
      label: 'تاریخ تولید',
      align: 'left',
      field: (row: ProductionType) =>
        row.production_date
          ? dateManager.miladiToShamsi(row.production_date, 'YYYY-MM-DD', 'jYYYY/jMM/jDD')
          : '-'
    },
    {
      name: 'downtime_reason',
      required: true,
      label: 'دلیل توقف',
      align: 'left',
      field: (row: ProductionType) => (row.downtime_reason ? row.downtime_reason.name : '-')
    },
    {
      name: 'downtime_duration',
      required: true,
      label: 'مدت توقف',
      align: 'left',
      field: (row: ProductionType) => (row.downtime_duration ? row.downtime_duration : '-')
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: ProductionType) =>
        row.created_at
          ? dateManager.miladiToShamsi(
            row.created_at,
            'YYYY-MM-DDThh:mm:ss',
            'hh:mm:ss jYYYY/jMM/jDD'
          )
          : '-'
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
        row.production_date
          ? dateManager.miladiToShamsi(row.production_date, 'YYYY-MM-DD', 'jYYYY/jMM/jDD')
          : '-'
    },
    {
      name: 'downtime_reason',
      required: true,
      label: 'دلیل توقف',
      align: 'left',
      field: (row: ProductionType) => (row.downtime_reason ? row.downtime_reason.name : '-')
    },
    {
      name: 'downtime_duration',
      required: true,
      label: 'مدت توقف',
      align: 'left',
      field: (row: ProductionType) => (row.downtime_duration ? row.downtime_duration : '-')
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: ProductionType) =>
        row.created_at
          ? dateManager.miladiToShamsi(
            row.created_at,
            'YYYY-MM-DDThh:mm:ss',
            'hh:mm:ss jYYYY/jMM/jDD'
          )
          : '-'
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
  entityIndexRef.value.getData(undefined, currentPage.value)
}

function onPageChanged (response: AxiosResponse) {
  currentPage.value = response.data.current_page
}

function getRoleForProductionType (type: ProductionTypeType): UserRolesForPathType {
  const map: Record<ProductionTypeType, UserRolesForPathType> = {
    cutting: 'fabric-cutter',
    coloring: 'coloring',
    molding: 'molding',
    assembling: 'assembler'
  }

  return map[type]
}
</script>

<style lang="scss" scoped>
.action-column-entity-index {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.approve-summary {
  width: 100%;

  &__banner {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 0.75rem;
    margin-bottom: 0.9rem;
    border-radius: 8px;
    font-size: 0.8rem;
    line-height: 1.6;
    color: #8a5a00;
    background: rgba(255, 193, 7, 0.12);
    border: 1px solid rgba(255, 193, 7, 0.35);

    .q-icon {
      flex-shrink: 0;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.5rem 0.65rem;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(0, 0, 0, 0.06);
    min-width: 0;
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.72rem;
    font-weight: 500;
    opacity: 0.65;

    .q-icon {
      font-size: 0.95rem;
    }
  }

  &__value {
    font-size: 0.85rem;
    font-weight: 600;
    overflow-wrap: anywhere;
  }
}

@media (max-width: 599px) {
  .approve-summary {
    &__grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}

</style>

