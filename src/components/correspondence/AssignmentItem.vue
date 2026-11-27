<template>
  <div class="assignment-node">
    <div :class="['assignment-card', `status-${assignment.status}`, { 'child-card': depth > 0 }]">
      <!-- هدر ارجاع: اطلاعات و نشانگر وضعیت -->
      <div class="row items-center justify-between q-pb-sm border-b-subtle">
        <div class="row items-center q-gutter-x-sm">
          <div
            class="status-indicator-dot"
            :class="`bg-${assignmentBadgeColor(assignment.status)}`" />
          <span class="text-subtitle2 text-weight-bolder text-grey-9 font-mono">
            {{ depth > 0 ? 'ارجاع فرزند' : 'ارجاع' }} #{{ assignment.id }}
          </span>
          <span class="text-caption text-grey-6">
            (از طرف: <span class="text-weight-medium text-grey-8">{{ userLabel(assignment.assigned_by, assignment.assigned_by_id) }}</span>)
          </span>
        </div>

        <q-badge
          :color="assignmentBadgeColor(assignment.status)"
          :outline="depth > 0"
          rounded
          class="q-px-sm q-py-xs text-weight-bold">
          {{ assignmentStatusLabel(assignment.status) }}
        </q-badge>
      </div>

      <!-- بدنه ارجاع: مسئول و پاراف -->
      <div class="q-py-sm">
        <div class="row items-center text-body2 q-mb-xs">
          <span class="text-grey-7 q-mr-xs">مسئول اقدام:</span>
          <strong class="text-primary">
            {{ userLabel(assignment.assigned_to, assignment.assigned_to_id) }}
          </strong>
          <q-badge
            color="info"
            rounded
            class="q-px-sm q-py-xs text-weight-bold q-ml-sm">
            {{ getFirstUserRoleLabel(assignment.assigned_to) }}
          </q-badge>
        </div>

        <div
          v-if="assignment.note"
          :class="['paraph-banner row items-start q-pa-sm rounded-borders q-mt-xs', { 'paraph-child': depth > 0 }]">
          <q-icon
            :name="depth > 0 ? 'chat' : 'format_quote'"
            :size="depth > 0 ? '14px' : '18px'"
            :color="depth > 0 ? 'secondary' : 'primary'"
            class="q-mr-xs" />
          <div class="col text-caption text-grey-9 leading-relaxed">
            <strong class="text-grey-8">{{ depth > 0 ? 'دستور:' : 'دستور اقدام:' }}</strong> {{ assignment.note }}
          </div>
        </div>
      </div>

      <!-- متادیتای مدرن (assignment-meta-v2 بازطراحی شده) -->
      <div :class="['assignment-meta-v2 q-mt-xs q-pa-sm rounded-borders', { 'meta-child': depth > 0 }]">
        <div class="row q-col-gutter-xs">
          <div class="col-12 col-sm-6 col-md-4">
            <div class="meta-item">
              <q-icon
                v-if="depth === 0"
                name="event"
                size="15px"
                class="meta-icon" />
              <span class="meta-title">ایجاد:</span>
              <span class="meta-val font-mono">{{ fmt(assignment.created_at) }}</span>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <div class="meta-item">
              <q-icon
                v-if="depth === 0"
                name="update"
                size="15px"
                class="meta-icon" />
              <span class="meta-title">بروزرسانی:</span>
              <span class="meta-val font-mono">{{ fmt(assignment.updated_at) }}</span>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <div
              class="meta-item"
              :class="{ 'highlight-alert': assignment.due_at }">
              <q-icon
                v-if="depth === 0"
                name="alarm"
                size="15px"
                class="meta-icon" />
              <span class="meta-title">مهلت:</span>
              <span class="meta-val font-mono">{{ fmt(assignment.due_at) }}</span>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <div class="meta-item">
              <q-icon
                v-if="depth === 0"
                name="visibility"
                size="15px"
                class="meta-icon" />
              <span class="meta-title">مطالعه:</span>
              <span class="meta-val font-mono">{{ fmt(assignment.read_at) }}</span>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <div class="meta-item">
              <q-icon
                v-if="depth === 0"
                name="play_circle_outline"
                size="15px"
                class="meta-icon" />
              <span class="meta-title">شروع:</span>
              <span class="meta-val font-mono">{{ fmt(assignment.started_at) }}</span>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <div
              class="meta-item"
              :class="{ 'highlight-success': assignment.resolved_at }">
              <q-icon
                v-if="depth === 0"
                name="check_circle_outline"
                size="15px"
                class="meta-icon" />
              <span class="meta-title">نتیجه / بستن:</span>
              <span class="meta-val font-mono">{{ fmt(assignment.resolved_at) }}</span>
            </div>
          </div>

          <!-- یادداشت نتیجه به صورت کارت پیام برجسته -->
          <div
            v-if="assignment.resolution_note"
            class="col-12 q-mt-xs">
            <div class="resolution-note-box row items-start q-pa-xs-sm rounded-borders">
              <q-icon
                :name="depth > 0 ? 'check_circle' : 'task_alt'"
                :size="depth > 0 ? '14px' : '16px'"
                color="positive"
                class="q-mr-xs q-mt-xs" />
              <div class="col text-caption">
                <span class="text-weight-bold text-grey-8">یادداشت نتیجه:</span>
                <span class="text-grey-9 q-ml-xs">{{ assignment.resolution_note }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- نوار عملیات (Action Buttons) -->
      <div
        v-if="isMine && (assignment.status === 'pending' || assignment.status === 'in_progress')"
        class="row items-center justify-end q-gutter-xs q-mt-sm q-pt-xs border-t-subtle">
        <q-btn
          v-if="assignment.status === 'pending'"
          dense
          unelevated
          :size="depth > 0 ? 'xs' : 'sm'"
          color="primary"
          icon="play_arrow"
          :label="depth > 0 ? 'شروع' : 'شروع اقدام'"
          class="modern-btn q-px-sm"
          :loading="actionLoading"
          @click="$emit('start', assignment)" />
        <q-btn
          v-if="assignment.status === 'in_progress'"
          dense
          unelevated
          :size="depth > 0 ? 'xs' : 'sm'"
          color="positive"
          icon="check"
          label="تکمیل"
          class="modern-btn q-px-sm"
          :loading="actionLoading"
          @click="$emit('resolve', assignment, 'complete')" />
        <q-btn
          dense
          unelevated
          :size="depth > 0 ? 'xs' : 'sm'"
          color="negative"
          icon="close"
          label="رد"
          class="modern-btn q-px-sm"
          :loading="actionLoading"
          @click="$emit('resolve', assignment, 'reject')" />
        <q-btn
          dense
          outline
          :size="depth > 0 ? 'xs' : 'sm'"
          color="secondary"
          icon="subdirectory_arrow_left"
          :label="depth > 0 ? 'ارجاع بعدی' : 'ارجاع فرزند'"
          class="modern-btn q-px-sm"
          @click="$emit('child', assignment)" />
      </div>
    </div>

    <!-- شاخه‌های فرزند (Nested Children) - رندر بازگشتی تا بی‌نهایت سطح -->
    <div
      v-if="children.length"
      class="assignment-children-tree q-mt-xs">
      <div
        v-for="child in children"
        :key="child.id"
        class="child-node-item">
        <AssignmentItem
          :assignment="child"
          :all-assignments="allAssignments"
          :current-user-id="currentUserId"
          :action-loading="actionLoading"
          :depth="depth + 1"
          @start="$emit('start', $event)"
          @resolve="onChildResolve"
          @child="$emit('child', $event)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getFirstUserRoleLabel } from 'src/repositories/user'
import type { CorrespondenceAssignment } from 'src/repositories/correspondence'
import {
  assignmentBadgeColor,
  assignmentStatusLabel,
  childrenOf,
  formatDateTime as fmt,
  isMyAssignment,
  userLabel
} from './correspondenceUtils'

const props = withDefaults(defineProps<{
  assignment: CorrespondenceAssignment
  allAssignments: CorrespondenceAssignment[]
  currentUserId?: number | null
  actionLoading?: boolean
  depth?: number
}>(), {
  currentUserId: null,
  actionLoading: false,
  depth: 0
})

const emit = defineEmits<{
  start: [assignment: CorrespondenceAssignment]
  resolve: [assignment: CorrespondenceAssignment, mode: 'complete' | 'reject']
  child: [assignment: CorrespondenceAssignment]
}>()

const children = computed(() => childrenOf(props.allAssignments, props.assignment.id))
const isMine = computed(() => isMyAssignment(props.assignment, props.currentUserId))

function onChildResolve (assignment: CorrespondenceAssignment, mode: 'complete' | 'reject') {
  emit('resolve', assignment, mode)
}
</script>

<style scoped lang="scss">
.assignment-node {
  .border-b-subtle {
    border-bottom: 1px solid #f1f5f9;
  }

  .border-t-subtle {
    border-top: 1px solid #f1f5f9;
  }

  .font-mono {
    font-family: inherit;
    font-variant-numeric: tabular-nums;
    direction: ltr;
    display: inline-block;
  }

  .leading-relaxed {
    line-height: 1.8;
  }

  .modern-btn {
    border-radius: 6px;
    font-weight: 600;
  }
}

/* کارت اصلی ارجاع */
.assignment-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  border-inline-start: 4px solid #94a3b8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &.status-completed {
    border-inline-start-color: #10b981;
  }
  &.status-rejected {
    border-inline-start-color: #ef4444;
  }
  &.status-in_progress {
    border-inline-start-color: #3b82f6;
  }
  &.status-pending {
    border-inline-start-color: #f59e0b;
  }

  .status-indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .paraph-banner {
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    border-inline-start: 3px solid #3b82f6;
    &.paraph-child {
      border-inline-start-color: #8b5cf6;
      background: #faf5ff;
    }
  }

  &.child-card {
    background: #fafafa;
    border-inline-start-width: 3px;
    border-inline-start-color: #8b5cf6;
    padding: 10px 14px;
    border-radius: 10px;
  }
}

