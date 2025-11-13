<template>
  <entity-edit
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
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { EntityEdit } from 'quasar-crud'
import ProductionAPI from 'src/repositories/production'
import getInputs, { type WorkerRoleType } from './inputs'

const route = useRoute()
const productionAPI = new ProductionAPI()

const entityId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0))
const api = ref(productionAPI.endpoints.byId(entityId.value))
const label = ref('ویرایش تولید')
const indexRouteName = ref('Panel.Production.List')
const showRouteName = ref('Panel.Production.Show')
const entityIdKey = ref('id')
const entityParamKey = ref('id')

const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id'
  },
  ...getInputs(route.params.worker_role as WorkerRoleType)
])
</script>
