<template>
  <entity-create
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
import { ref } from 'vue';
import getInputs from './inputs';
import { EntityCreate } from 'quasar-crud';
import RawMaterialAPI from 'src/repositories/rawMaterial';

const colorAPI = new RawMaterialAPI();

const api = ref(colorAPI.endpoints.base);
const label = ref('ماده اولیه جدید');
const indexRouteName = ref('Panel.RawMaterial.List');
const showRouteName = ref('Panel.RawMaterial.Show');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  ...getInputs()
]);
</script>
