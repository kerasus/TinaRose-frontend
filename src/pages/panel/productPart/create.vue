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
import ProductPartAPI from 'src/repositories/productPart'

const productPartAPI = new ProductPartAPI()

const api = ref(productPartAPI.endpoints.base)
const label = ref('زیرمحصول جدید')
const indexRouteName = ref('Panel.ProductPart.List')
const showRouteName = ref('Panel.ProductPart.Show')
const entityIdKey = ref('id')
const entityParamKey = ref('id')

const inputs = ref([
  ...getInputs()
])
</script>
