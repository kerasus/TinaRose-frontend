<template>
  <div
    v-if="events.length"
    class="side-card bg-white q-pa-md rounded-xl shadow-xs border-subtle">
    <div class="card-head-title row items-center q-gutter-x-xs text-grey-7 q-mb-md">
      <q-icon
        name="history"
        size="18px"
        color="primary" />
      <span class="text-caption text-weight-bold">گاه‌شمار رویدادها</span>
    </div>

    <q-timeline
      dense
      color="primary"
      class="compact-timeline">
      <q-timeline-entry
        v-for="ev in events"
        :key="ev.id"
        :title="eventTypeLabel(ev.event_type)"
        :subtitle="fmt(ev.created_at)"
        :icon="eventIcon(ev.event_type)"
        size="sm">
        <div class="text-caption text-grey-8">
          توسط: <strong class="text-grey-9">{{ userLabel(ev.actor, ev.actor_id) }}</strong>
          <span
            v-if="ev.assignment_id"
            class="text-weight-bold text-primary font-mono"> (ارجاع #{{ ev.assignment_id }})</span>
        </div>
        <div
          v-if="ev.event_type === 'assigned' && eventAssigneeId(ev)"
          class="text-caption text-grey-8 q-mt-xs">
          <q-icon
            name="arrow_forward"
            size="14px"
            class="q-mr-xs"
            color="primary" />
          {{ ev.metadata?.recipient_added ? 'گیرنده اضافه شد:' : (ev.metadata?.root ? 'ارجاع اصلی:' : 'ارجاع به:') }}
          <strong class="text-grey-9">{{ eventUserName(ev) }}</strong>
          <span v-if="ev.metadata?.type === 'cc'"> (رونوشت)</span>
          <span v-if="ev.metadata?.due_at"> — مهلت: {{ fmt(ev.metadata.due_at) }}</span>
        </div>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import UserAPI from 'src/repositories/user'
import {
  getCorrespondenceEventTypeLabel,
  type CorrespondenceEvent,
  type CorrespondenceUser
} from 'src/repositories/correspondence'
import { formatDateTime as fmt, userLabel } from './correspondenceUtils'

const props = withDefaults(defineProps<{
  events: CorrespondenceEvent[]
}>(), {
  events: () => []
})

const userAPI = new UserAPI()
const eventUsers = ref<Record<number, CorrespondenceUser>>({})

function eventTypeLabel (v: any) { return getCorrespondenceEventTypeLabel(v) }

function eventIcon (type: string | undefined) {
  switch (type?.toLowerCase()) {
    case 'sent': return 'send'
    case 'read': return 'visibility'
    case 'assigned': return 'forward_to_inbox'
    case 'completed': return 'check_circle'
    case 'rejected': return 'cancel'
    default: return 'radio_button_checked'
  }
}

function eventAssigneeId (ev: CorrespondenceEvent): number | null {
  const raw = ev.metadata?.user_id ?? ev.metadata?.assigned_to_id
  const id = Number(raw)
  return Number.isFinite(id) && id > 0 ? id : null
}

function eventUserName (ev: CorrespondenceEvent): string {
  const userId = eventAssigneeId(ev)
  if (!userId) return '-'
  return userLabel(eventUsers.value[userId], userId)
}

async function loadEventUsers () {
  const ids = Array.from(new Set(
    props.events
      .filter((ev) => ev.event_type === 'assigned')
      .map((ev) => eventAssigneeId(ev))
      .filter((id): id is number => !!id && !eventUsers.value[id])
  ))

  await Promise.all(ids.map(async (id) => {
    try {
      eventUsers.value[id] = await userAPI.getBasic(id)
    } catch {
      // در صورت خطا، فقط شناسه نمایش داده می‌شود
    }
  }))
}

watch(() => props.events, loadEventUsers, { immediate: true })
</script>

<style scoped lang="scss">
.side-card {
  border: 1px solid #edf2f7;

  .card-head-title {
    border-bottom: 1px solid #edf2f7;
    padding-bottom: 6px;
  }
}

.font-mono {
  font-family: inherit;
  font-variant-numeric: tabular-nums;
}

.rounded-xl {
  border-radius: 14px;
}

/* تایم‌لاین فشرده سایدبار */
.compact-timeline {
  padding-left: 0;
  padding-right: 0;

  :deep(.q-timeline__entry) {
    padding-bottom: 10px !important;
    &:last-child { padding-bottom: 0 !important; }
  }

  :deep(.q-timeline__dot) {
    top: 2px !important;
    width: 31px !important;
    min-width: 31px !important;
    &:after {
      top: 22px !important;
      opacity: 0.3;
    }
    .q-icon { font-size: 13px !important; }
  }

  :deep(.q-timeline__title) {
    font-size: 0.82rem !important;
    font-weight: 700 !important;
    margin-bottom: 2px !important;
  }

  :deep(.q-timeline__subtitle) {
    font-size: 0.7rem !important;
    margin-bottom: 2px !important;
    opacity: 0.7;
  }

  :deep(.q-timeline__content) {
    padding-bottom: 0 !important;
  }
}
</style>