<template>
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
    :row-key="itemIdentifyKey">
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'status'">
        <span
          :class="`row-status-${inputData.props.row.status}`"
          v-text="statusLabel(inputData.props.row.status)" />
      </template>
      <template v-else-if="inputData.col.name === 'subject'">
        {{ inputData.props.row.correspondence?.subject || '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'assigned_by'">
        {{ userLabel(inputData.props.row.assigned_by, inputData.props.row.assigned_by_id) }}
      </template>
      <template v-else-if="inputData.col.name === 'reference_number'">
        {{ inputData.props.row.correspondence?.reference_number || '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'read_at'">
        <span
          v-if="!inputData.props.row.read_at"
          class="row-unread-marker" />
        <span v-else>
          {{ inputData.col.value }}
        </span>
      </template>
      <template v-else-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <q-btn
            color="primary"
            flat
            icon="visibility"
            :disable="!inputData.props.row.correspondence_id"
            :to="inputData.props.row.correspondence_id ? { name: showRouteName, params: { id: inputData.props.row.correspondence_id } } : undefined" />
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
import CorrespondenceAPI, {
  getAssignmentStatusLabel,
  type CorrespondenceAssignment,
  type CorrespondenceRecipient, assignmentStatusOptions
} from 'src/repositories/correspondence'
import FormBuilderDate from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'
import FormBuilderSelectUser from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue'
import { inventoryTypeOptions } from 'src/repositories/inventory'

const dateManager = useDate()
const correspondenceAPI = new CorrespondenceAPI()

const FormBuilderDateComponent = shallowRef(FormBuilderDate)
const formBuilderSelectUserComponent = shallowRef(FormBuilderSelectUser)

const api = ref(correspondenceAPI.endpoints.assignments)
const label = ref('کارتابل ارجاع‌ها')
const showRouteName = ref('Panel.Correspondence.Show')
const itemIdentifyKey = ref('id')
const entityIndexRef = ref()

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
      name: 'reference_number',
      required: true,
      label: 'شماره نامه',
      align: 'left',
      field: (row: CorrespondenceAssignment) => row.correspondence?.reference_number || '-'
    },
    {
      name: 'subject',
      required: true,
      label: 'موضوع',
      align: 'left',
      field: (row: CorrespondenceAssignment) => row.correspondence?.subject || '-'
    },
    {
      name: 'status',
      required: true,
      label: 'وضعیت ارجاع',
      align: 'left',
      field: (row: CorrespondenceAssignment) => row.status
    },
    {
      name: 'assigned_by',
      required: true,
      label: 'ارجاع‌دهنده',
      align: 'left',
      field: (row: CorrespondenceAssignment) => row.assigned_by
    },
    {
      name: 'read_at',
      required: true,
      label: 'زمان مشاهده',
      align: 'left',
      field: (row: CorrespondenceRecipient) =>
        (row as any).read_at ? dateManager.miladiToShamsi((row as any).read_at, 'YYYY-MM-DDTHH:mm:ss', 'HH:mm jYYYY/jMM/jDD') : '-'
    },
    {
      name: 'due_at',
      required: true,
      label: 'مهلت',
      align: 'left',
      field: (row: CorrespondenceAssignment) =>
        row.due_at ? dateManager.miladiToShamsi(row.due_at, 'YYYY-MM-DDTHH:mm:ss', 'jYYYY/jMM/jDD HH:mm') : '-'
    },
    {
      name: 'created_at',
      required: true,
      label: 'تاریخ ارجاع',
      align: 'left',
      field: (row: CorrespondenceAssignment) =>
        row.created_at ? dateManager.miladiToShamsi(row.created_at, 'YYYY-MM-DDTHH:mm:ss', 'HH:mm jYYYY/jMM/jDD') : '-'
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
  { type: 'hidden', name: 'sortation_field', value: 'created_at' },
  { type: 'hidden', name: 'sortation_order', value: 'desc' },
  {
    type: 'input',
    name: 'reference_number',
    label: 'شماره نامه',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: 'input',
    name: 'subject',
    label: 'موضوع',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: 'select',
    name: 'status',
    responseKey: 'status',
    label: 'وضعیت ارجاع',
    placeholder: ' ',
    options: assignmentStatusOptions,
    col: 'col-md-3 col-12'
  },
  {
    type: formBuilderSelectUserComponent,
    name: 'assigned_by_id',
    label: 'ارجاع‌دهنده',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderDateComponent,
    name: 'due_at_since_date',
    label: 'مهلت از تاریخ',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderDateComponent,
    name: 'due_at_till_date',
    label: 'مهلت تا تاریخ',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderDateComponent,
    name: 'created_since_date',
    label: 'تاریخ ارجاع از',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderDateComponent,
    name: 'created_till_date',
    label: 'تاریخ ارجاع تا',
    col: 'col-md-3 col-12'
  }
])

function statusLabel (v: any) {
  return getAssignmentStatusLabel(v)
}

function userLabel (user: any, id: number | null) {
  if (user) {
    const name = [user.firstname, user.lastname].filter(Boolean).join(' ').trim()
    const code = user.employee_code ? ` (کد پرسنلی: ${user.employee_code})` : ''
    return (name || user.username || `کاربر #${user.id}`) + code
  }
  return id ? `کاربر #${id}` : '-'
}
</script>

<style scoped lang="scss">
/* --- 1. استایل دایره وضعیت خوانده‌نشده --- */
.row-unread-marker {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-left: 6px;
  border-radius: 50%;
  background-color: #1976d2;
  vertical-align: middle;
}

/* --- 2. استایل چیپ‌های وضعیت --- */
[class^="row-status-"] {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

/* --- 3. اصلاح طیف رنگی برای تمایز حداکثری --- */
/* زرد (در انتظار) */
.row-status-pending { background-color: #fff3cd; color: #856404; }
/* آبی (در حال انجام) */
.row-status-in_progress { background-color: #cce5ff; color: #004085; }
/* سبز (انجام شده) */
.row-status-completed { background-color: #d4edda; color: #155724; }
/* قرمز (رد شده) */
.row-status-rejected { background-color: #f8d7da; color: #721c24; }
/* خاکستری (لغو شده) */
.row-status-cancelled { background-color: #e2e3e5; color: #383d41; }

/* --- 4. استایل سطرها (بدون تداخل رنگ) --- */
:deep(.q-table tbody tr:has(.row-status-pending)) { background-color: #fffaf0 !important; }
:deep(.q-table tbody tr:has(.row-status-in_progress)) { background-color: #f0f7ff !important; }
:deep(.q-table tbody tr:has(.row-status-completed)) { background-color: #f4fcf5 !important; }
:deep(.q-table tbody tr:has(.row-status-rejected)) { background-color: #fffafa !important; }
:deep(.q-table tbody tr:has(.row-status-cancelled)) { background-color: #f9f9f9 !important; }

/* --- 5. استایل حرفه‌ای برای ردیف‌های خوانده‌نشده --- */
/* دیگه پس‌زمینه رو آبی نمی‌کنیم که با رنگ وضعیت قاطی بشه، فقط یک نوار کناری می‌زنیم */
:deep(.q-table tbody tr:has(.row-unread-marker)) {
  border-left: 5px solid #1976d2 !important;
  font-weight: 600; /* متن رو کمی ضخیم‌تر می‌کنیم که مشخص بشه */
}
</style>
