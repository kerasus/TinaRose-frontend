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
import RawMaterialAPI from 'src/repositories/rawMaterial'

const route = useRoute()
const colorAPI = new RawMaterialAPI()

const entityEditKey = ref(Date.now())
const entityId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0))
const api = ref(colorAPI.endpoints.byId(entityId.value))
const label = ref('ویرایش ماده اولیه')
const indexRouteName = ref('Panel.RawMaterial.List')
const showRouteName = ref('Panel.RawMaterial.Show')
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
