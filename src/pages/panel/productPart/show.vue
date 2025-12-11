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
    :after-load-input-data="afterLoadInputData" />
  <q-separator class="q-my-md" />
  <requirement-list
    v-if="productPartData"
    :product-part-id="entityId"
    :requirements="productPartData.requirements"
    :edit-mode="false" />
</template>

<script setup lang="ts">
import getInputs from './inputs'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { EntityShow } from 'quasar-crud'
import RequirementList from 'src/components/productPartRequirementList.vue'
import ProductPartAPI, { type ProductPartType } from 'src/repositories/productPart'

const route = useRoute()
const productPartAPI = new ProductPartAPI()

const entityId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0))

const productPartData = ref<ProductPartType | null>(null)
const api = ref(productPartAPI.endpoints.byId(entityId.value))
const label = ref('مشاهده زیرمحصول')
const indexRouteName = ref('Panel.ProductPart.List')
const showRouteName = ref('Panel.ProductPart.Show')
const editRouteName = ref('Panel.ProductPart.Edit')
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

function afterLoadInputData (data: ProductPartType) {
  productPartData.value = productPartAPI.getNormalizedItem(data)
}
</script>
