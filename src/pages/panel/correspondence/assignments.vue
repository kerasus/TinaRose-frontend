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
    :show-search-button="false"
    :row-key="itemIdentifyKey">
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'status'">
        {{ statusLabel(inputData.props.row.status) }}
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
import CorrespondenceAPI, { getAssignmentStatusLabel, type CorrespondenceAssignment } from 'src/repositories/correspondence'
import FormBuilderDate from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'
import FormBuilderSelectUser from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue'

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
    col: 'col-md-4 col-12'
  },
  {
    type: 'input',
    name: 'subject',
    label: 'موضوع',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: formBuilderSelectUserComponent,
    name: 'assigned_by_id',
    label: 'ارجاع‌دهنده',
    col: 'col-md-4 col-12'
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
