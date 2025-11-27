<template>
  <entity-edit
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :show-expand-button="false" />
</template>

<script setup lang="ts">
import getInputs from './inputs'
import { useRoute } from 'vue-router'
import { EntityEdit } from 'quasar-crud'
import { computed, shallowRef, ref } from 'vue'
import TransferAPI from 'src/repositories/transfer'
import { type UserRolesType } from 'src/repositories/user'
import FormBuilderSelectTransferItem from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectTransferItem.vue'

const route = useRoute()
const transferAPI = new TransferAPI()

const FormBuilderSelectTransferItemComponent = shallowRef(FormBuilderSelectTransferItem)

const entityId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0))
const api = ref(transferAPI.endpoints.byId(entityId.value))
const label = ref('ویرایش حواله')
const indexRouteName = ref('Panel.Transfer.List')
const showRouteName = ref('Panel.Transfer.Show')
const entityIdKey = ref('id')
const entityParamKey = ref('id')

const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id'
  },
  {
    type: 'input',
    name: 'from_user.firstname',
    responseKey: 'from_user.firstname',
    label: 'نام کاربر مبدا',
    placeholder: ' ',
    readonly: true,
    col: 'col-md-3 col-12'
  },
  {
    type: 'input',
    name: 'from_user.lastname',
    responseKey: 'from_user.lastname',
    label: 'نام خانوادگی کاربر مبدا',
    placeholder: ' ',
    readonly: true,
    col: 'col-md-3 col-12'
  },
  {
    type: 'input',
    name: 'from_inventory.name',
    responseKey: 'from_inventory.name',
    label: 'انبار مبدا',
    placeholder: ' ',
    readonly: true,
    col: 'col-md-6 col-12'
  },
  {
    type: 'input',
    name: 'to_user.firstname',
    responseKey: 'to_user.firstname',
    label: 'نام کاربر مقصد',
    placeholder: ' ',
    readonly: true,
    col: 'col-md-3 col-12'
  },
  {
    type: 'input',
    name: 'to_user.lastname',
    responseKey: 'to_user.lastname',
    label: 'نام خانوادگی کاربر مقصد',
    placeholder: ' ',
    readonly: true,
    col: 'col-md-3 col-12'
  },
  {
    type: 'input',
    name: 'to_inventory.name',
    responseKey: 'to_inventory.name',
    label: 'انبار مقصد',
    placeholder: ' ',
    readonly: true,
    col: 'col-md-6 col-12'
  },
  {
    type: 'date',
    name: 'transfer_date',
    responseKey: 'formatted_transfer_date',
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
    col: 'col-12'
  },
  {
    type: FormBuilderSelectTransferItemComponent,
    name: 'items',
    responseKey: 'items',
    readonly: false,
    col: 'col-12'
  }
])
</script>
