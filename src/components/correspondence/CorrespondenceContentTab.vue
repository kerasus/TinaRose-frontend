<template>
  <div class="document-sheet">
    <!-- سربرگ شکیل نامه -->
    <div class="doc-header row items-start justify-between q-pb-lg border-bottom-dashed">
      <div class="column q-gutter-y-xs">
        <div class="row items-center q-gutter-x-xs text-primary text-weight-bold text-caption">
          <q-icon
            name="corporate_fare"
            size="18px" />
          <span>سامانه جامع مکاتبات تینارز</span>
        </div>
        <h2 class="doc-title text-h6 text-weight-bolder text-grey-10 q-my-none">
          {{ correspondence.subject }}
        </h2>
      </div>

      <!-- تمبر شماره و تاریخ نامه -->
      <div class="meta-stamp-box bg-grey-1 q-pa-sm rounded-borders column items-end font-mono">
        <div class="row items-center text-caption">
          <span class="text-grey-6 q-mr-xs">شماره ثبت:</span>
          <span class="text-weight-bold text-primary">{{ correspondence.reference_number || 'پیش‌نویس فاقد شماره' }}</span>
        </div>
        <div class="row items-center text-caption">
          <span class="text-grey-6 q-mr-xs">تاریخ ایجاد:</span>
          <span class="text-grey-8">{{ fmt(correspondence.created_at) }}</span>
        </div>
        <div
          v-if="correspondence.sent_at"
          class="row items-center text-caption">
          <span class="text-grey-6 q-mr-xs">تاریخ ارسال:</span>
          <span class="text-positive text-weight-bold">{{ fmt(correspondence.sent_at) }}</span>
        </div>
      </div>
    </div>

    <!-- بج‌های طبقه‌بندی -->
    <div class="doc-pills-row row items-center q-gutter-sm q-py-md">
      <div
        class="pill-chip"
        :class="`pill-${correspondence.confidentiality}`">
        <q-icon
          name="lock"
          size="13px"
          class="q-mr-xs" />
        {{ confidentialityLabel(correspondence.confidentiality) }}
      </div>
      <div
        class="pill-chip"
        :class="`pill-${correspondence.priority}`">
        <q-icon
          name="bolt"
          size="13px"
          class="q-mr-xs" />
        اولویت: {{ priorityLabel(correspondence.priority) }}
      </div>
    </div>

    <!-- متن نامه -->
    <div class="doc-body-text text-body1 text-grey-9 q-py-lg">
      {{ correspondence.body || 'فاقد متن اداری.' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Correspondence } from 'src/repositories/correspondence'
import {
  getCorrespondenceConfidentialityLabel,
  getCorrespondencePriorityLabel
} from 'src/repositories/correspondence'
import { formatDateTime as fmt } from './correspondenceUtils'

defineProps<{
  correspondence: Correspondence
}>()

function priorityLabel (v: any) { return getCorrespondencePriorityLabel(v) }
function confidentialityLabel (v: any) { return getCorrespondenceConfidentialityLabel(v) }
</script>

<style scoped lang="scss">
.document-sheet {
  .doc-title {
    line-height: 1.6;
  }

  .meta-stamp-box {
    border: 1px solid #e2e8f0;
    min-width: 200px;
    gap: 2px;
  }

  .doc-pills-row {
    border-bottom: 1px solid #edf2f7;
  }

  .pill-chip {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;

    &.pill-confidential { background: #fffaf0; color: #dd6b20; border: 1px solid #feebc8; }
    &.pill-strictly_confidential { background: #fff5f5; color: #e53e3e; border: 1px solid #fed7d7; }
    &.pill-urgent { background: #fffaf0; color: #dd6b20; }
    &.pill-immediate { background: #fff5f5; color: #e53e3e; }
    &:not([class*="pill-confidential"]):not([class*="pill-urgent"]):not([class*="pill-immediate"]) {
      background: #f7fafc;
      color: #4a5568;
    }
  }

  .doc-body-text {
    white-space: pre-wrap;
    line-height: 2.2;
    font-size: 1.05rem;
    word-break: break-word;
    min-height: 160px;
  }
}

.font-mono {
  font-family: inherit;
  font-variant-numeric: tabular-nums;
}
</style>