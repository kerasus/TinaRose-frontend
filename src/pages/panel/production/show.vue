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
    :show-expand-button="false"
    :show-edit-button="canEdit"
    :after-load-input-data="afterLoadInputData" />
</template>

<script setup lang="ts">
import getInputs from './inputs'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUser } from 'stores/user'
import { EntityShow } from 'quasar-crud'
import ProductionAPI, { type ProductionType } from 'src/repositories/production'
import { type WorkerRoleType } from 'src/repositories/user'

const route = useRoute()
const userManager = useUser()
const productionAPI = new ProductionAPI()

const entityData = ref<ProductionType | null>(null)

const buildingId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0))
const canEdit = computed(() => {
  if (entityData.value?.approved_at) {
    return false
  }

  return userManager.me.id === entityData.value?.operator?.id ||
    userManager.isManager ||
    userManager.isAccountant
})

const api = ref(productionAPI.endpoints.byId(buildingId.value))
const label = ref('مشاهده تولید')
const indexRouteName = ref('Panel.Production.List')
const showRouteName = ref('Panel.Production.Show')
const editRouteName = ref('Panel.Production.Edit')
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

function afterLoadInputData (data: ProductionType) {
  entityData.value = productionAPI.getNormalizedItem(data)
}
</script>
