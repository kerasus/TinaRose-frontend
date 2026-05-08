<template>
  <q-card>
    <q-card-section>
      <div class="q-mb-md">
        یک نفر را جهت ثبت تولید جدید انتخاب کنید
      </div>
      <div>
        <form-builder-select-user
          v-model:value="selectedUser"
          :emit-value="false" />
      </div>
      <div v-if="selectedRoles.length > 0">
        نقش کاربر
        <q-select
          v-model="selectedRole"
          :options="selectedRoles"
          emit-value
          map-options />
      </div>
    </q-card-section>
  </q-card>
  <q-separator class="q-my-md" />
  <entity-create
    v-if="inputs.length > 0"
    ref="entityCreateRef"
    v-model:value="inputs"
    :title="createFormlabel"
    :api="api"
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
          @click="onCreateEntity"> ثبت </q-btn>
      </div>
    </template>
  </entity-create>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import getInputs from './inputs'
import { useQuasar } from 'quasar'
import Digit from 'src/composables/Digit'
import { EntityCreate } from 'quasar-crud'
import { FormBuilderAssist } from 'quasar-form-builder'
import ProductionAPI from 'src/repositories/production'
import { getUserRoleLabel, userRolesToUserRolesForPath, UserRolesType } from 'src/repositories/user'
import FormBuilderSelectUser from 'components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue'

const $q = useQuasar()
const productionAPI = new ProductionAPI()

const selectedUser = ref(null)
const selectedRole = ref<UserRolesType | null>(null)
const selectedRoles = ref([])
const entityIndexRef = ref()
const entityCreateRef = ref()

const api = ref(productionAPI.endpoints.base)
const createFormlabel = ref('تولید جدید')
const indexRouteName = ref('Panel.Production.List')
const showRouteName = ref('Panel.Production.Show')
const entityIdKey = ref('id')
const entityParamKey = ref('id')

const inputs = ref([])

function beforeSendData (formData: Record<string, any>) {
  formData.bunch_count = Digit.toEnDigit(formData.bunch_count)
}

function onCreateEntity () {
  entityCreateRef.value
    .createEntity(false)
    .then(() => {
      $q.notify({
        message: 'ثبت با موفقیت انجام شد.',
        type: 'positive'
      })
    })
    .finally(() => {
      entityIndexRef.value.reload()
    })
}

watch(selectedUser, (newValue) => {
  if (!newValue || newValue.roles_list.length === 0) {
    inputs.value = []
    FormBuilderAssist.setAttributeByName(inputs.value, 'user_id', 'value', null)
    return
  }
  selectedRoles.value = newValue.roles_list.map((role)=>{
    return {
      value: role,
      label: getUserRoleLabel(role)
    }
  })
  selectedRole.value = newValue.roles_list[0]
  inputs.value = getInputs(userRolesToUserRolesForPath(selectedRole.value))
  FormBuilderAssist.setAttributeByName(inputs.value, 'user_id', 'value', newValue.id)
})

watch(selectedRole, (newValue) => {
  if (!newValue) {
    FormBuilderAssist.setAttributeByName(inputs.value, 'role', 'value', null)
    return
  }
  FormBuilderAssist.setAttributeByName(inputs.value, 'role', 'value', newValue)
})
</script>
