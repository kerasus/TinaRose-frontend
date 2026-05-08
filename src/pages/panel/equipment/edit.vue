<template>
  <entity-edit
    :key="entityEditKey"
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
import getInputs from './inputs'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { EntityEdit } from 'quasar-crud'
import EquipmentAPI from 'src/repositories/equipment'

const route = useRoute()
const equipmentAPI = new EquipmentAPI()

const entityEditKey = ref(Date.now())
const entityId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0))
const api = ref(equipmentAPI.endpoints.byId(entityId.value))
const label = ref('ویرایش تجهیز')
const indexRouteName = ref('Panel.Equipment.List')
const showRouteName = ref('Panel.Equipment.Show')
const entityIdKey = ref('id')
const entityParamKey = ref('id')

const inputs = ref([
  ...getInputs()
])
</script>
