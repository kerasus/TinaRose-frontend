<template>
  <div class="side-card bg-white q-pa-md rounded-xl shadow-xs border-subtle">
    <div class="card-head-title row items-center q-gutter-x-xs text-grey-7 q-mb-sm">
      <q-icon
        name="person"
        size="18px"
        color="primary" />
      <span class="text-caption text-weight-bold">ثبت‌کننده نامه</span>
    </div>
    <div class="row items-center q-gutter-x-md">
      <q-avatar
        size="44px"
        color="indigo-1"
        text-color="primary"
        class="font-mono text-weight-bold">
        {{ userInitial(correspondence.sender) }}
      </q-avatar>
      <div class="column">
        <div class="text-subtitle2 text-weight-bolder text-grey-9">{{ senderLabel(correspondence) }}</div>
        <div class="text-caption text-grey-6 font-mono">{{ correspondence.sender?.email || correspondence.sender?.username || '—' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Correspondence } from 'src/repositories/correspondence'
import { userInitial, userLabel } from './correspondenceUtils'

defineProps<{
  correspondence: Correspondence
}>()

function senderLabel (c: Correspondence) {
  return userLabel(c.sender, c.sender_id)
}
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
</style>