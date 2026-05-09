<template>
  <entity-edit
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :before-load-input-data="beforeLoadInputData"
    :show-expand-button="false" />
</template>

<script setup lang="ts">
import getInputs from './inputs'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { EntityEdit } from 'quasar-crud'
import { type WorkerRoleType } from 'src/repositories/user'
import ProductionAPI, { type ProductionType } from 'src/repositories/production'

const route = useRoute()
const productionAPI = new ProductionAPI()

const entityData = ref<ProductionType | null>(null)

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

function beforeLoadInputData (data: ProductionType) {
  entityData.value = productionAPI.getNormalizedItem(data)
  data = entityData.value
}
</script>
