<template>
  <div class="correspondence-workspace q-pa-sm q-pa-md-lg">
    <!-- وضعیت بارگذاری مینیمال و پرانرژی -->
    <div
      v-if="loading"
      class="loading-state-wrapper flex flex-center column q-py-xl">
      <q-spinner-puff
        size="64px"
        color="primary" />
      <div class="text-subtitle2 text-weight-bold text-grey-8 q-mt-md">در حال بارگذاری جزئیات سند مکاتبه...</div>
      <div class="text-caption text-grey-5">لطفاً چند لحظه شکیبا باشید</div>
    </div>

    <!-- وضعیت عدم دسترسی / خطا -->
    <div
      v-else-if="!correspondence"
      class="not-found-card bg-white q-pa-xl text-center shadow-sm rounded-xl border-subtle">
      <div class="empty-icon-wrap q-mx-auto q-mb-md">
        <q-icon
          name="mark_email_read"
          size="56px"
          color="grey-5" />
      </div>
      <div class="text-h6 text-weight-bolder text-grey-9">نامه مورد نظر یافت نشد یا دسترسی مسدود است</div>
      <p class="text-caption text-grey-6 q-mt-xs q-mx-auto max-w-400">
        ممکن است دسترسی شما تغییر کرده باشد یا این مکاتبه از کارتابل جاری خارج شده باشد.
      </p>
      <q-btn
        unelevated
        color="primary"
        icon="arrow_forward"
        label="بازگشت به کارتابل"
        class="modern-action-btn q-mt-md"
        :to="{ name: 'Panel.Correspondence.List' }" />
    </div>

    <!-- بدنه اصلی فضای کار (Workspace Layout) -->
    <template v-else>
      <!-- نوار کنترل بالایی (Floating Command Bar) -->
      <correspondence-header
        :correspondence="correspondence"
        :can-send="canSend"
        :can-delete="canDelete"
        :action-loading="actionLoading"
        :delete-loading="deleteLoading"
        @send="sendCorrespondence"
        @delete="confirmDelete" />

      <!-- ساختار دو ستونه مدرن -->
      <div class="row q-col-gutter-lg items-start">
        <!-- ستون سمت راست: تب‌های محتوای سند، گردش کار و پیوست‌ها -->
        <div class="col-12 col-lg-8 column q-gutter-y-md">
          <div class="main-content-card bg-white rounded-xl shadow-sm border-subtle overflow-hidden">
            <!-- نوار تب‌های پیشرفته -->
            <div class="tabs-header-strip row items-center justify-between q-px-md bg-grey-1 border-bottom-subtle">
              <q-tabs
                v-model="activeTab"
                dense
                no-caps
                active-color="primary"
                indicator-color="primary"
                align="left"
                class="modern-tabs text-grey-7">
                <q-tab
                  name="content"
                  icon="description"
                  label="متن و سند نامه" />
                <q-tab
                  name="workflow"
                  icon="account_tree">
                  <div class="row items-center q-gutter-x-xs">
                    <span>زنجیره ارجاعات</span>
                    <q-badge
                      v-if="correspondence.assignments?.length"
                      color="primary"
                      rounded
                      class="q-px-xs">
                      {{ correspondence.assignments.length }}
                    </q-badge>
                  </div>
                </q-tab>
                <q-tab
                  name="attachments"
                  icon="attach_file">
                  <div class="row items-center q-gutter-x-xs">
                    <span>پیوست‌ها</span>
                    <q-badge
                      v-if="correspondence.attachments?.length"
                      color="blue-grey"
                      rounded
                      class="q-px-xs">
                      {{ correspondence.attachments.length }}
                    </q-badge>
                  </div>
                </q-tab>
              </q-tabs>

              <!-- نشان پاسخ به در هدر تب -->
              <div
                v-if="correspondence.reply_to_id"
                class="reply-chip-indicator text-caption text-primary row items-center q-px-sm q-py-xs rounded-borders">
                <q-icon
                  name="reply"
                  size="14px"
                  class="q-mr-xs" />
                <span>عطف: <strong>{{ replyToLabel() }}</strong></span>
              </div>
            </div>

            <!-- بدنه تب‌ها -->
            <q-tab-panels
              v-model="activeTab"
              animated
              class="tab-panels-body">
              <!-- تب اول: سند اداری -->
              <q-tab-panel
                name="content"
                class="q-pa-lg q-pa-md-xl">
                <correspondence-content-tab :correspondence="correspondence" />
              </q-tab-panel>

              <!-- تب دوم: زنجیره و سابقه ارجاعات -->
              <q-tab-panel
                name="workflow"
                class="q-pa-lg">
                <assignment-tree
                  :assignments="correspondence.assignments || []"
                  :current-user-id="currentUserId"
                  :action-loading="actionLoading"
                  @start="onStart"
                  @resolve="openResolve"
                  @child="openChild" />
              </q-tab-panel>

              <!-- تب سوم: پیوست‌ها و آپلود -->
              <q-tab-panel
                name="attachments"
                class="q-pa-lg">
                <correspondence-attachments-tab
                  :correspondence="correspondence"
                  :can-attach="canAttach"
                  @refresh="load"
                  @preview="openPreview" />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>

        <!-- ستون سمت چپ: سایدبار متادیتای چابک (Quick Info Rail) -->
        <div class="col-12 col-lg-4 column q-gutter-y-md">
          <sender-sidebar :correspondence="correspondence" />

          <recipients-sidebar
            v-if="correspondence.recipients?.length"
            :correspondence="correspondence"
            :is-sender="isSender"
            @refresh="load" />

          <correspondence-timeline
            v-if="correspondence.events?.length"
            :events="correspondence.events" />
        </div>
      </div>

      <!-- دیالوگ‌های ارجاع فرزند، تکمیل/رد ارجاع و پیش‌نمایش -->
      <correspondence-dialogs
        ref="dialogsRef"
        :correspondence-id="correspondenceId"
        @refresh="load" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useUser } from 'src/stores/user'
