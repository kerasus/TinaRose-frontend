<template>
  <div class="correspondence-create-page q-pa-md q-pa-lg-lg">
    <!-- هدر بالای صفحه -->
    <div class="page-header row items-center justify-between q-mb-lg">
      <div class="row items-center q-gutter-x-md">
        <q-btn
          flat
          round
          dense
          icon="arrow_forward"
          color="grey-8"
          :to="{ name: 'Panel.Correspondence.List' }">
          <q-tooltip>بازگشت به فهرست نامه‌ها</q-tooltip>
        </q-btn>
        <div>
          <div class="text-h5 text-weight-bold text-grey-9 row items-center q-gutter-x-xs">
            <q-icon
              name="note_add"
              color="primary"
              size="28px" />
            <span>ایجاد نامه اداری</span>
          </div>
          <div class="text-caption text-grey-6 q-mt-xs">
            اطلاعات نامه، گیرندگان و طبقه‌بندی سند را تکمیل و پیش‌نویس را ثبت کنید.
          </div>
        </div>
      </div>

      <!-- اکشن‌های سریع هدر -->
      <div class="row items-center q-gutter-sm">
        <q-btn
          flat
          color="grey-7"
          label="انصراف"
          :to="{ name: 'Panel.Correspondence.List' }"
          class="rounded-borders" />
        <q-btn
          unelevated
          color="primary"
          icon="save"
          label="ثبت پیش‌نویس"
          :loading="loading"
          :disable="sending"
          class="q-px-md rounded-borders"
          @click="submit" />
        <q-btn
          unelevated
          color="positive"
          icon="send"
          label="ارسال نامه"
          :loading="sending"
          :disable="loading"
          class="q-px-md rounded-borders"
          @click="submitAndSend" />
      </div>
    </div>

    <!-- فرم اصلی در قالب گرید چند ستونه -->
    <div class="row q-col-gutter-lg">
      <!-- ستون اصلی: موضوع، متن سند و مشخصات محتوا -->
      <div class="col-12 col-lg-8">
        <q-card
          flat
          class="doc-sheet shadow-1 rounded-borders q-pa-md q-pa-md-lg bg-white">
          <!-- موضوع نامه -->
          <div class="q-mb-lg">
            <label class="field-label text-weight-bold text-grey-8 q-mb-xs block">
              موضوع نامه <span class="text-negative">*</span>
            </label>
            <q-input
              v-model="form.subject"
              placeholder="موضوع خلاصه و گویای نامه را وارد کنید..."
              outlined
              dense
              class="custom-field"
              :error="!!errors.subject"
              :error-message="errors.subject">
              <template #prepend>
                <q-icon
                  name="title"
                  color="grey-6" />
              </template>
            </q-input>
          </div>

          <!-- بدنه اصلی / متن نامه -->
          <div class="q-mb-md">
            <div class="row items-center justify-between q-mb-xs">
              <label class="field-label text-weight-bold text-grey-8">
                متن نامه <span class="text-negative">*</span>
              </label>
              <span class="text-caption text-grey-6">
                {{ form.body ? form.body.length : 0 }} کاراکتر
              </span>
            </div>

            <!-- استفاده از textarea بومی کوآزار با استایل کاغذ اداری -->
            <div class="letter-paper-wrapper">
              <div class="letter-paper-header row items-center justify-between q-px-md q-py-xs bg-grey-1 border-bottom-subtle">
                <span class="text-caption text-grey-7 font-mono">بسمه‌تعالی</span>
                <q-btn
                  v-if="form.body"
                  flat
                  dense
                  size="sm"
                  color="grey-7"
                  icon="clear"
                  label="پاکسازی متن"
                  @click="form.body = ''" />
              </div>
              <q-input
                v-model="form.body"
                type="textarea"
                outlined
                autogrow
                placeholder="متن اصلی نامه اداری، احکام یا دستورات را در این بخش مرقوم فرمایید..."
                class="letter-body-textarea"
                :input-style="{ minHeight: '260px', lineHeight: '2.1', fontSize: '15px' }"
                :error="!!errors.body"
                :error-message="errors.body" />
            </div>
          </div>
        </q-card>
      </div>

      <!-- ستون کناری: تنظیمات، گیرندگان، فوریت و محرمانگی -->
      <div class="col-12 col-lg-4">
        <div class="q-gutter-y-md">
          <!-- کارت طبقه‌بندی و اولویت -->
          <q-card
            flat
            class="sidebar-card shadow-1 rounded-borders bg-white q-pa-md">
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-md row items-center q-gutter-x-xs">
              <q-icon
                name="tune"
                size="18px"
                color="primary" />
              <span>ویژگی‌ها و مهلت نامه</span>
            </div>

            <div class="q-gutter-y-md">
              <div>
                <label class="field-label text-caption text-weight-medium text-grey-7 q-mb-xs block">اولویت اقدام</label>
                <q-select
                  v-model="form.priority"
                  :options="priorityOptions"
                  outlined
                  dense
                  emit-value
                  map-options
                  class="custom-field"
                  :error="!!errors.priority"
                  :error-message="errors.priority">
                  <template #prepend>
                    <q-icon
                      :name="getPriorityIcon(form.priority)"
                      :color="getPriorityColor(form.priority)" />
                  </template>
                </q-select>
              </div>

              <div>
                <label class="field-label text-caption text-weight-medium text-grey-7 q-mb-xs block">سطح محرمانگی</label>
                <q-select
                  v-model="form.confidentiality"
                  :options="confidentialityOptions"
                  outlined
                  dense
                  emit-value
                  map-options
                  class="custom-field"
                  :error="!!errors.confidentiality"
                  :error-message="errors.confidentiality">
                  <template #prepend>
                    <q-icon
                      :name="form.confidentiality === 'confidential' ? 'lock' : 'lock_open'"
                      :color="form.confidentiality === 'confidential' ? 'negative' : 'grey-7'" />
                  </template>
                </q-select>
              </div>

              <div>
                <label class="field-label text-caption text-weight-medium text-grey-7 q-mb-xs block">مهلت پیگیری و پاسخ</label>
                <form-builder-date-time
                  v-model:value="form.due_at"
                  label="انتخاب تاریخ و ساعت مهلت"
                  outlined
                  dense
                  :error="!!errors.due_at"
                  :error-message="errors.due_at" />
              </div>
            </div>
          </q-card>

          <!-- کارت گیرندگان نامه -->
          <q-card
            flat
            class="sidebar-card recipients-card shadow-1 rounded-borders bg-white q-pa-md">

            <!-- هدر کارت -->
            <div class="row items-start justify-between q-mb-md">
              <div class="row items-center q-gutter-x-sm">
                <div class="section-icon bg-primary-1 text-primary">
                  <q-icon
                    name="groups"
                    size="20px" />
                </div>

                <div>
                  <div class="text-subtitle2 text-weight-bold text-grey-9">
                    گیرندگان نامه
                  </div>
                  <div class="text-caption text-grey-6 q-mt-xs">
                    مشخص کنید چه کسی باید اقدام کند یا فقط در جریان باشد.
                  </div>
                </div>
              </div>

              <q-badge
                v-if="form.recipients.length"
                color="primary"
                outline
                class="recipient-count-badge">
                {{ form.recipients.length }} نفر
              </q-badge>
            </div>

            <!-- راهنمای نوع گیرنده -->
            <div class="recipient-legend row items-center q-gutter-sm q-mb-md">
              <div class="legend-item">
                <q-icon
                  name="task_alt"
                  color="primary"
                  size="16px" />
                <span>To: اقدام و پاسخ</span>
              </div>

              <div class="legend-item">
                <q-icon
                  name="visibility"
                  color="grey-7"
                  size="16px" />
                <span>CC: صرفاً اطلاع</span>
              </div>
            </div>

            <!-- لیست گیرندگان -->
            <div
              v-if="form.recipients.length"
              class="recipients-list">

              <div
                v-for="(r, idx) in form.recipients"
                :key="idx"
                class="recipient-item">

                <!-- شماره ردیف -->
                <div class="recipient-index">
                  {{ idx + 1 }}
                </div>

                <div class="recipient-content">

                  <!-- ردیف بالایی: کاربر و حذف -->
                  <div class="row items-start no-wrap q-col-gutter-sm">

                    <div class="col">
                      <form-builder-select-user
                        v-model:value="r.user_id"
                        label="شخص یا واحد گیرنده" />
                    </div>

                    <q-btn
                      flat
                      round
                      dense
                      color="negative"
                      icon="delete_outline"
                      class="recipient-delete-btn"
                      @click="removeRecipient(idx)">
                      <q-tooltip>حذف این گیرنده</q-tooltip>
                    </q-btn>
                  </div>

                  <!-- نوع ارجاع -->
                  <div class="q-mt-md">
                    <div class="text-caption text-weight-medium text-grey-7 q-mb-xs">
                      نوع دریافت نامه
                    </div>

                    <q-btn-toggle
                      v-model="r.type"
                      spread
                      no-caps
                      unelevated
                      toggle-color="primary"
                      color="grey-2"
                      text-color="grey-7"
                      class="recipient-type-toggle"
                      :options="recipientTypeOptions"
                      @update:model-value="onRecipientTypeChange(r)" />
                  </div>

                  <!-- مهلت اختصاصی گیرنده اصلی -->
                  <div
                    v-if="r.type === 'to'"
                    class="recipient-deadline q-mt-md">

                    <div class="row items-center justify-between q-mb-xs">
                      <div class="text-caption text-weight-medium text-grey-7">
                        مهلت اقدام این گیرنده
                      </div>

                      <q-badge
                        color="orange-8"
                        text-color="white"
                        label="اختصاصی" />
                    </div>

                    <form-builder-date-time
                      v-model:value="r.due_at"
                      label="تاریخ و ساعت مهلت اقدام"
                      outlined
                      dense />

                    <div class="text-caption text-grey-6 q-mt-xs">
                      این مهلت فقط برای همین گیرنده ثبت می‌شود.
                    </div>
                  </div>

                  <!-- توضیح برای CC -->
                  <div
                    v-else
                    class="cc-hint q-mt-md">
                    <q-icon
                      name="info"
                      size="16px"
                      color="grey-7" />
                    <span>
                      گیرنده رونوشت فقط برای اطلاع است و مهلت اقدام ندارد.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- وضعیت خالی -->
            <div
              v-else
              class="empty-recipients">
              <q-icon
                name="person_add_alt"
                size="34px"
                color="grey-5" />

              <div class="text-body2 text-grey-7 q-mt-sm">
                هنوز گیرنده‌ای اضافه نشده است
              </div>

              <div class="text-caption text-grey-5 q-mt-xs">
                حداقل یک گیرنده اصلی برای اقدام اضافه کنید.
              </div>
            </div>

            <!-- دکمه افزودن -->
            <q-btn
              outline
              no-caps
              color="primary"
              icon="person_add"
              label="افزودن گیرنده"
              class="full-width add-recipient-btn q-mt-md"
              @click="addRecipient" />

            <!-- خطای کلی گیرندگان -->
            <div
              v-if="errors.recipients"
              class="text-negative text-caption q-mt-sm row items-center q-gutter-x-xs">
              <q-icon
                name="error_outline"
                size="16px" />
              <span>{{ errors.recipients }}</span>
            </div>
          </q-card>
        </div>
      </div>
    </div>

    <!-- فوتر اکشن‌ها در دستگاه‌های کوچک و تبلت -->
    <div class="row justify-end q-gutter-sm q-mt-lg">
      <q-btn
        flat
        color="grey-8"
        label="انصراف و بازگشت"
        :to="{ name: 'Panel.Correspondence.List' }" />
      <q-btn
        unelevated
        color="primary"
        icon="check"
        label="ایجاد و ذخیره پیش‌نویس"
        :loading="loading"
        :disable="sending"
        class="q-px-lg"
        @click="submit" />
      <q-btn
        unelevated
        color="positive"
        icon="send"
        label="ایجاد و ارسال نامه"
        :loading="sending"
        :disable="loading"
        class="q-px-lg"
        @click="submitAndSend" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import CorrespondenceAPI from 'src/repositories/correspondence'
