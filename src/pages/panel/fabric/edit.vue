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
  />
</template>

<script setup lang="ts">
import getInputs from './inputs';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { EntityEdit } from 'quasar-crud';
import FabricAPI from 'src/repositories/fabric';

const route = useRoute();
const fabricAPI = new FabricAPI();

const entityEditKey = ref(Date.now());
const unitId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0));
const api = ref(fabricAPI.endpoints.byId(unitId.value));
const label = ref('ویرایش پارچه');
const indexRouteName = ref('Panel.Fabric.List');
const showRouteName = ref('Panel.Fabric.Show');
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
</script>
