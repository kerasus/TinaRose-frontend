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
      <template v-if="inputData.col.name === 'type'">
        {{ recipientTypeLabel(inputData.props.row.type) }}
      </template>
      <template v-if="inputData.col.name === 'subject'">
        {{ inputData.props.row.correspondence?.subject || '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'reference_number'">
        {{ inputData.props.row.correspondence?.reference_number || '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'sender'">
        {{ senderName(inputData.props.row.correspondence?.sender) }}
      </template>
      <template v-else-if="inputData.col.name === 'read_at'">
        <span
          v-if="!inputData.props.row.read_at"
          class="row-unread-marker" />
        {{ inputData.col.value }}
      </template>
      <template v-else-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <q-btn
            color="primary"
            flat
            icon="visibility"
            :disable="!inputData.props.row.correspondence?.id"
            :to="inputData.props.row.correspondence?.id ? { name: showRouteName, params: { id: inputData.props.row.correspondence.id } } : undefined" />
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
import CorrespondenceAPI, { getRecipientTypeLabel, type CorrespondenceRecipient } from 'src/repositories/correspondence'
import FormBuilderDate from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'
import FormBuilderSelectUser from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue'

const dateManager = useDate()
const correspondenceAPI = new CorrespondenceAPI()

const FormBuilderDateComponent = shallowRef(FormBuilderDate)
const formBuilderSelectUserComponent = shallowRef(FormBuilderSelectUser)

const api = ref(correspondenceAPI.endpoints.inbox)
const label = ref('صندوق ورودی')
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
      field: (row: CorrespondenceRecipient) => row.correspondence?.reference_number || '-'
    },
    {
      name: 'subject',
      required: true,
      label: 'موضوع',
      align: 'left',
      field: (row: CorrespondenceRecipient) => row.correspondence?.subject || '-'
    },
    {
      name: 'sender',
      required: true,
      label: 'فرستنده',
      align: 'left',
      field: (row: CorrespondenceRecipient) => row.correspondence?.sender
    },
    {
      name: 'type',
      required: true,
      label: 'نوع دریافت',
      align: 'left'
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
      name: 'created_at',
      required: true,
      label: 'زمان دریافت',
      align: 'left',
      field: (row: CorrespondenceRecipient) =>
        (row as any).created_at ? dateManager.miladiToShamsi((row as any).created_at, 'YYYY-MM-DDTHH:mm:ss', 'HH:mm jYYYY/jMM/jDD') : '-'
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
    col: 'col-md-2 col-12'
  },
  {
    type: 'select',
    name: 'type',
    label: 'نوع دریافت',
    placeholder: ' ',
    options: [
      { label: 'گیرنده اصلی', value: 'to' },
      { label: 'رونوشت', value: 'cc' }
    ],
    col: 'col-md-2 col-12'
  },
  {
    type: formBuilderSelectUserComponent,
    name: 'sender_id',
    label: 'فرستنده',
    col: 'col-md-2 col-12'
  },
  {
    type: FormBuilderDateComponent,
    name: 'created_since_date',
    label: 'از تاریخ',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderDateComponent,
    name: 'created_till_date',
    label: 'تا تاریخ',
    col: 'col-md-3 col-12'
  }
])

function recipientTypeLabel (v: any) {
  return getRecipientTypeLabel(v)
}

function senderName (sender: any) {
  if (!sender) return '-'
  const name = [sender.firstname, sender.lastname].filter(Boolean).join(' ')
  return name || sender.username || '-'
}
</script>

<style scoped lang="scss">
.row-unread-marker {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-left: 6px;
  border-radius: 50%;
  background-color: #1976d2;
  vertical-align: middle;
}

:deep(.q-table tbody tr:has(.row-unread-marker)) {
  background-color: #e8f1fd !important;
}

:deep(.q-table tbody tr:has(.row-unread-marker):hover) {
  background-color: #d6e7fb !important;
}
</style>
