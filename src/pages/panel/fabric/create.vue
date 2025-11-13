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
import FabricAPI from 'src/repositories/fabric'

const fabricAPI = new FabricAPI()

const api = ref(fabricAPI.endpoints.base)
const label = ref('پارچه جدید')
const indexRouteName = ref('Panel.Fabric.List')
const showRouteName = ref('Panel.Fabric.Show')
const entityIdKey = ref('id')
const entityParamKey = ref('id')

const inputs = ref([
  ...getInputs()
])
</script>
