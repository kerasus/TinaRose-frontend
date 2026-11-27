<template>
  <div>
    <!-- دیالوگ ایجاد ارجاع فرزند -->
    <q-dialog
      v-model="childDialog"
      persistent
      transition-show="scale"
      transition-hide="scale">
      <q-card class="child-dialog-card rounded-xl overflow-hidden">
        <q-card-section class="child-dialog-header row items-center no-wrap">
          <q-avatar
            color="white"
            text-color="primary"
            icon="call_split"
            size="40px"
            class="q-mr-md" />
          <div class="col">
            <div class="text-h6 text-weight-bold text-white">ایجاد ارجاع فرزند</div>
            <div class="text-caption text-blue-1">ارجاع وظیفه یا پیگیری به کارشناسان و همکاران</div>
          </div>
          <q-btn
            v-close-popup
            dense
            flat
            round
            icon="close"
            color="white" />
        </q-card-section>

        <q-card-section class="child-dialog-form">
          <form-builder-select-user
            v-model:value="childForm.assigned_to_id"
            label="ارجاع به کارشناس / مدیر" />

          <q-input
            v-model="childForm.note"
            label="شرح وظیفه / دستور اقدام"
            placeholder="توضیحات و دستورات لازم را بنویسید..."
            outlined
            type="textarea"
            autogrow
            :input-style="{ minHeight: '110px', lineHeight: '1.8' }"
            :error="!!childErrors.note"
            :error-message="childErrors.note">
            <template #prepend>
              <q-icon
                name="edit_note"
                color="primary" />
            </template>
          </q-input>

          <form-builder-date-time
            v-model:value="childForm.due_at"
            label="مهلت اقدام (اختیاری)"
            dense
            outlined />
        </q-card-section>

        <q-separator />

        <q-card-actions
          align="between"
          class="child-dialog-actions q-pa-md">
          <q-btn
            v-close-popup
            flat
            color="grey-7"
            label="انصراف" />
          <q-btn
            unelevated
            color="primary"
            icon="send"
            label="ثبت و ارسال ارجاع"
            class="modern-action-btn"
            :loading="dialogLoading"
            @click="submitChild" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- دیالوگ اقدام / حل‌وفصل ارجاع -->
    <q-dialog
      v-model="resolveDialog"
      persistent>
      <q-card style="min-width: 380px; max-width: 90vw; border-radius: 14px;">
        <q-card-section
          class="row items-center justify-between text-white q-py-sm"
          :class="resolveMode === 'complete' ? 'bg-positive' : 'bg-negative'">
          <div class="text-subtitle1 text-weight-bold">
            {{ resolveMode === 'complete' ? 'تکمیل اقدام ارجاع' : 'رد ارجاع نامه' }}
          </div>
          <q-btn
            v-close-popup
            dense
            flat
            round
            icon="close" />
        </q-card-section>
        <q-card-section class="q-pt-md">
          <q-input
            v-model="resolveNote"
            :label="resolveMode === 'complete' ? 'گزارش نتیجه و توضیحات تکمیلی (اختیاری)' : 'علت رد ارجاع'"
            outlined
            dense
            type="textarea"
            autogrow />
        </q-card-section>
        <q-separator />
        <q-card-actions
          align="right"
          class="q-pa-sm">
          <q-btn
            v-close-popup
            flat
            color="grey-8"
            label="انصراف" />
          <q-btn
            unelevated
            :color="resolveMode === 'complete' ? 'positive' : 'negative'"
            :icon="resolveMode === 'complete' ? 'check' : 'close'"
            label="ثبت نهایی"
            :loading="dialogLoading"
            @click="submitResolve" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- پیش‌نمایش تصویر -->
    <q-dialog v-model="previewDialog">
      <q-card style="width: 90vw; max-width: 90vw; border-radius: 12px; overflow: hidden;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle1 ellipsis">{{ previewAttachment?.original_name }}</div>
          <q-space />
          <q-btn
            v-close-popup
            icon="close"
            flat
            round
            dense />
        </q-card-section>
        <q-card-section class="q-pt-sm">
          <q-img
            v-if="previewAttachment?.path"
            :src="previewAttachment.path"
            :alt="previewAttachment.original_name"
            fit="contain"
            style="max-height: 80vh; width: 100%" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import FormBuilderDateTime from 'src/components/controls/formBuilderCustomInput/FormBuilderDateTime.vue'
