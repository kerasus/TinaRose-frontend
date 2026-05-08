<template>
  <entity-show
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :edit-route-name="editRouteName"
    :show-expand-button="false" />
</template>

<script setup lang="ts">
import getInputs from './inputs'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { EntityShow } from 'quasar-crud'
import DowntimeReasonAPI from 'src/repositories/downtimeReason'

const downtimeReasonAPI = new DowntimeReasonAPI()
const route = useRoute()

const entityId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0))

const api = ref(downtimeReasonAPI.endpoints.byId(entityId.value))
const label = ref('مشاهده دلیل توقف')
const indexRouteName = ref('Panel.DowntimeReason.List')
const showRouteName = ref('Panel.DowntimeReason.Show')
const editRouteName = ref('Panel.DowntimeReason.Edit')
const entityIdKey = ref('id')
const entityParamKey = ref('id')

const inputs = ref([
  ...getInputs()
])
</script>
