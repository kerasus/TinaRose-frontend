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
    :show-expand-button="false"
    :after-load-input-data="afterLoadInputData" />
  <q-separator class="q-my-md" />
  <add-requirement-form
    :product-part-id="entityId"
    @add="onAddRequirement" />
  <q-separator class="q-my-md" />
  <requirement-list
    v-if="productPartData"
    :product-part-id="entityId"
    :requirements="productPartData.requirements"
    edit-mode
    @remove="onRemoveRequirement" />
</template>

<script setup lang="ts">
import getInputs from './inputs'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { EntityEdit } from 'quasar-crud'
import RequirementList from 'src/components/productPartRequirementList.vue'
import AddRequirementForm from 'src/components/addProductPartRequirementForm.vue'
import ProductPartAPI, { type ProductPartType } from 'src/repositories/productPart'

const route = useRoute()
const productPartAPI = new ProductPartAPI()

const productPartData = ref<ProductPartType | null>(null)
const entityEditKey = ref(Date.now())
const entityId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0))
const api = ref(productPartAPI.endpoints.byId(entityId.value))
const label = ref('ویرایش زیرمحصول')
const indexRouteName = ref('Panel.ProductPart.List')
const showRouteName = ref('Panel.ProductPart.Show')
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


function onAddRequirement () {
  refreshEntityData()
}

function onRemoveRequirement () {
  refreshEntityData()
}

function refreshEntityData () {
  entityEditKey.value = Date.now()
}

function afterLoadInputData (data: ProductPartType) {
  productPartData.value = productPartAPI.getNormalizedItem(data)
}
</script>
