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
import ColorAPI from 'src/repositories/color'

const colorAPI = new ColorAPI()
const route = useRoute()

const buildingId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0))

const api = ref(colorAPI.endpoints.byId(buildingId.value))
const label = ref('مشاهده رنگ')
const indexRouteName = ref('Panel.Color.List')
const showRouteName = ref('Panel.Color.Show')
const editRouteName = ref('Panel.Color.Edit')
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