import FormBuilderDateTime from 'src/components/controls/formBuilderCustomInput/FormBuilderDateTime.vue'
import FormBuilderSelectUser from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue'

const $q = useQuasar()
const router = useRouter()
const correspondenceAPI = new CorrespondenceAPI()

const loading = ref(false)
const sending = ref(false)
const errors = ref<Record<string, string>>({})

const form = ref({
  subject: '',
  body: '',
  priority: 'normal',
  confidentiality: 'internal',
  due_at: null as string | null,
  recipients: [] as { user_id: number | null, type: 'to' | 'cc', due_at: string | null }[]
})

const recipientTypeOptions = [
  {
    label: 'اقدام',
    value: 'to',
    icon: 'task_alt'
  },
  {
    label: 'رونوشت',
    value: 'cc',
    icon: 'visibility'
  }
]

const priorityOptions = [
  { label: 'کم', value: 'low' },
  { label: 'معمولی', value: 'normal' },
  { label: 'زیاد', value: 'high' },
  { label: 'فوری', value: 'urgent' }
]

const confidentialityOptions = [
  { label: 'داخلی (عادی)', value: 'internal' },
  { label: 'محرمانه', value: 'confidential' }
]

// شمارش گیرندگان به تفکیک نوع، برای نمایش خلاصه در کارت
const primaryRecipientsCount = computed(
  () => form.value.recipients.filter((r) => r.type === 'to' && !!r.user_id).length
)

