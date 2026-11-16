<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CorrespondenceAPI from 'src/repositories/correspondence'

const router = useRouter()
const api = new CorrespondenceAPI()

const pendingAssignments = ref(0)
const todayInbox = ref(0)
const loading = ref(false)

const totalNotifications = computed(
  () => pendingAssignments.value + todayInbox.value
)

const displayedTotal = computed(() =>
  totalNotifications.value > 99 ? '99+' : totalNotifications.value
)

async function fetchCounts () {
  loading.value = true

  try {
    const [assignments, inbox] = await Promise.all([
      api.assignmentsInbox({
        status: 'pending',
        unread: 1,
        length: 1,
        page: 1
      }),
      api.inbox({
        unread: 1,
        length: 1,
        page: 1
      })
    ])

    pendingAssignments.value = assignments?.total ?? 0
    todayInbox.value = inbox?.total ?? 0
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
  } finally {
    loading.value = false
  }
}

function goToAssignments () {
  router.push({ name: 'Panel.Correspondence.Assignments' })
}

function goToInbox () {
  router.push({ name: 'Panel.Correspondence.Inbox' })
}

onMounted(() => {
  fetchCounts()
})
</script>

<template>
  <q-btn
    round
    flat
    class="notification-trigger"
    :class="{ 'notification-trigger--active': totalNotifications > 0 }"
    aria-label="اعلان‌های خوانده‌نشده">
    <span class="notification-trigger__icon-wrap">
      <q-icon
        name="notifications"
        class="notification-trigger__icon"
        size="21px" />
    </span>

    <q-badge
      v-if="totalNotifications > 0"
      floating
      rounded
      class="notification-trigger__badge">
      {{ displayedTotal }}
    </q-badge>

    <q-tooltip
      anchor="bottom middle"
      self="top middle">
      اعلان‌های خوانده‌نشده
    </q-tooltip>

    <q-menu
      anchor="bottom left"
      self="top left"
      :offset="[0, 12]"
      transition-show="jump-down"
      transition-hide="jump-up"
      class="notification-menu">
      <div
        class="notification-panel"
        dir="rtl">
        <!-- Header -->
        <div class="notification-panel__header">
          <div class="notification-panel__header-content">
            <div class="notification-panel__header-icon">
              <q-icon
                name="notifications_active"
                size="21px" />
            </div>

            <div>
              <div class="notification-panel__title">اعلان‌ها</div>
              <div class="notification-panel__subtitle">
                موارد خوانده‌نشده‌ی شما
              </div>
            </div>
          </div>

          <div class="notification-panel__header-actions">
            <span
              v-if="totalNotifications > 0"
              class="notification-panel__total">
              {{ displayedTotal }}
            </span>

            <q-btn
              round
              flat
              dense
              class="notification-panel__refresh"
              aria-label="به‌روزرسانی اعلان‌ها"
              :loading="loading"
              @click.stop="fetchCounts">
              <q-icon
                name="refresh"
                size="18px" />
              <q-tooltip>به‌روزرسانی</q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Loading -->
        <div
          v-if="loading && totalNotifications === 0"
          class="notification-panel__loading">
          <q-spinner-dots
            size="28px"
            color="primary" />
          <span>در حال بررسی اعلان‌ها...</span>
        </div>

        <!-- Notification items -->
        <div
          v-else-if="totalNotifications > 0"
          class="notification-panel__items">
          <button
            v-if="pendingAssignments > 0"
            type="button"
            class="notification-item notification-item--assignment"
            @click="goToAssignments">
            <span class="notification-item__icon">
              <q-icon
                name="assignment_late"
                size="21px" />
            </span>

            <span class="notification-item__content">
              <span class="notification-item__title">ارجاع‌های خوانده‌نشده</span>
              <span class="notification-item__description">
                برای مشاهده‌ی جزئیات وارد کارتابل شوید
              </span>
            </span>

            <span class="notification-item__count">
              {{ pendingAssignments > 99 ? '99+' : pendingAssignments }}
            </span>

            <q-icon
              name="chevron_left"
              class="notification-item__arrow"
              size="19px" />
          </button>

          <button
            v-if="todayInbox > 0"
            type="button"
            class="notification-item notification-item--inbox"
            @click="goToInbox">
            <span class="notification-item__icon">
              <q-icon
                name="mark_email_unread"
                size="21px" />
            </span>

            <span class="notification-item__content">
              <span class="notification-item__title">پیام‌های خوانده‌نشده</span>
              <span class="notification-item__description">
                برای مشاهده‌ی پیام‌ها وارد صندوق ورودی شوید
              </span>
            </span>

            <span class="notification-item__count">
              {{ todayInbox > 99 ? '99+' : todayInbox }}
            </span>

            <q-icon
              name="chevron_left"
              class="notification-item__arrow"
              size="19px" />
          </button>
        </div>

        <!-- Empty state -->
        <div
          v-else
          class="notification-empty">
          <div class="notification-empty__icon">
            <q-icon
              name="task_alt"
              size="30px" />
          </div>

          <div class="notification-empty__title">همه‌چیز مرتب است!</div>
          <div class="notification-empty__description">
            فعلاً اعلان خوانده‌نشده‌ای نداری.
          </div>
        </div>

        <!-- Footer -->
        <div class="notification-panel__footer">
          <span class="notification-panel__footer-dot" />
          اعلان‌ها با اطلاعات کارتابل شما به‌روز می‌شوند
        </div>
      </div>
    </q-menu>
  </q-btn>