import FormBuilderSelectUser from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue'
import CorrespondenceAPI, {
  type CorrespondenceAssignment,
  type CorrespondenceAttachment
} from 'src/repositories/correspondence'

const props = defineProps<{
  correspondenceId: number
}>()

const emit = defineEmits<{
  refresh: []
}>()

const $q = useQuasar()
const correspondenceAPI = new CorrespondenceAPI()

const dialogLoading = ref(false)

const childDialog = ref(false)
const childTarget = ref<CorrespondenceAssignment | null>(null)
const childForm = ref<{ assigned_to_id: number | null; note: string; due_at: string | null }>({
  assigned_to_id: null,
  note: '',
  due_at: null
})
const childErrors = ref<Record<string, string>>({})

const resolveDialog = ref(false)
const resolveMode = ref<'complete' | 'reject'>('complete')
const resolveTarget = ref<CorrespondenceAssignment | null>(null)
const resolveNote = ref('')

const previewDialog = ref(false)
const previewAttachment = ref<CorrespondenceAttachment | null>(null)

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

function openChild (a: CorrespondenceAssignment) {
  childTarget.value = a
  childForm.value = { assigned_to_id: null, note: '', due_at: null }
  childErrors.value = {}
  childDialog.value = true
}

function openResolve (a: CorrespondenceAssignment, mode: 'complete' | 'reject') {
  if (mode === 'complete' && a.status !== 'in_progress') {
    $q.notify({ type: 'negative', message: 'برای تکمیل، ابتدا باید ارجاع را شروع کنید.' })
    return
  }
  resolveTarget.value = a
  resolveMode.value = mode
  resolveNote.value = ''
  resolveDialog.value = true
}

function openPreview (a: CorrespondenceAttachment) {
  if (!a.path) return
  previewAttachment.value = a
  previewDialog.value = true
}

async function submitChild () {
  if (!childTarget.value) return
  childErrors.value = {}
  dialogLoading.value = true
  try {
    const payload: any = {
      assigned_to_id: childForm.value.assigned_to_id,
      note: childForm.value.note || null,
      due_at: childForm.value.due_at || null
    }
    await correspondenceAPI.createChildAssignment(childTarget.value.id, payload)
    $q.notify({ type: 'positive', message: 'ارجاع فرزند ایجاد شد.' })
    childDialog.value = false
    emit('refresh')
  } catch (e: any) {
    const errs = handleError(e)
    if (errs) {
      Object.keys(errs).forEach((k) => { childErrors.value[k] = Array.isArray(errs[k]) ? errs[k][0] : errs[k] })
    }
  } finally { dialogLoading.value = false }
}

async function submitResolve () {
  if (!resolveTarget.value) return
  dialogLoading.value = true
  try {
    if (resolveMode.value === 'complete') {
      await correspondenceAPI.completeAssignment(resolveTarget.value.id, { resolution_note: resolveNote.value || null })
      $q.notify({ type: 'positive', message: 'ارجاع تکمیل شد.' })
    } else {
      await correspondenceAPI.rejectAssignment(resolveTarget.value.id, { resolution_note: resolveNote.value || null })
      $q.notify({ type: 'positive', message: 'ارجاع رد شد.' })
    }
    resolveDialog.value = false
    emit('refresh')
  } catch (e) { handleError(e) } finally { dialogLoading.value = false }
}

defineExpose({
  openChild,
  openResolve,
  openPreview
})
</script>

<style scoped lang="scss">
.rounded-xl {
  border-radius: 14px;
}

.modern-action-btn {
  border-radius: 8px;
  font-weight: 700;
}

/* دیالوگ ارجاع فرزند */
.child-dialog-card {
  width: 520px;
  max-width: 92vw;
}

.child-dialog-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #1976d2, #3949ab);
}

.child-dialog-form {
  display: grid;
  gap: 16px;
  padding: 20px;
}
</style>