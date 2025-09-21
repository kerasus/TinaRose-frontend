<template>
  <entity-show
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :show-expand-button="false"
    :show-edit-button="userManager.isManager || userManager.isAccountant"
  />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useUser } from 'stores/user';
import { EntityShow } from 'quasar-crud';
import { computed, shallowRef, ref } from 'vue';
import TransferAPI from 'src/repositories/transfer';
import FormBuilderSelectTransferItem from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectTransferItem.vue';

const FormBuilderSelectTransferItemComponent = shallowRef(FormBuilderSelectTransferItem);

const route = useRoute();
const userManager = useUser();
const transferAPI = new TransferAPI();

const buildingId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0));

const api = ref(transferAPI.endpoints.byId(buildingId.value));
const label = ref('مشاهده حواله');
const indexRouteName = ref('Panel.Transfer.Create');
const showRouteName = ref('Panel.Transfer.Show');
const entityIdKey = ref('id');
const entityParamKey = ref('id');

const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id',
  },
  {
    type: 'input',
    name: 'from_user.firstname',
    responseKey: 'from_user.firstname',
    label: 'نام کاربر مبدا',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: 'input',
    name: 'from_user.lastname',
    responseKey: 'from_user.lastname',
    label: 'نام خانوادگی کاربر مبدا',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: 'input',
    name: 'from_inventory.name',
    responseKey: 'from_inventory.name',
    label: 'انبار مبدا',
    placeholder: ' ',
    col: 'col-md-6 col-12'
  },
  {
    type: 'input',
    name: 'to_user.firstname',
    responseKey: 'to_user.firstname',
    label: 'نام کاربر مقصد',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: 'input',
    name: 'to_user.lastname',
    responseKey: 'to_user.lastname',
    label: 'نام خانوادگی کاربر مقصد',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: 'input',
    name: 'to_inventory.name',
    responseKey: 'to_inventory.name',
    label: 'انبار مقصد',
    placeholder: ' ',
    col: 'col-md-6 col-12'
  },
  {
    type: 'date',
    name: 'transfer_date',
    responseKey: 'transfer_date',
    outsideLabel: 'تاریخ حواله',
    clearable: true,
    col: 'col-md-4 col-12'
  },
  {
    type: 'input',
    name: 'description',
    responseKey: 'description',
    label: 'توضیحات',
    placeholder: ' ',
    col: 'col-12',
  },
  {
    type: FormBuilderSelectTransferItemComponent,
    name: 'items',
    responseKey: 'items',
    readonly: true,
    col: 'col-12'
  },
]);
</script>