const ccRecipientsCount = computed(
  () => form.value.recipients.filter((r) => r.type === 'cc' && !!r.user_id).length
)

function addRecipient () {
  const hasPrimaryRecipient = form.value.recipients.some(
    (recipient) => recipient.type === 'to'
  )

  form.value.recipients.push({
    user_id: null,
    type: hasPrimaryRecipient ? 'cc' : 'to',
    due_at: null
  })
}

function onRecipientTypeChange (r: { type: 'to' | 'cc', due_at: string | null }) {
  if (r.type === 'cc') {
    r.due_at = null
  }
}

function removeRecipient (index: number) {
  form.value.recipients.splice(index, 1)
}

function getPriorityIcon (val: string) {
  switch (val) {
    case 'urgent': return 'bolt'
    case 'high': return 'priority_high'
    case 'low': return 'arrow_downward'
    default: return 'fiber_manual_record'
  }
}

function getPriorityColor (val: string) {
  switch (val) {
    case 'urgent': return 'negative'
    case 'high': return 'warning'
    case 'low': return 'info'
    default: return 'primary'
  }
}

function setErrors (e: any) {
  errors.value = {}
  if (e?.response?.status === 422 && e.response.data?.errors) {
    const serverErrors = e.response.data.errors
    Object.keys(serverErrors).forEach((k) => {
      errors.value[k] = Array.isArray(serverErrors[k]) ? serverErrors[k][0] : serverErrors[k]
    })
  }
}

