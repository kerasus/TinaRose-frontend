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
    :show-edit-button="userManager.isManager || userManager.isAccountant"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUser } from 'stores/user';
import { EntityShow } from 'quasar-crud';
import ProductionAPI from 'src/repositories/production';
import getInputs, { type WorkerRoleType } from './inputs';

const route = useRoute();
const userManager = useUser();
const productionAPI = new ProductionAPI();

const buildingId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0));

const api = ref(productionAPI.endpoints.byId(buildingId.value));
const label = ref('مشاهده تولید');
const indexRouteName = ref('Panel.Production.List');
const showRouteName = ref('Panel.Production.Show');
const editRouteName = ref('Panel.Production.Edit');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id',
  },
  ...getInputs(route.params.worker_role as WorkerRoleType)
]);
</script>
