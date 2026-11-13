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
    :row-key="itemIdentifyKey">
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'status'">
        {{ statusLabel(inputData.props.row.status) }}
      </template>
      <template v-else-if="inputData.col.name === 'sender'">
        {{ senderName(inputData.props.row?.sender) }}
      </template>
      <template v-else-if="inputData.col.name === 'priority'">
        {{ priorityLabel(inputData.props.row.priority) }}
      </template>
      <template v-else-if="inputData.col.name === 'confidentiality'">
        {{ confidentialityLabel(inputData.props.row.confidentiality) }}
      </template>
      <template v-else-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <q-btn
            color="primary"
            flat
            icon="visibility"
            :to="{ name: showRouteName, params: { id: inputData.props.row.id } }" />
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
  type Correspondence,
  getCorrespondenceStatusLabel,
  getCorrespondencePriorityLabel,
  getCorrespondenceConfidentialityLabel, type CorrespondenceRecipient
} from 'src/repositories/correspondence'
import FormBuilderDate from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'
import FormBuilderSelectUser from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue'

const dateManager = useDate()
const correspondenceAPI = new CorrespondenceAPI()

const FormBuilderDateComponent = shallowRef(FormBuilderDate)
const formBuilderSelectUserComponent = shallowRef(FormBuilderSelectUser)

const api = ref(correspondenceAPI.endpoints.base)
const label = ref('نامه‌ها')
const createRouteName = ref('Panel.Correspondence.Create')
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
      label: 'شماره',
      align: 'left',
      field: (row: Correspondence) => row.reference_number || '-'
    },
    {
      name: 'subject',
      required: true,
      label: 'موضوع',
      align: 'left',
      field: (row: Correspondence) => row.subject
    },
    {
      name: 'sender',
      required: true,
      label: 'فرستنده',
      align: 'left',
      field: (row: Correspondence) => row?.sender
    },
    {
      name: 'status',
      required: true,
      label: 'وضعیت',
      align: 'left',
      field: (row: Correspondence) => row.status
    },
    {
      name: 'priority',
      required: true,
      label: 'اولویت',
      align: 'left',
      field: (row: Correspondence) => row.priority
    },
    {
      name: 'confidentiality',
      required: true,
      label: 'محرمانگی',
      align: 'left',
      field: (row: Correspondence) => row.confidentiality
    },
    {
      name: 'created_at',
      required: true,
      label: 'تاریخ ایجاد',
      align: 'left',
      field: (row: Correspondence) =>
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
    type: formBuilderSelectUserComponent,
    name: 'sender_id',
    label: 'ارسال کننده',
    col: 'col-md-4 col-12'
  },
  {
    type: formBuilderSelectUserComponent,
    name: 'recipient_id',
    label: 'دریافت کننده',
    col: 'col-md-4 col-12'
  },
  {
    type: 'input',
    name: 'reference_number',
    label: 'شماره',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderDateComponent,
    name: 'createdSinceDate',
    label: 'از تاریخ',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderDateComponent,
    name: 'createdTillDate',
    label: 'تا تاریخ',
    col: 'col-md-4 col-12'
  },
  {
    type: 'select',
    name: 'priority',
    label: 'اولویت',
    placeholder: ' ',
    options: [
      { label: 'کم', value: 'low' },
      { label: 'معمولی', value: 'normal' },
      { label: 'زیاد', value: 'high' },
      { label: 'فوری', value: 'urgent' }
    ],
    col: 'col-md-4 col-12'
  }
])

function senderName (sender: any) {
  if (!sender) return '-'
  const name = [sender.firstname, sender.lastname].filter(Boolean).join(' ')
  return name || sender.username || '-'
}
function statusLabel (v: any) {
  return getCorrespondenceStatusLabel(v)
}
function priorityLabel (v: any) {
  return getCorrespondencePriorityLabel(v)
}
function confidentialityLabel (v: any) {
  return getCorrespondenceConfidentialityLabel(v)
}
</script>