/* ساختار درختی فرزندان - بدون باگ در RTL */
.assignment-children-tree {
  margin-inline-start: 24px;
  border-inline-start: 2px dashed #cbd5e1;
  padding-inline-start: 16px;
  padding-top: 6px;

  .child-node-item {
    position: relative;
    margin-bottom: 8px;

    &::before {
      content: '';
      position: absolute;
      top: 18px;
      inset-inline-start: -16px;
      width: 14px;
      height: 2px;
      border-top: 2px dashed #cbd5e1;
    }
  }
}

/* بازطراحی هوشمند جعبه متادیتا (assignment-meta-v2) */
.assignment-meta-v2 {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;

  &.meta-child {
    background: #ffffff;
    border-color: #e5e7eb;
  }

  .meta-item {
    display: flex;
    align-items: center;
    background: #ffffff;
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid #edf2f7;
    min-height: 32px;
    font-size: 0.78rem;

    .meta-icon {
      color: #94a3b8;
      margin-inline-end: 4px;
    }

    .meta-title {
      color: #64748b;
      font-weight: 500;
      margin-inline-end: 4px;
      white-space: nowrap;
    }

    .meta-val {
      color: #1e293b;
      font-weight: 600;
      margin-inline-start: auto;
    }

    &.highlight-alert {
      background: #fffbeb;
      border-color: #fef3c7;
      .meta-icon { color: #d97706; }
      .meta-title { color: #b45309; }
      .meta-val { color: #b45309; }
    }

    &.highlight-success {
      background: #f0fdf4;
      border-color: #dcfce7;
      .meta-icon { color: #16a34a; }
      .meta-title { color: #15803d; }
      .meta-val { color: #15803d; }
    }
  }

  .resolution-note-box {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    line-height: 1.6;
    color: #166534;
  }
}
</style>