function showRequestError (e: any) {
  const status = e?.response?.status
  if (status === 403) {
    $q.notify({ type: 'negative', message: 'دسترسی غیرمجاز.' })
    return
  }
  if (status === 409) {
    $q.notify({ type: 'negative', message: e?.response?.data?.message || 'تعارض در وضعیت رکورد.' })
    return
  }
  if (status === 422) {
    setErrors(e)
    $q.notify({ type: 'negative', message: e?.response?.data?.message || 'اطلاعات واردشده معتبر نیست.' })
    return
  }
  $q.notify({ type: 'negative', message: e?.response?.data?.message || 'خطا در انجام عملیات.' })
}

async function submit () {
  await persistCorrespondence(false)
}

async function submitAndSend () {
  await persistCorrespondence(true)
}

async function persistCorrespondence (sendImmediately: boolean) {
  if (loading.value || sending.value) {
    return
  }

  errors.value = {}

  const validRecipients = form.value.recipients.filter(
    (recipient) => !!recipient.user_id
  )

  const hasPrimaryRecipient = validRecipients.some(
    (recipient) => recipient.type === 'to'
  )

  if (!hasPrimaryRecipient) {
    errors.value.recipients = 'حداقل یک گیرنده اصلی برای اقدام باید انتخاب شود.'
    $q.notify({
      type: 'warning',
      message: 'حداقل یک گیرنده اصلی برای اقدام انتخاب کنید.'
    })
    return
  }

  if (sendImmediately) {
    sending.value = true
  } else {
    loading.value = true
  }

  try {
    const payload: any = {
      subject: form.value.subject,
      body: form.value.body || null,
      priority: form.value.priority,
      confidentiality: form.value.confidentiality,
      due_at: form.value.due_at || null,
      recipients: validRecipients.map((r) => ({
        user_id: r.user_id as number,
        type: r.type,
        due_at: r.type === 'cc' ? null : (r.due_at || null)
      }))
    }

    if (sendImmediately) {
      payload.send = true
    }

    const created = await correspondenceAPI.createDraft(payload)

    $q.notify({
      type: 'positive',
      message: sendImmediately
        ? 'نامه با موفقیت ارسال شد.'
        : 'پیش‌نویس با موفقیت ایجاد شد.'
    })

    if (created && (created as any).id) {
      router.push({ name: 'Panel.Correspondence.Show', params: { id: (created as any).id } })
    } else {
      router.push({ name: 'Panel.Correspondence.List' })
    }
  } catch (e: any) {
    showRequestError(e)
  } finally {
    loading.value = false
    sending.value = false
  }
}
</script>

