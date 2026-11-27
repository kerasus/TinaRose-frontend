<template>
  <div>
    <!-- بخش آپلود در پیش‌نویس -->
    <div
      v-if="canAttach"
      class="upload-drop-area q-pa-md rounded-borders q-mb-lg">
      <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-sm row items-center q-gutter-x-xs">
        <q-icon
          name="cloud_upload"
          size="20px"
          color="primary" />
        <span>بارگذاری فایل جدید برای این مکاتبه</span>
      </div>
      <div class="row q-col-gutter-sm items-center">
        <div class="col-12 col-sm-8">
          <q-file
            v-model="attachFile"
            dense
            outlined
            label="انتخاب فایل پیوست..."
            :error="!!attachError"
            :error-message="attachError">
            <template #prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>
        <div class="col-12 col-sm-4">
          <q-btn
            unelevated
            color="primary"
            icon="upload"
            label="شروع آپلود"
            class="full-width modern-action-btn"
            :loading="attachLoading"
            :disable="!attachFile"
            @click="uploadAttachment" />
        </div>
      </div>
    </div>

    <!-- لیست پیوست‌ها به صورت کارت‌های مدرن -->
    <div
      v-if="correspondence.attachments?.length"
      class="row q-col-gutter-sm">
      <div
        v-for="a in correspondence.attachments"
        :key="a.id"
        class="col-12 col-sm-6">
        <div class="attachment-modern-card row items-center q-pa-sm rounded-borders border-subtle">
          <div class="file-thumb q-mr-sm">
            <q-img
              v-if="isImageAttachment(a) && a.path"
              :src="a.path"
              class="rounded-borders cursor-pointer fit"
              @click="openImagePreview(a)" />
            <q-icon
              v-else
              name="insert_drive_file"
              size="28px"
              color="primary" />
          </div>
          <div class="column col overflow-hidden">
            <div
              class="text-weight-bold text-caption text-primary text-ellipsis cursor-pointer"
              @click="isImageAttachment(a) && a.path ? openImagePreview(a) : null">
              {{ a.original_name }}
            </div>
            <div
              class="text-caption text-grey-6 font-mono"
              style="font-size: 0.72rem;">
              {{ formatBytes(a.size_bytes) }} • {{ userLabel(a.uploaded_by, a.uploaded_by_id) }}
            </div>
          </div>
          <q-btn
            v-if="canAttach"
            flat
            round
            dense
            size="sm"
            color="negative"
            icon="delete"
            :loading="deletingId === a.id"
            @click="confirmDelete(a)">
            <q-tooltip>حذف پیوست</q-tooltip>
          </q-btn>
          <q-btn
            v-if="a.path"
            flat
            round
            dense
            size="sm"
            color="grey-7"
            icon="download"
            tag="a"
            :href="a.path"
            target="_blank"
            download>
            <q-tooltip>دانلود</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
    <div
      v-else
      class="text-center text-grey-5 q-pa-lg">
      هیچ فایلی به این نامه پیوست نشده است.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import CorrespondenceAPI, {
  type Correspondence,
  type CorrespondenceAttachment
} from 'src/repositories/correspondence'
import { formatBytes, userLabel } from './correspondenceUtils'

const props = defineProps<{
  correspondence: Correspondence
  canAttach?: boolean
}>()

const emit = defineEmits<{
  refresh: []
  preview: [attachment: CorrespondenceAttachment]
}>()

const $q = useQuasar()
const correspondenceAPI = new CorrespondenceAPI()

const attachFile = ref<File | null>(null)
const attachError = ref('')
const attachLoading = ref(false)
const deletingId = ref<number | null>(null)

function isImageAttachment (a: CorrespondenceAttachment): boolean {
  return !!a.mime_type && a.mime_type.startsWith('image/')
}

function openImagePreview (a: CorrespondenceAttachment) {
  if (!a.path || !isImageAttachment(a)) return
  emit('preview', a)
}

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

async function uploadAttachment () {
  if (!attachFile.value) return
  attachError.value = ''
  attachLoading.value = true
  try {
    await correspondenceAPI.attach(props.correspondence.id as number, attachFile.value)
    $q.notify({ type: 'positive', message: 'پیوست بارگذاری شد.' })
    attachFile.value = null
    emit('refresh')
  } catch (e: any) {
    const errs = handleError(e)
    if (errs?.file) attachError.value = Array.isArray(errs.file) ? errs.file[0] : errs.file
  } finally {
    attachLoading.value = false
  }
}

function confirmDelete (a: CorrespondenceAttachment) {
  $q.dialog({
    title: 'حذف پیوست',
    message: `آیا از حذف فایل «${a.original_name}» اطمینان دارید؟`,
    cancel: { label: 'انصراف', flat: true, color: 'grey-8' },
    ok: { label: 'حذف', color: 'negative', unelevated: true },
    persistent: true
  }).onOk(async () => {
    deletingId.value = a.id
    try {
      await correspondenceAPI.deleteAttachment(props.correspondence.id as number, a.id)
      $q.notify({ type: 'positive', message: 'پیوست حذف شد.' })
      emit('refresh')
    } catch (e) {
      handleError(e)
    } finally {
      deletingId.value = null
    }
  })
}
</script>

<style scoped lang="scss">
.upload-drop-area {
  background: #f7fafc;
  border: 1px dashed #cbd5e0;
}

.attachment-modern-card {
  background: #ffffff;
  transition: background 0.15s ease;
  &:hover {
    background: #f7fafc;
  }
  .file-thumb {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #edf2f7;
    border-radius: 6px;
    overflow: hidden;
  }
}

.border-subtle {
  border: 1px solid #edf2f7;
}

.font-mono {
  font-family: inherit;
  font-variant-numeric: tabular-nums;
}

.modern-action-btn {
  border-radius: 8px;
  font-weight: 700;
  transition: transform 0.15s ease;
  &:active {
    transform: scale(0.98);
  }
}
</style>