<template>
  <entity-show
    ref="entityShowRef"
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :edit-route-name="editRouteName"
    :show-expand-button="false" />
</template>

<script setup lang="ts">
import getInputs from './inputs'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { EntityShow } from 'quasar-crud'
import TransferPackageAPI from 'src/repositories/transferPackage'

const route = useRoute()
const transferPackageAPI = new TransferPackageAPI()

const entityId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0))

const entityShowRef = ref()
const api = ref(transferPackageAPI.endpoints.byId(entityId.value))
const label = ref('مشاهده پک حواله')
const indexRouteName = ref('Panel.TransferPackage.List')
const editRouteName = ref('Panel.TransferPackage.Edit')
const entityIdKey = ref('id')
const entityParamKey = ref('id')

const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id'
  },
  ...getInputs()
])
</script>