<style scoped lang="scss">
.correspondence-create-page {

  .doc-sheet,
  .sidebar-card {
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease-in-out;
  }

  .border-bottom-subtle {
    border-bottom: 1px solid #edf2f7;
  }

  .letter-paper-wrapper {
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    overflow: hidden;
    background: #ffffff;

    .letter-paper-header {
      font-size: 0.8rem;
    }

    :deep(.letter-body-textarea) {
      .q-field__control {
        border-radius: 0;
        background: #fdfdfd;
        padding: 16px;

        &:before,
        &:after {
          display: none !important;
        }
      }

      textarea {
        color: #1e293b;
        font-family: inherit;
      }
    }
  }

  .field-label {
    font-size: 0.85rem;
  }

  .custom-field {
    :deep(.q-field__control) {
      border-radius: 8px;
    }
  }

  /* ---------- کارت گیرندگان ---------- */
  .recipients-card {
    border: 1px solid #e2e8f0;
  }

  .section-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    flex: 0 0 auto;
  }

  .recipient-count-badge {
    border-radius: 8px;
    padding: 5px 8px;
  }

  .recipient-legend {
    padding: 9px 10px;
    border-radius: 8px;
    background: #f8fafc;
    border: 1px solid #edf2f7;
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #64748b;
    font-size: 12px;
  }

  .recipients-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .recipient-item {
    display: flex;
    gap: 10px;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: #ffffff;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .recipient-item:hover {
    border-color: #93c5fd;
    box-shadow: 0 3px 12px rgba(15, 23, 42, 0.06);
  }

  .recipient-index {
    flex: 0 0 28px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #eff6ff;
    color: #2563eb;
    font-size: 12px;
    font-weight: 700;
  }

  .recipient-content {
    flex: 1;
    min-width: 0;
  }

  .recipient-delete-btn {
    flex: 0 0 auto;
    margin-top: 20px;
  }

  .recipient-user-select {
    :deep(.q-field__control) {
      border-radius: 8px;
      min-height: 42px;
    }
  }

  .recipient-option {
    min-height: 48px;
  }

  .selected-recipient-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .recipient-type-toggle {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;

    :deep(.q-btn) {
      min-height: 36px;
      border-radius: 0;
      font-size: 12px;
    }

    :deep(.q-btn--active) {
      font-weight: 700;
    }
  }

  .recipient-deadline {
    padding: 10px;
    border-radius: 8px;
    background: #fffaf0;
    border: 1px solid #fde68a;
  }

  .cc-hint {
    display: flex;
    align-items: flex-start;
    gap: 5px;
    padding: 9px 10px;
    border-radius: 8px;
    background: #f8fafc;
    color: #64748b;
    font-size: 12px;
    line-height: 1.8;
  }

  .empty-recipients {
    padding: 24px 12px;
    text-align: center;
    border: 1px dashed #cbd5e1;
    border-radius: 10px;
    background: #f8fafc;
  }

  .add-recipient-btn {
    border-radius: 8px;
  }

  @media (max-width: 599px) {
    .recipient-item {
      padding: 10px;
    }

    .recipient-delete-btn {
      margin-top: 19px;
    }

    .recipient-legend {
      align-items: flex-start;
      flex-direction: column;
      gap: 4px;
    }
  }
}
</style>
