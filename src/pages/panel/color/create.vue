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
import ColorAPI from 'src/repositories/color';

const colorAPI = new ColorAPI();

const api = ref(colorAPI.endpoints.base);
const label = ref('رنگ جدید');
const indexRouteName = ref('Panel.Color.List');
const showRouteName = ref('Panel.Color.Show');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  ...getInputs()
]);
</script>
