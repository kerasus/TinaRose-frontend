<template>
  <entity-edit
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
import TransferAPI from 'src/repositories/transfer';
import { type UserRolesType } from 'src/repositories/user';

const route = useRoute();
const transferAPI = new TransferAPI();

const entityId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0));
const api = ref(transferAPI.endpoints.byId(entityId.value));
const label = ref('ویرایش تولید');
const indexRouteName = ref('Panel.Transfer.List');
const showRouteName = ref('Panel.Transfer.Show');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id',
  },
  ...getInputs(route.params.worker_role as UserRolesType)
]);
</script>
