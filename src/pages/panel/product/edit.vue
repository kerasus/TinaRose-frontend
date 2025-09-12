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
    :after-load-input-data="afterLoadInputData"
  />
  <q-separator class="q-my-md" />
  <add-requirement-form :product-id="entityId" @add="onAddRequirement" />
  <q-separator class="q-my-md" />
  <requirement-list v-if="productData" :product-id="entityId" :requirements="productData.requirements" edit-mode @remove="onRemoveRequirement" />
</template>

<script setup lang="ts">
import getInputs from './inputs';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { EntityEdit } from 'quasar-crud';
import ProductAPI, { type ProductType } from 'src/repositories/product';
import RequirementList from 'src/components/productRequirementList.vue';
import AddRequirementForm from 'src/components/addProductRequirementForm.vue';

const route = useRoute();
const productAPI = new ProductAPI();

const entityEditKey = ref(Date.now());
const productData = ref<ProductType | null>(null);
const entityId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0));
const api = ref(productAPI.endpoints.byId(entityId.value));
const label = ref('ویرایش محصول');
const indexRouteName = ref('Panel.Product.List');
const showRouteName = ref('Panel.Product.Show');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id',
  },
  ...getInputs()
]);

function onAddRequirement () {
  refreshEntityData()
}

function onRemoveRequirement () {
  refreshEntityData()
}

function refreshEntityData () {
  entityEditKey.value = Date.now()
}

function afterLoadInputData(data: ProductType) {
  productData.value = productAPI.getNormalizedItem(data)
}
</script>