</template>

<style scoped lang="scss">
.notification-trigger {
  position: relative;
  width: 42px;
  min-width: 42px;
  height: 42px;
  padding: 0;
  overflow: visible;
  color: #6b72a4;
  background: rgba(242, 240, 255, 0.9);
  border: 1px solid rgba(143, 132, 221, 0.12);
  transition:
    transform 0.22s ease,
    background-color 0.22s ease,
    box-shadow 0.22s ease;

  &:hover {
    color: #6958c8;
    background: #efedff;
    box-shadow: 0 6px 16px rgba(105, 88, 200, 0.14);
    transform: translateY(-2px);
  }

  &__icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  &__icon {
    transform-origin: 50% 10%;
  }

  &--active .notification-trigger__icon {
    animation: bell-ring 2.8s ease-in-out infinite;
  }

  &__badge {
    top: -4px;
    right: -5px;
    min-width: 19px;
    min-height: 19px;
    padding: 2px 5px;
    color: #fff;
    background: linear-gradient(135deg, #ff7695, #ee4776);
    border: 2px solid #fff;
    box-shadow: 0 3px 8px rgba(238, 71, 118, 0.28);
    font-size: 10px;
    font-weight: 750;
    line-height: 1;
  }
}

@keyframes bell-ring {
  0%,
  76%,
  100% {
    transform: rotate(0);
  }

  80% {
    transform: rotate(13deg);
  }

  84% {
    transform: rotate(-11deg);
  }

  88% {
    transform: rotate(8deg);
  }

  92% {
    transform: rotate(-5deg);
  }
}

.notification-panel {
  width: 360px;
  max-width: calc(100vw - 24px);
  overflow: hidden;
  color: #38415b;
  background: #fff;
  border: 1px solid #ececf5;
  border-radius: 22px;
  box-shadow: 0 18px 50px rgba(43, 45, 84, 0.17);

  &__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 88px;
    padding: 16px 18px;
    overflow: hidden;
    background: linear-gradient(120deg, #eef7ff 0%, #f0edff 53%, #fff0f7 100%);

    &::after {
      position: absolute;
      right: 55%;
      bottom: -66px;
      width: 150px;
      height: 110px;
      background: rgba(183, 166, 244, 0.22);
      border-radius: 50%;
      content: '';
      filter: blur(16px);
      pointer-events: none;
    }
  }

  &__header-content,
  &__header-actions {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
  }

  &__header-content {
    gap: 11px;
  }

  &__header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    color: #7668c8;
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    box-shadow: 0 5px 14px rgba(94, 84, 164, 0.1);
  }

  &__title {
    color: #343451;
    font-size: 0.98rem;
    font-weight: 800;
  }

  &__subtitle {
    margin-top: 3px;
    color: #85869c;
    font-size: 0.72rem;
  }

  &__header-actions {
    gap: 7px;
  }

  &__total {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 27px;
    height: 27px;
    padding: 0 7px;
    color: #fff;
    background: linear-gradient(135deg, #9081e8, #7162d0);
    border-radius: 999px;
    box-shadow: 0 4px 10px rgba(113, 98, 208, 0.22);
    font-size: 0.72rem;
    font-weight: 750;
  }

  &__refresh {
    color: #7165b9;
    background: rgba(255, 255, 255, 0.68);
    transition:
      color 0.2s ease,
      background-color 0.2s ease,
      transform 0.2s ease;

    &:hover {
      color: #5142ac;
      background: #fff;
      transform: rotate(25deg);
    }
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding: 14px;
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    min-height: 120px;
    color: #85869c;
    font-size: 0.82rem;
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: 7px;
    min-height: 39px;
    padding: 0 16px;
    color: #9294a8;
    background: #fbfbfe;
    border-top: 1px solid #f1f1f7;
    font-size: 0.68rem;
  }

  &__footer-dot {
    width: 7px;
    height: 7px;
    background: #6cc9a1;
    border-radius: 50%;
    box-shadow: 0 0 0 3px rgba(108, 201, 161, 0.13);
  }
}

.notification-item {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 76px;
  padding: 11px 10px;
  color: inherit;
  text-align: right;
  background: #fff;
  border: 1px solid #f0f0f6;
  border-radius: 16px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    background: #fcfbff;
    border-color: #e5e1fa;
    box-shadow: 0 6px 15px rgba(60, 57, 105, 0.07);
    transform: translateY(-2px);

    .notification-item__arrow {
      transform: translateX(-3px);
    }
  }

  &__icon {
    display: inline-flex;
    flex: 0 0 42px;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    margin-left: 10px;
    border-radius: 14px;
  }

  &__content {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: 5px;
    min-width: 0;
  }

  &__title {
    color: #3d4359;
    font-size: 0.8rem;
    font-weight: 750;
  }

  &__description {
    overflow: hidden;
    color: #9395a8;
    font-size: 0.68rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__count {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    min-width: 27px;
    height: 27px;
    margin-right: 7px;
    padding: 0 7px;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 750;
  }

  &__arrow {
    flex: 0 0 auto;
    margin-right: 2px;
    color: #a4a5b5;
    transition: transform 0.2s ease;
  }

  &--assignment {
    .notification-item__icon {
      color: #7565ce;
      background: #f0edff;
    }

    .notification-item__count {
      color: #6859bd;
      background: #f0edff;
    }
  }

  &--inbox {
    .notification-item__icon {
      color: #3a9a88;
      background: #e8f8f3;
    }

    .notification-item__count {
      color: #318774;
      background: #e8f8f3;
    }
  }
}

.notification-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 26px;
  text-align: center;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: 58px;
    margin-bottom: 11px;
    color: #49aa83;
    background: linear-gradient(145deg, #e8faf2, #f0edff);
    border: 1px solid #edf4f2;
    border-radius: 20px;
  }

  &__title {
    color: #45485d;
    font-size: 0.87rem;
    font-weight: 750;
  }

  &__description {
    margin-top: 5px;
    color: #9899aa;
    font-size: 0.73rem;
  }
}

:global(.q-menu.notification-menu) {
  overflow: visible;
  background: transparent;
  box-shadow: none;
}

@media (max-width: 480px) {
  .notification-panel {
    width: min(360px, calc(100vw - 20px));
  }
}

@media (prefers-reduced-motion: reduce) {
  .notification-trigger--active .notification-trigger__icon {
    animation: none;
  }

  .notification-item,
  .notification-trigger,
  .notification-item__arrow {
    transition: none;
  }
}
</style>
