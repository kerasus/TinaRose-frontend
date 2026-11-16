<template>
  <div class="luxury-dashboard q-pa-lg">
    <!-- Hero / Welcome Banner -->
    <div class="hero-banner q-pa-lg q-mb-xl rounded-2xl relative-position overflow-hidden">
      <div class="hero-backdrop-glow" />
      <div class="row items-center justify-between relative-position">
        <div class="col-12 col-md-8">
          <div class="row items-center q-gutter-x-sm q-mb-xs">
            <span class="live-pulse" />
            <span class="text-caption text-primary-light text-weight-bold letter-spacing-1">سامانه جامع مدیریت تینارز</span>
          </div>
          <h1 class="text-h4 text-weight-bolder text-white q-my-none">داشبورد فرماندهی و نظارت</h1>
          <p class="text-subtitle1 text-grey-4 q-mt-sm q-mb-none font-light">
            وضعیت کارتابل، انبارها و تبادلات سیستم در یک نگاه.
          </p>
        </div>
        <div class="col-12 col-md-4 text-right q-mt-md-none q-mt-md">
          <q-btn
            unelevated
            rounded
            icon="sync"
            label="بروزرسانی داده‌ها"
            class="refresh-btn text-weight-bold"
            :loading="isAnyLoading"
            @click="refreshAll">
            <template #loading>
              <q-spinner-dots size="20px" />
            </template>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Main Metric Cards -->
    <div class="row q-col-gutter-lg">
      <div
        v-for="(card, idx) in cards"
        :key="idx"
        class="col-12 col-sm-6 col-lg-3">
        <div
          class="metric-card rounded-2xl cursor-pointer"
          :class="`theme-${card.color}`"
          @click="router.push(card.to)">
          <!-- Ambient Glow Effect -->
          <div class="card-ambient-glow" />

          <div class="card-inner q-pa-lg column justify-between full-height">
            <!-- Top Row: Icon & Status Tag -->
            <div class="row items-center justify-between no-wrap q-mb-lg">
              <div class="metric-icon-box flex flex-center">
                <q-icon
                  :name="card.icon"
                  size="26px" />
              </div>
              <div class="status-tag rounded-borders q-px-sm q-py-xs text-caption text-weight-bold">
                {{ card.tag }}
              </div>
            </div>

            <!-- Middle Row: Number & Skeleton -->
            <div class="metric-body">
              <div class="text-caption metric-subtitle text-weight-medium q-mb-xs">{{ card.title }}</div>

              <template v-if="card.loading">
                <q-skeleton
                  type="text"
                  width="60%"
                  height="48px"
                  class="q-my-xs skeleton-glass" />
              </template>
              <template v-else>
                <div class="metric-number-wrapper row items-baseline">
                  <span class="text-h3 text-weight-bolder metric-value font-mono">{{ card.value ?? 0 }}</span>
                  <span class="text-caption text-weight-medium q-ml-xs metric-unit">{{ card.unit }}</span>
                </div>
              </template>
            </div>

            <!-- Bottom Row: Subtext / Indicator -->
            <div class="metric-footer row items-center justify-between q-mt-md pt-sm border-top-glass">
              <span class="text-caption footer-hint">{{ card.hint }}</span>
              <q-icon
                :name="card.footerIcon"
                size="18px"
                class="footer-action-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Middle Section: Quick Actions & Operational Overview -->
    <div class="row q-col-gutter-lg q-mt-lg">
      <!-- Quick Operations Bar -->
      <div class="col-12 col-lg-8">
        <div class="action-card q-pa-lg rounded-2xl bg-white shadow-card">
          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-subtitle1 text-weight-bolder text-grey-9">عملیات سریع سیستمی</div>
              <div class="text-caption text-grey-6">دسترسی بدون وقفه به فرم‌ها و فرآیندهای پرکاربرد</div>
            </div>
            <q-badge
              color="grey-3"
              text-color="grey-8"
              class="q-px-sm q-py-xs text-weight-bold">
              دسترسی سریع
            </q-badge>
          </div>

          <div class="row q-col-gutter-md q-pt-sm">
            <div
              v-for="(act, aIdx) in quickActions"
              :key="aIdx"
              class="col-6 col-md-3">
              <div
                class="quick-tile flex column items-center justify-center q-pa-md rounded-xl cursor-pointer"
                @click="act.action">
                <div
                  class="tile-icon-box flex flex-center q-mb-sm"
                  :class="`bg-${act.color}-subtle text-${act.color}`">
                  <q-icon
                    :name="act.icon"
                    size="24px" />
                </div>
                <div class="text-caption text-weight-bold text-grey-8 text-center">{{ act.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Health / Status Aside -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CorrespondenceAPI from 'src/repositories/correspondence'
import ReportAPI from 'src/repositories/report'

const router = useRouter()
const reportAPI = new ReportAPI()
const correspondenceAPI = new CorrespondenceAPI()

// State
const pendingTransfersCount = ref<number | null>(null)
const pendingTransfersCountLoading = ref<boolean>(false)

const lockedInventoriesCount = ref<number | null>(null)
const lockedInventoriesCountLoading = ref<boolean>(false)

const pendingAssignmentsCount = ref<number>(0)
const pendingAssignmentsCountLoading = ref<boolean>(false)

const todayInboxCount = ref<number>(0)
const todayInboxCountLoading = ref<boolean>(false)

// Computed Cards Definition for Dynamic UI
const cards = computed(() => [
  {
    title: 'حواله‌های در انتظار بررسی',
    value: pendingTransfersCount.value,
    unit: 'حواله',
    icon: 'hourglass_top',
    tag: 'نیازمند تایید',
    hint: 'مشاهده لیست حواله‌ها',
    footerIcon: 'arrow_forward',
    color: 'amber',
    to: { name: 'Panel.Transfer.Create' },
    loading: pendingTransfersCountLoading.value
  },
  {
    title: 'انبارهای قفل‌شده',
    value: lockedInventoriesCount.value,
    unit: 'انبار',
    icon: 'lock_reset',
    tag: 'بحرانی',
    hint: 'بررسی کنترل موجودی',
    footerIcon: 'security',
    color: 'rose',
    to: { name: 'Panel.Inventory.List' },
    loading: lockedInventoriesCountLoading.value
  },
  {
    title: 'کارتابل‌های ارجاع‌نشده / باز',
    value: pendingAssignmentsCount.value,
    unit: 'ارجاع',
    icon: 'assignment_late',
    tag: 'در گردش',
    hint: 'مدیریت کارتابل اداری',
    footerIcon: 'task_alt',
    color: 'indigo',
    to: { name: 'Panel.Correspondence.Assignments' },
    loading: pendingAssignmentsCountLoading.value
  },
  {
    title: 'نامه‌ها و پیام‌های وارده امروز',
    value: todayInboxCount.value,
    unit: 'پیام',
    icon: 'mark_email_unread',
    tag: 'امروز',
    hint: 'ورود به صندوق ورودی',
    footerIcon: 'inbox',
    color: 'emerald',
    to: { name: 'Panel.Correspondence.Inbox' },
    loading: todayInboxCountLoading.value
  }
])

const isAnyLoading = computed(() => {
  return pendingTransfersCountLoading.value ||
    lockedInventoriesCountLoading.value ||
    pendingAssignmentsCountLoading.value ||
    todayInboxCountLoading.value
})

// Quick Actions config
const quickActions = [
  { label: 'ثبت نامه جدید', icon: 'edit_document', color: 'primary', action: () => router.push({ name: 'Panel.Correspondence.Create' }).catch(() => {}) },
  { label: 'کارتابل جاری', icon: 'all_inbox', color: 'indigo', action: () => router.push({ name: 'Panel.Correspondence.Assignments' }).catch(() => {}) },
  { label: 'مدیریت حواله‌ها', icon: 'sync_alt', color: 'amber', action: () => router.push({ name: 'Panel.Transfer.Create' }).catch(() => {}) },
  { label: 'تولیدات', icon: 'warehouse', color: 'rose', action: () => router.push({ name: 'Panel.Production.List' }).catch(() => {}) }
]

// Helpers & API Calls
function pad2 (value: number): string {
  return String(value).padStart(2, '0')
}

function getTodayRange (): { since: string, till: string } {
  const now = new Date()
  const date = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`
  return {
    since: `${date} 00:00:00`,
    till: `${date} 23:59:59`
  }
}

async function getPendingTransfersCountAll () {
  try {
    pendingTransfersCountLoading.value = true
    pendingTransfersCount.value = await reportAPI.getPendingTransfersCountAll()
  } catch (err) {
    pendingTransfersCount.value = 0
  } finally {
    pendingTransfersCountLoading.value = false
  }
}

async function getLockedInventoriesCount () {
  try {
    lockedInventoriesCountLoading.value = true
    lockedInventoriesCount.value = await reportAPI.getLockedInventoriesCount()
  } catch (err) {
    lockedInventoriesCount.value = 0
  } finally {
    lockedInventoriesCountLoading.value = false
  }
}

async function getPendingAssignmentsCount () {
  try {
    pendingAssignmentsCountLoading.value = true
    const [pending, inProgress] = await Promise.all([
      correspondenceAPI.assignmentsInbox({ status: 'pending', length: 1, page: 1 }),
      correspondenceAPI.assignmentsInbox({ status: 'in_progress', length: 1, page: 1 })
    ])
    pendingAssignmentsCount.value = (pending?.total ?? 0) + (inProgress?.total ?? 0)
  } catch (err) {
    pendingAssignmentsCount.value = 0
  } finally {
    pendingAssignmentsCountLoading.value = false
  }
}

async function getTodayInboxCount () {
  try {
    todayInboxCountLoading.value = true
    const { since, till } = getTodayRange()
    const result = await correspondenceAPI.inbox({
      created_since_date: since,
      created_till_date: till,
      length: 1,
      page: 1
    })
    todayInboxCount.value = result?.total ?? 0
  } catch (err) {
    todayInboxCount.value = 0
  } finally {
    todayInboxCountLoading.value = false
  }
}

function refreshAll () {
  getLockedInventoriesCount()
  getPendingTransfersCountAll()
  getPendingAssignmentsCount()
  getTodayInboxCount()
}

onMounted(() => {
  refreshAll()
})
</script>

<style lang="scss" scoped>
.luxury-dashboard {
  background: #f1f5f9;
  min-height: 100vh;
}

/* Utilities */
.rounded-2xl { border-radius: 20px; }
.rounded-xl { border-radius: 14px; }
.letter-spacing-1 { letter-spacing: 0.5px; }
.font-mono { font-variant-numeric: tabular-nums; font-family: inherit; }
.font-light { font-weight: 300; }
.shadow-card {
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02);
}

/* Hero Banner */
.hero-banner {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 35px -10px rgba(15, 23, 42, 0.35);

  .text-primary-light {
    color: #a5b4fc;
  }

  .hero-backdrop-glow {
    position: absolute;
    top: -50%;
    left: -20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0, 0, 0, 0) 70%);
    pointer-events: none;
  }

  .refresh-btn {
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.25s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.22);
      transform: translateY(-2px);
    }
  }
}

/* Live Pulse Animation */
.live-pulse {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

/* Luxury Metric Cards */
.metric-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);

  &:hover {
    transform: translateY(-6px);
    border-color: transparent;

    .card-ambient-glow {
      opacity: 1;
    }
    .footer-action-icon {
      transform: translateX(-4px);
    }
  }

  .card-ambient-glow {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
  }

  .metric-icon-box {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    transition: transform 0.3s ease;
  }

  &:hover .metric-icon-box {
    transform: scale(1.08);
  }

  .metric-subtitle {
    letter-spacing: 0.2px;
  }

  .metric-value {
    line-height: 1;
  }

  .border-top-glass {
    border-top: 1px dashed rgba(226, 232, 240, 0.8);
  }

  .footer-action-icon {
    transition: transform 0.25s ease;
  }
}

/* Card Themes */
/* 1. Amber (حواله‌ها) */
.theme-amber {
  &:hover {
    box-shadow: 0 20px 30px -10px rgba(245, 158, 11, 0.25);
  }
  .card-ambient-glow {
    background: radial-gradient(circle at 100% 0%, rgba(254, 243, 199, 0.7) 0%, transparent 70%);
  }
  .metric-icon-box {
    background: #fef3c7;
    color: #d97706;
  }
  .status-tag {
    background: #fffbeb;
    color: #b45309;
    border: 1px solid #fde68a;
  }
  .metric-subtitle { color: #78350f; }
  .metric-value { color: #92400e; }
  .metric-unit { color: #d97706; }
  .footer-hint { color: #b45309; }
  .footer-action-icon { color: #d97706; }
}

/* 2. Rose / Red (انبارهای قفل) */
.theme-rose {
  &:hover {
    box-shadow: 0 20px 30px -10px rgba(244, 63, 94, 0.25);
  }
  .card-ambient-glow {
    background: radial-gradient(circle at 100% 0%, rgba(255, 228, 230, 0.7) 0%, transparent 70%);
  }
  .metric-icon-box {
    background: #ffe4e6;
    color: #e11d48;
  }
  .status-tag {
    background: #fff1f2;
    color: #be123c;
    border: 1px solid #fecdd3;
  }
  .metric-subtitle { color: #881337; }
  .metric-value { color: #9f1239; }
  .metric-unit { color: #e11d48; }
  .footer-hint { color: #be123c; }
  .footer-action-icon { color: #e11d48; }
}

/* 3. Indigo (کارتابل‌ها) */
.theme-indigo {
  &:hover {
    box-shadow: 0 20px 30px -10px rgba(99, 102, 241, 0.25);
  }
  .card-ambient-glow {
    background: radial-gradient(circle at 100% 0%, rgba(224, 231, 255, 0.7) 0%, transparent 70%);
  }
  .metric-icon-box {
    background: #e0e7ff;
    color: #4f46e5;
  }
  .status-tag {
    background: #eef2ff;
    color: #3730a3;
    border: 1px solid #c7d2fe;
  }
  .metric-subtitle { color: #312e81; }
  .metric-value { color: #3730a3; }
  .metric-unit { color: #4f46e5; }
  .footer-hint { color: #4338ca; }
  .footer-action-icon { color: #4f46e5; }
}

/* 4. Emerald (پیام‌های وارده) */
.theme-emerald {
  &:hover {
    box-shadow: 0 20px 30px -10px rgba(16, 185, 129, 0.25);
  }
  .card-ambient-glow {
    background: radial-gradient(circle at 100% 0%, rgba(209, 250, 229, 0.7) 0%, transparent 70%);
  }
  .metric-icon-box {
    background: #d1fae5;
    color: #059669;
  }
  .status-tag {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
  }
  .metric-subtitle { color: #064e3b; }
  .metric-value { color: #065f46; }
  .metric-unit { color: #059669; }
  .footer-hint { color: #047857; }
  .footer-action-icon { color: #059669; }
}

/* Quick Actions Tile */
.quick-tile {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.25s ease;

  &:hover {
    background: #ffffff;
    border-color: #cbd5e1;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px -3px rgba(0, 0, 0, 0.06);
  }

  .tile-icon-box {
    width: 44px;
    height: 44px;
    border-radius: 12px;
  }

  .bg-primary-subtle { background: #e0e7ff; }
  .bg-indigo-subtle { background: #ede9fe; }
  .bg-amber-subtle { background: #fef3c7; }
  .bg-rose-subtle { background: #ffe4e6; }
}
</style>
