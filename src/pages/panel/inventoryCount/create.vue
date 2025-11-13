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
import InventoryCountAPI from 'src/repositories/inventoryCount'

const inventoryCountAPI = new InventoryCountAPI()

const api = ref(inventoryCountAPI.endpoints.start())
const label = ref('انبار گردانی جدید')
const indexRouteName = ref('Panel.InventoryCount.List')
const showRouteName = ref('Panel.InventoryCount.Show')
const entityIdKey = ref('id')
const entityParamKey = ref('id')

const inputs = ref([
  ...getInputs()
])
</script>
