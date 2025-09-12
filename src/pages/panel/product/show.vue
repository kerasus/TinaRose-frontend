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
    :after-load-input-data="afterLoadInputData"
  />
  <q-separator class="q-my-md" />
  <requirement-list v-if="productData" :product-id="entityId" :requirements="productData.requirements" :edit-mode="false" />
</template>

<script setup lang="ts">
import getInputs from './inputs';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { EntityShow } from 'quasar-crud';
import ProductAPI, { type ProductType } from 'src/repositories/product';
import RequirementList from 'src/components/productRequirementList.vue';

const productAPI = new ProductAPI();
const route = useRoute();

const entityId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0));

const productData = ref<ProductType | null>(null);
const api = ref(productAPI.endpoints.byId(entityId.value));
const label = ref('مشاهده محصول');
const indexRouteName = ref('Panel.Product.List');
const showRouteName = ref('Panel.Product.Show');
const editRouteName = ref('Panel.Product.Edit');
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

function afterLoadInputData(data: ProductType) {
  productData.value = productAPI.getNormalizedItem(data)
}
</script>
