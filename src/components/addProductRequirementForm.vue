<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import ProductAPI from 'src/repositories/product'
import SelectProductPart from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectProductPart.vue'
import SelectRawMaterial from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectRawMaterial.vue'

const emit = defineEmits(['add'])

const props = defineProps<{
  productId: number
}>()

const productAPI = new ProductAPI()
const requirementType = ref<'App\\Models\\ProductPart' | 'App\\Models\\RawMaterial'>('App\\Models\\RawMaterial')
const requirementTypeOptions = ref([
  {
    label: 'زیر محصول',
    value: 'App\\Models\\ProductPart'
  },
  {
    label: 'مواد اولیه',
    value: 'App\\Models\\RawMaterial'
  }
])
const selectedProductPart = ref(undefined)
const selectedRawMaterial = ref(undefined)
const quantity = ref<number>(0)
const unit = ref<string>('')
const loading = ref(false)

const requiredItemId = computed<number>(()=> {
  if (requirementType.value === 'App\\Models\\ProductPart') {
    return selectedProductPart.value ?? 0
  }

  return selectedRawMaterial.value ?? 0
})

function isValidForm () {
  if (!requirementType.value) {
    return false
  }

  if (
    requirementType.value === 'App\\Models\\ProductPart' &&
    !selectedProductPart.value
  ) {
    return false
  }

  if (
    requirementType.value === 'App\\Models\\RawMaterial' &&
    !selectedRawMaterial.value
  ) {
    return false
  }

  return !(!quantity.value || !unit.value);
}

function clearForm () {
  selectedProductPart.value = undefined
  selectedRawMaterial.value = undefined
  quantity.value = 0
  unit.value = ''
}

async function addRequirement () {
  if (!isValidForm()) {
    return
  }

  try {
    loading.value = true
    await productAPI.addRequirement(props.productId, {
      required_item_type: requirementType.value,
      required_item_id: requiredItemId.value,
      quantity: quantity.value,
      unit: unit.value,
    })
    clearForm()
    emit('add')
  } finally {
    loading.value = false
  }
}

watch(requirementType, ()=>{
  clearForm()
})
</script>

<template>
  <q-card>
    <q-card-actions>
      <div class="doc-card-title">
        افزودن نیازمندی جدید
      </div>
      <q-btn flat icon="add" class="add-btn" :loading="loading" @click="addRequirement" />
    </q-card-actions>
    <q-card-actions>
      <div class="row q-col-gutter-md full-width">
        <div class="col-md-3">
          <div>
            نوع نیازمندی
          </div>
          <q-select v-model="requirementType"
                    :options="requirementTypeOptions"
                    label=""
                    emit-value
                    map-options/>
        </div>
        <div v-if="requirementType === 'App\\Models\\ProductPart'" class="col-md-3">
          <select-product-part v-model:value="selectedProductPart" />
        </div>
        <div v-if="requirementType === 'App\\Models\\RawMaterial'" class="col-md-3">
          <select-raw-material v-model:value="selectedRawMaterial" />
        </div>
        <div v-if="selectedProductPart || selectedRawMaterial" class="col-md-3">
          <div>
            تعداد
          </div>
          <q-input v-model="quantity" :loading="loading" type="number" />
        </div>
        <div v-if="selectedProductPart || selectedRawMaterial" class="col-md-3">
          <div>
            واحد
          </div>
          <q-input v-model="unit" :loading="loading" />
        </div>
      </div>
    </q-card-actions>
  </q-card>
</template>

<style scoped lang="scss">
.doc-card-title {
  background-image: linear-gradient(-310deg, #17ad37 0%, #98ec2d 100%);
  display: inline-block;
  padding: 0.55em 0.9em;
  font-size: 1.2em;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.45rem;
  margin-left: -24px;
}
.add-btn {
  position: absolute;
  right: $space-4;
  top: 0;
  transform: translatey(50%);
}
</style>
