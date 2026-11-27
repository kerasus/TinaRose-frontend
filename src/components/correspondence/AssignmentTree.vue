<template>
  <div
    v-if="!rootAssignments.length"
    class="text-center q-pa-lg text-grey-5">
    <q-icon
      name="device_hub"
      size="48px" />
    <div class="text-subtitle2 q-mt-xs">هنوز هیچ ارجاعی برای این نامه ثبت نشده است.</div>
  </div>

  <div
    v-else
    class="workflow-tree-flow column q-gutter-y-lg">
    <div
      v-for="root in rootAssignments"
      :key="root.id"
      class="workflow-node-card q-mb-md">
      <assignment-item
        :assignment="root"
        :all-assignments="assignments"
        :current-user-id="currentUserId"
        :action-loading="actionLoading"
        @start="$emit('start', $event)"
        @resolve="onResolve"
        @child="$emit('child', $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CorrespondenceAssignment } from 'src/repositories/correspondence'
import AssignmentItem from './AssignmentItem.vue'

const props = withDefaults(defineProps<{
  assignments: CorrespondenceAssignment[]
  currentUserId?: number | null
  actionLoading?: boolean
}>(), {
  currentUserId: null,
  actionLoading: false
})

const emit = defineEmits<{
  start: [assignment: CorrespondenceAssignment]
  resolve: [assignment: CorrespondenceAssignment, mode: 'complete' | 'reject']
  child: [assignment: CorrespondenceAssignment]
}>()

const rootAssignments = computed(() => props.assignments.filter((a) => !a.parent_assignment_id))

function onResolve (assignment: CorrespondenceAssignment, mode: 'complete' | 'reject') {
  emit('resolve', assignment, mode)
}
</script>