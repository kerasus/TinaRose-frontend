<template>
  <div class="command-bar bg-white q-px-lg q-py-sm q-mb-md rounded-xl shadow-xs border-subtle row items-center justify-between">
    <div class="row items-center q-gutter-x-md">
      <q-btn
        flat
        round
        dense
        color="grey-8"
        icon="arrow_forward"
        class="back-circle-btn"
        :to="{ name: 'Panel.Correspondence.List' }">
        <q-tooltip>بازگشت به فهرست نامه‌ها</q-tooltip>
      </q-btn>

      <div class="column">
        <div class="row items-center q-gutter-x-sm">
          <span class="id-tag font-mono">#{{ correspondence.id }}</span>
          <span
            v-if="correspondence.reference_number"
            class="ref-tag font-mono">
            شماره: {{ correspondence.reference_number }}
          </span>
          <q-badge
            :color="statusBadgeColor(correspondence.status)"
            rounded
            class="q-px-sm text-weight-bold">
            {{ statusLabel(correspondence.status) }}
          </q-badge>
        </div>
        <div class="subject-title text-weight-bolder text-grey-10 text-ellipsis">
          {{ correspondence.subject }}
        </div>
      </div>
    </div>

    <!-- دکمه‌های اقدام سریع -->
    <div class="row items-center q-gutter-x-sm">
      <q-btn
        v-if="canDelete"
        flat
        color="negative"
        icon="delete"
        label="حذف نامه"
        class="modern-action-btn"
        :loading="deleteLoading"
        @click="$emit('delete')">
        <q-tooltip>این نامه هنوز مشاهده نشده و قابل حذف است</q-tooltip>
      </q-btn>

      <q-btn
        v-if="canSend"
        unelevated
        color="primary"
        icon="send"
        label="ارسال نهایی نامه"
        class="modern-action-btn primary-glow"
        :loading="actionLoading"
        @click="$emit('send')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Correspondence } from 'src/repositories/correspondence'
import { getCorrespondenceStatusLabel } from 'src/repositories/correspondence'

withDefaults(defineProps<{
  correspondence: Correspondence
  canSend?: boolean
  canDelete?: boolean
  actionLoading?: boolean
  deleteLoading?: boolean
}>(), {
  canSend: false,
  canDelete: false,
  actionLoading: false,
  deleteLoading: false
})

defineEmits<{
  send: []
  delete: []
}>()

function statusLabel (v: any) { return getCorrespondenceStatusLabel(v) }

function statusBadgeColor (status: string | undefined) {
  switch (status) {
    case 'sent': return 'positive'
    case 'draft': return 'amber-9'
    case 'archived': return 'grey-7'
    default: return 'primary'
  }
}
</script>

<style scoped lang="scss">
.command-bar {
  border: 1px solid #edf2f7;

  .back-circle-btn {
    background: #f7fafc;
    transition: background 0.2s ease;
    &:hover {
      background: #edf2f7;
    }
  }

  .id-tag {
    background: #ebf8ff;
    color: #3182ce;
    padding: 2px 6px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .ref-tag {
    background: #f7fafc;
    color: #718096;
    padding: 2px 6px;
    border-radius: 6px;
    font-size: 0.75rem;
  }

  .subject-title {
    font-size: 1.1rem;
    line-height: 1.4;
    max-width: 600px;
  }
}

.font-mono {
  font-family: inherit;
  font-variant-numeric: tabular-nums;
}

.rounded-xl {
  border-radius: 14px;
}

.modern-action-btn {
  border-radius: 8px;
  font-weight: 700;
  transition: transform 0.15s ease;
  &:active {
    transform: scale(0.98);
  }
}

.primary-glow {
  box-shadow: 0 4px 14px rgba(25, 118, 210, 0.3);
}
</style>