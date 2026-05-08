<template>
  <entity-create
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :show-expand-button="false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import getInputs from './inputs'
import { EntityCreate } from 'quasar-crud'
import DowntimeReasonAPI from 'src/repositories/downtimeReason'

const downtimeReasonAPI = new DowntimeReasonAPI()

const api = ref(downtimeReasonAPI.endpoints.base)
const label = ref('دلیل توقف جدید')
const indexRouteName = ref('Panel.DowntimeReason.List')
const showRouteName = ref('Panel.DowntimeReason.Show')
const entityIdKey = ref('id')
const entityParamKey = ref('id')

const inputs = ref([
  ...getInputs()
])
</script>