import CorrespondenceAPI, {
  type Correspondence,
  type CorrespondenceAssignment,
  type CorrespondenceAttachment
} from 'src/repositories/correspondence'
import CorrespondenceHeader from 'src/components/correspondence/CorrespondenceHeader.vue'
import SenderSidebar from 'src/components/correspondence/SenderSidebar.vue'
import RecipientsSidebar from 'src/components/correspondence/RecipientsSidebar.vue'
import CorrespondenceTimeline from 'src/components/correspondence/CorrespondenceTimeline.vue'
import CorrespondenceContentTab from 'src/components/correspondence/CorrespondenceContentTab.vue'
import CorrespondenceAttachmentsTab from 'src/components/correspondence/CorrespondenceAttachmentsTab.vue'
import AssignmentTree from 'src/components/correspondence/AssignmentTree.vue'
import CorrespondenceDialogs from 'src/components/correspondence/CorrespondenceDialogs.vue'

defineOptions({
  name: 'CorrespondenceShowPage'
})

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const userStore = useUser()
const correspondenceAPI = new CorrespondenceAPI()

const loading = ref(false)
const actionLoading = ref(false)
const deleteLoading = ref(false)
const correspondence = ref<Correspondence | null>(null)
const dialogsRef = ref<InstanceType<typeof CorrespondenceDialogs> | null>(null)

const activeTab = ref<'content' | 'workflow' | 'attachments'>('content')

const correspondenceId = computed(() => Number(route.params.id))
const currentUserId = computed(() => userStore.me?.id ?? null)
const isSender = computed(
  () => !!correspondence.value?.sender_id && correspondence.value?.sender_id.toString() === userStore.me?.id.toString()
)
const isDraft = computed(() => correspondence.value?.status === 'draft')
const canSend = computed(() => isSender.value && isDraft.value)
const canAttach = computed(() => isSender.value && isDraft.value)
const canDelete = computed(
  () => isSender.value && correspondence.value?.has_been_seen === false
)

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

