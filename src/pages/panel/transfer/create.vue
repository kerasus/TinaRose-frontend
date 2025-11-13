<template>
  <entity-create
    v-if="!userManager.isAccountant"
    ref="entityCreateRef"
    v-model:value="inputs"
    :title="createFormlabel"
    :api="transferAPIBaseEndpoint"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :before-send-data="beforeSendData"
    :show-expand-button="false"
    :show-close-button="false"
    :show-save-button="false">
    <template #after-form-builder>
      <div class="q-mt-md flex justify-end">
        <q-btn
          color="primary"
          @click="onCreateEntity">
          ثبت
        </q-btn>
      </div>
    </template>
  </entity-create>
  <q-separator class="q-my-md" />
  <transfer-list
    v-if="me?.id"
    ref="transferListRef"
    :role="'MiddleWorker'"
    :user-id="me.id" />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useUser } from 'src/stores/user'
import { ref, computed, watch } from 'vue'
import { EntityCreate } from 'quasar-crud'
import getInputs, { getFormData } from './inputs'
import TransferAPI from 'src/repositories/transfer'
import { FormBuilderAssist } from 'quasar-form-builder'
import TransferList from 'src/components/TransferList.vue'

const $q = useQuasar()
const userManager = useUser()
const transferAPI = new TransferAPI()
const transferAPIBaseEndpoint = transferAPI.baseEndpoint

const transferListRef = ref()
const entityCreateRef = ref()

const createFormlabel = ref('حواله جدید')
const indexRouteName = ref('Panel.Transfer.List')
const showRouteName = ref('Panel.Transfer.Create')
const entityIdKey = ref('id')
const entityParamKey = ref('id')

const inputs = ref([
  {
    type: 'optionGroup',
    options: [
      {
        label: 'داخلی',
        value: 'internal'
      },
      {
        label: 'خرید',
        value: 'buy'
      },
      {
        label: 'فروش',
        value: 'sell'
      }
    ],
    name: 'type',
    value: 'internal',
    col: 'col-12'
  },
  ...getInputs('MiddleWorker')
])

const me = computed(() => userManager.me)
const transferType = computed(() => FormBuilderAssist.getInputsByName(inputs.value, 'type')?.value)

function beforeSendData (formData: Record<string, any>) {
  const newFormData = getFormData('MiddleWorker', formData, me.value?.id ?? 0)
  Object.assign(formData, newFormData)
}

function onCreateEntity () {
  entityCreateRef.value.createEntity(false)
    .then(()=>{
      $q.notify({
        message: 'ثبت با موفقیت انجام شد.',
        type: 'positive'
      })
    })
    .finally(()=>{
      transferListRef.value.reloadList()
    })
}

watch(transferType, (newValue)=>{
  if (newValue === 'sell') {
    FormBuilderAssist.setAttributeByName(inputs.value, 'from_user_id', 'disable', false)
    FormBuilderAssist.setAttributeByName(inputs.value, 'from_inventory_type', 'disable', false)
    FormBuilderAssist.setAttributeByName(inputs.value, 'to_user_id', 'disable', true)
    FormBuilderAssist.setAttributeByName(inputs.value, 'to_inventory_type', 'disable', true)
  } else if (newValue === 'buy') {
    FormBuilderAssist.setAttributeByName(inputs.value, 'from_user_id', 'disable', true)
    FormBuilderAssist.setAttributeByName(inputs.value, 'from_inventory_type', 'disable', true)
    FormBuilderAssist.setAttributeByName(inputs.value, 'to_user_id', 'disable', false)
    FormBuilderAssist.setAttributeByName(inputs.value, 'to_inventory_type', 'disable', false)
  } else if (newValue === 'internal') {
    FormBuilderAssist.setAttributeByName(inputs.value, 'from_user_id', 'disable', false)
    FormBuilderAssist.setAttributeByName(inputs.value, 'from_inventory_type', 'disable', false)
    FormBuilderAssist.setAttributeByName(inputs.value, 'to_user_id', 'disable', false)
    FormBuilderAssist.setAttributeByName(inputs.value, 'to_inventory_type', 'disable', false)
  }
  FormBuilderAssist.setAttributeByName(inputs.value, 'from_user_id', 'value', null)
  FormBuilderAssist.setAttributeByName(inputs.value, 'from_inventory_type', 'value', null)
  FormBuilderAssist.setAttributeByName(inputs.value, 'to_user_id', 'value', null)
  FormBuilderAssist.setAttributeByName(inputs.value, 'to_inventory_type', 'value', null)
})
</script>
