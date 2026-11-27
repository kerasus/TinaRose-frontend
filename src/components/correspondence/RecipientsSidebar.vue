<template>
  <div class="side-card bg-white q-pa-md rounded-xl shadow-xs border-subtle">
    <div class="row items-center justify-between q-mb-sm">
      <div class="card-head-title row items-center q-gutter-x-xs text-grey-7">
        <q-icon
          name="group"
          size="18px"
          color="primary" />
        <span class="text-caption text-weight-bold">گیرندگان سند</span>
      </div>
      <div class="row items-center q-gutter-x-xs">
        <q-badge
          color="grey-3"
          text-color="grey-8"
          rounded
          class="q-px-xs">
          {{ correspondence.recipients?.length || 0 }}
        </q-badge>
        <q-btn
          v-if="isSender"
          flat
          dense
          round
          icon="person_add"
          color="primary"
          size="sm"
          @click="openRecipientDialog">
          <q-tooltip>افزودن گیرنده</q-tooltip>
        </q-btn>
      </div>
    </div>

    <div class="column q-gutter-y-xs">
      <div
        v-for="r in correspondence.recipients"
        :key="r.id"
        class="recipient-badge-row row items-center justify-between q-pa-xs rounded-borders">
        <div class="row items-center q-gutter-x-xs">
          <span :class="['rec-type-tag', r.type === 'to' ? 'is-to' : 'is-cc']">
            {{ r.type === 'to' ? 'اصل' : 'رونوشت' }}
          </span>
          <span class="text-caption text-weight-bold text-grey-9">
            {{ userLabel(r.user, r.user_id) }}
            <q-badge
              color="info"
              rounded
              class="q-px-sm q-py-xs text-weight-bold q-ml-sm">
              {{ getFirstUserRoleLabel(r.user) }}
            </q-badge>
          </span>
        </div>
        <div class="column items-end">
          <div
            class="text-caption text-grey-5 row items-center font-mono"
            style="font-size: 0.72rem;">
            <q-icon
              :name="r.read_at ? 'done_all' : 'schedule'"
              size="13px"
              class="q-mr-xs"
              :color="r.read_at ? 'positive' : 'grey-5'" />
            <span>{{ r.read_at ? fmt(r.read_at) : 'دیده‌نشده' }}</span>
          </div>
          <div
            v-if="r.due_at"
            class="text-caption text-orange-9 row items-center font-mono"
            style="font-size: 0.72rem;">
            <q-icon
              name="event"
              size="13px"
              class="q-mr-xs" />
            <span>مهلت: {{ fmt(r.due_at) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- افزودن گیرنده جدید -->
    <q-dialog v-model="recipientDialog">
      <q-card style="min-width: 380px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle1">افزودن گیرنده به نامه</div>
          <q-space />
          <q-btn
            v-close-popup
            icon="close"
            flat
            round
            dense />
        </q-card-section>
        <q-card-section class="q-gutter-y-md">
          <form-builder-select-user
            v-model:value="recipientForm.user_id"
            label="گیرنده" />
          <q-select
            v-model="recipientForm.type"
            :options="recipientTypeOptions"
            label="نوع"
            outlined
            dense
            emit-value
            map-options
            :error="!!recipientErrors.type"
            :error-message="recipientErrors.type"
            @update:model-value="onRecipientTypeChange" />
          <form-builder-date-time
            v-if="recipientForm.type !== 'cc'"
            v-model:value="recipientForm.due_at"
            label="مهلت این گیرنده (اختیاری)"
            outlined
            dense />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            label="انصراف" />
          <q-btn
            color="primary"
            label="افزودن"
            :loading="actionLoading"
            @click="submitRecipient" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { getFirstUserRoleLabel } from 'src/repositories/user'
import FormBuilderDateTime from 'src/components/controls/formBuilderCustomInput/FormBuilderDateTime.vue'
import FormBuilderSelectUser from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue'
import CorrespondenceAPI, { type Correspondence } from 'src/repositories/correspondence'
import { formatDateTime as fmt, userLabel } from './correspondenceUtils'

const props = defineProps<{
  correspondence: Correspondence
  isSender?: boolean
}>()

const emit = defineEmits<{
  refresh: []
}>()

const $q = useQuasar()
const correspondenceAPI = new CorrespondenceAPI()

const actionLoading = ref(false)
const recipientDialog = ref(false)
const recipientForm = ref<{ user_id: number | null, type: 'to' | 'cc', due_at: string | null }>({
  user_id: null,
  type: 'to',
  due_at: null
})
const recipientErrors = ref<Record<string, string>>({})
const recipientTypeOptions = [
  { label: 'گیرنده اصلی (To)', value: 'to' },
  { label: 'رونوشت (CC)', value: 'cc' }
]

function handleError (e: any) {
  const status = e?.response?.status
  if (status === 422) {
    const errs = e.response.data?.errors || {}
    const first = Object.values(errs)[0] as any
    const msg = Array.isArray(first) ? first[0] : (e.response.data?.message || 'اطلاعات نامعتبر است.')
    $q.notify({ type: 'negative', message: msg })
    return errs
  }
  if (status === 403) {
    $q.notify({ type: 'negative', message: e?.response?.data?.message || 'دسترسی غیرمجاز.' })
    return null
  }
  if (status === 409) {
    $q.notify({ type: 'negative', message: e?.response?.data?.message || 'تعارض در وضعیت.' })
    return null
  }
  $q.notify({ type: 'negative', message: e?.response?.data?.message || 'خطا در انجام عملیات.' })
  return null
}

function openRecipientDialog () {
  recipientForm.value = { user_id: null, type: 'to', due_at: null }
  recipientErrors.value = {}
  recipientDialog.value = true
}

function onRecipientTypeChange (type: 'to' | 'cc') {
  if (type === 'cc') {
    recipientForm.value.due_at = null
  }
}

async function submitRecipient () {
  recipientErrors.value = {}
  if (!recipientForm.value.user_id) {
    recipientErrors.value.user_id = 'انتخاب گیرنده الزامی است.'
    return
  }
  actionLoading.value = true
  try {
    await correspondenceAPI.addRecipients(props.correspondence.id as number, {
      recipients: [{
        user_id: recipientForm.value.user_id,
        type: recipientForm.value.type,
        due_at: recipientForm.value.type === 'cc' ? null : (recipientForm.value.due_at || null)
      }]
    })
    $q.notify({ type: 'positive', message: 'گیرنده اضافه شد.' })
    recipientDialog.value = false
    emit('refresh')
  } catch (e) {
    console.error(e)
    const errs = handleError(e)
    if (errs) recipientErrors.value = errs
  } finally {
    actionLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.side-card {
  border: 1px solid #edf2f7;

  .card-head-title {
    border-bottom: 1px solid #edf2f7;
    padding-bottom: 6px;
  }

  .recipient-badge-row {
    background: #f7fafc;
    border: 1px solid #edf2f7;
    .rec-type-tag {
      font-size: 0.68rem;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      &.is-to { background: #ebf8ff; color: #2b6cb0; }
      &.is-cc { background: #e6fffa; color: #234e52; }
    }
  }
}

.font-mono {
  font-family: inherit;
  font-variant-numeric: tabular-nums;
}

.rounded-xl {
  border-radius: 14px;
}
</style>