async function load () {
  loading.value = true
  try {
    correspondence.value = await correspondenceAPI.get(correspondenceId.value)
  } catch (e) {
    correspondence.value = null
    handleError(e)
  } finally {
    loading.value = false
  }
}

function replyToLabel () {
  const rt = correspondence.value?.reply_to
  if (!rt) return correspondence.value?.reply_to_id ? `نامه #${correspondence.value.reply_to_id}` : '-'
  const refNum = rt.reference_number || `#${rt.id}`
  const subj = rt.subject ? ` - ${rt.subject}` : ''
  return `${refNum}${subj}`
}

async function sendCorrespondence () {
  actionLoading.value = true
  try {
    await correspondenceAPI.send(correspondenceId.value)
    $q.notify({ type: 'positive', message: 'نامه با موفقیت ارسال شد.' })
    await load()
  } catch (e) {
    handleError(e)
  } finally {
    actionLoading.value = false
  }
}

async function startAssignment (id: number) {
  actionLoading.value = true
  try {
    await correspondenceAPI.startAssignment(id)
    $q.notify({ type: 'positive', message: 'ارجاع شروع شد.' })
    await load()
  } catch (e) { handleError(e) } finally { actionLoading.value = false }
}

function onStart (a: CorrespondenceAssignment) {
  startAssignment(a.id)
}

function openResolve (a: CorrespondenceAssignment, mode: 'complete' | 'reject') {
  dialogsRef.value?.openResolve(a, mode)
}

function openChild (a: CorrespondenceAssignment) {
  dialogsRef.value?.openChild(a)
}

function openPreview (a: CorrespondenceAttachment) {
  dialogsRef.value?.openPreview(a)
}

function confirmDelete () {
  if (!canDelete.value || !correspondence.value) {
    return
  }

  const subject = correspondence.value.subject || '-'

  $q.dialog({
    title: 'حذف نامه',
    message: `آیا از حذف نامه «${subject}» اطمینان دارید؟ این عمل قابل بازگشت نیست.`,
    cancel: { label: 'انصراف', flat: true, color: 'grey-8' },
    ok: { label: 'حذف نامه', color: 'negative', unelevated: true },
    persistent: true
  }).onOk(async () => {
    deleteLoading.value = true
    try {
      await correspondenceAPI.delete(correspondenceId.value)
      $q.notify({ type: 'positive', message: 'نامه با موفقیت حذف شد.' })
      router.push({ name: 'Panel.Correspondence.List' })
    } catch (e) {
      handleError(e)
    } finally {
      deleteLoading.value = false
    }
  })
}

onMounted(() => {
  load()
})
</script>

<style scoped lang="scss">
.correspondence-workspace {
  font-family: inherit;

  .border-subtle {
    border: 1px solid #edf2f7;
  }

  .border-bottom-subtle {
    border-bottom: 1px solid #edf2f7;
  }

  .rounded-xl {
    border-radius: 14px;
  }

  .max-w-400 {
    max-width: 400px;
  }

  .modern-action-btn {
    border-radius: 8px;
    font-weight: 700;
    transition: transform 0.15s ease;
    &:active {
      transform: scale(0.98);
    }
  }

  /* کارت تب‌ها */
  .main-content-card {
    .tabs-header-strip {
      border-top-left-radius: 14px;
      border-top-right-radius: 14px;
    }

    .modern-tabs {
      :deep(.q-tab__label) {
        font-weight: 700;
        font-size: 0.9rem;
      }
    }

    .reply-chip-indicator {
      background: #ebf8ff;
    }

    .tab-panels-body {
      background: #ffffff;
    }
  }
}

/* بهینه‌سازی چاپ سند */
@media print {
  .command-bar,
  .tabs-header-strip,
  .upload-drop-area,
  .col-lg-4,
  .q-btn {
    display: none !important;
  }

  .col-lg-8 {
    width: 100% !important;
  }

  .main-content-card {
    border: none !important;
    box-shadow: none !important;
  }
}
</style>