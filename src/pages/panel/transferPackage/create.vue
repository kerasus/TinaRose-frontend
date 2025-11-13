<template>
  <entity-create
    v-if="!userManager.isAccountant"
    ref="entityCreateRef"
    v-model:value="inputs"
    :title="createFormlabel"
    :api="transferPackageAPIBaseEndpoint"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :show-expand-button="false"
    :show-close-button="false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import getInputs from './inputs'
import { useUser } from 'src/stores/user'
import { EntityCreate } from 'quasar-crud'
import TransferPackageAPI from 'src/repositories/transferPackage'

const userManager = useUser()
const transferPackageAPI = new TransferPackageAPI()
const transferPackageAPIBaseEndpoint = transferPackageAPI.baseEndpoint

const entityCreateRef = ref()

const createFormlabel = ref('حواله جدید')
const indexRouteName = ref('Panel.TransferPackage.List')
const showRouteName = ref('Panel.TransferPackage.Show')
const entityIdKey = ref('id')
const entityParamKey = ref('id')

const inputs = ref([
  ...getInputs()
])
</script>
