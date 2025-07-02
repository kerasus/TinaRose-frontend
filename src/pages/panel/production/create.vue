<template>
  <entity-create
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :before-send-data="beforeSendData"
    :show-expand-button="false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Digit from 'src/composables/Digit'
import { useUser } from 'src/stores/user';
import { EntityCreate } from 'quasar-crud';
import ProductionAPI from 'src/repositories/production';
import { FormBuilderAssist } from 'quasar-form-builder';
import getInputs, { type WorkerRoleType } from './inputs';

const route = useRoute()
const userManager = useUser();
const productionAPI = new ProductionAPI();

const api = ref(productionAPI.endpoints.base);
const label = ref('تولید جدید');
const indexRouteName = ref('Panel.Production.List');
const showRouteName = ref('Panel.Production.Show');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  ...getInputs(route.params.worker_role as WorkerRoleType)
]);

function beforeSendData (formData: Record<string, any>) {
  formData.bunch_count = Digit.toEnDigit(formData.bunch_count)
}

FormBuilderAssist.setAttributeByName(inputs.value, 'user_id', 'value', userManager.me?.id)
</script>
