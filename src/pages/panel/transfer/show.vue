<template>
  <entity-show
    ref="entityShowRef"
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="(userManager.isManager || userManager.isAccountant || userManager.isWarehouseKeeper) ? indexRouteName : undefined"
    :show-route-name="showRouteName"
    :show-expand-button="false"
    :show-edit-button="false"
    :show-index-button="userManager.isManager || userManager.isAccountant || userManager.isWarehouseKeeper"
    :after-load-input-data="afterLoadInputData" />
  <q-separator class="q-my-md" />
  <div
    v-if="entityData && entityData.status === 'pending'"
    class="row q-col-gutter-md">
    <div class="col-md-6 col-12 flex justify-center">
      <q-btn
        v-if="canApproveOrRejectTransfer"
        color="red"
        label="رد حواله"
        class="full-width"
        @click="confirmRejectTransferItem(entityData.id)" />
    </div>
    <div class="col-md-6 col-12 flex justify-center">
      <q-btn
        v-if="canApproveOrRejectTransfer"
        color="green"
        label="تایید حواله"
        class="full-width"
        @click="confirmApproveTransferItem(entityData.id)" />
    </div>
    <q-dialog
      v-model="approveDialog"
      :persistent="approveLoading">
      <confirmation
        title="تایید حواله"
        message="آیا از تایید حواله اطمینان دارید؟"
        submit-label="بله"
        cancel-label="انصراف"
        icon="dangerous"
        title-color="warning"
        :loading="approveLoading"
        @submit="approveTransferItem"
        @cancel="onCancelApproveTransferItem" />
    </q-dialog>
    <q-dialog
      v-model="rejectDialog"
      :persistent="rejectLoading">
      <confirmation
        title="رد حواله"
        message="آیا از رد حواله اطمینان دارید؟"
        submit-label="بله"
        cancel-label="انصراف"
        icon="dangerous"
        title-color="error"
        :loading="rejectLoading"
        @submit="rejectTransferItem"
        @cancel="onCancelRejectTransferItem" />
    </q-dialog>
  </div>
  <div
    v-if="entityData && entityData.status !== 'pending'"
    class="row q-col-gutter-md">
    <div class="col-12">
      <q-banner
        v-if="entityData.status === 'approved'"
        class="bg-success text-white">
        این حواله در
        {{ getDateTime(entityData.approved_at) }}
        تایید شده است.
      </q-banner>
      <q-banner
        v-if="entityData.status === 'rejected'"
        class="bg-error text-white">
        این حواله در
        {{ getDateTime(entityData.rejected_at) }}
        لغو شده است.
      </q-banner>
    </div>
  </div>

</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { useUser } from 'stores/user'
import { EntityShow } from 'quasar-crud'
import { computed, shallowRef, ref } from 'vue'
import { useDate } from 'src/composables/Date'
import Confirmation from 'src/components/cards/confirmation.vue'
import TransferAPI, { type TransferType } from 'src/repositories/transfer'
import FormBuilderSelectTransferItem from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectTransferItem.vue'

const FormBuilderSelectTransferItemComponent = shallowRef(FormBuilderSelectTransferItem)

const $q = useQuasar()
const route = useRoute()
const dateManager = useDate()
const userManager = useUser()
const transferAPI = new TransferAPI()

const entityId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0))
const canApproveOrRejectTransfer = computed(() => userManager.me?.id === entityData.value?.to_user_id)

const selectedTransferItemToApprove = ref<number | null>(null)
const selectedTransferItemToReject = ref<number | null>(null)
const approveDialog = ref(false)
const rejectDialog = ref(false)
const approveLoading = ref(false)
const rejectLoading = ref(false)
const entityData = ref<TransferType | null>(null)
const entityShowRef = ref()
const api = ref(transferAPI.endpoints.byId(entityId.value))
const label = ref('مشاهده حواله')
const indexRouteName = ref('Panel.Transfer.Create')
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
    col: 'col-12'
  },
  {
    type: FormBuilderSelectTransferItemComponent,
    name: 'items',
    responseKey: 'items',
    readonly: true,
    col: 'col-12'
  }
])

function afterLoadInputData (data: TransferType) {
  entityData.value = transferAPI.getNormalizedItem(data)
}

function confirmRejectTransferItem (transferId: number) {
  rejectDialog.value = true
  selectedTransferItemToReject.value = transferId
}

function confirmApproveTransferItem (transferId: number) {
  approveDialog.value = true
  selectedTransferItemToApprove.value = transferId
}

function onCancelApproveTransferItem () {
  selectedTransferItemToApprove.value = null
  approveDialog.value = false
}

function onCancelRejectTransferItem () {
  selectedTransferItemToReject.value = null
  rejectDialog.value = false
}

async function approveTransferItem () {
  try {
    approveLoading.value = true
    const result = await transferAPI.approve(selectedTransferItemToApprove.value)
    $q.notify({
      message: result.message,
      type: 'positive'
    })
    approveDialog.value = false
    reloadForm()
  } finally {
    approveLoading.value = false
  }
}

async function rejectTransferItem () {
  try {
    rejectLoading.value = true
    const result = await transferAPI.reject(selectedTransferItemToReject.value)
    $q.notify({
      message: result.message,
      type: 'positive'
    })
    rejectDialog.value = false
    reloadForm()
  } finally {
    rejectLoading.value = false
  }
}

function reloadForm () {
  entityShowRef.value.getData()
}

function getDateTime (date: string): string {
  return dateManager.miladiToShamsi(date, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD')
}
</script>
