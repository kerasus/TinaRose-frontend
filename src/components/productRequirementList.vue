<script setup lang="ts">
import { ref } from 'vue'
import DeleteBtn from 'components/controls/deleteBtn.vue';
import ProductAPI, { type ProductRequirementType} from 'src/repositories/product'

const emit = defineEmits(['remove'])

const props = defineProps<{
  productId: number,
  requirements: ProductRequirementType[],
  editMode: boolean
}>()

const productAPI = new ProductAPI()
const loading = ref(false)

async function removeRequirement(requirement: ProductRequirementType) {
  if (!props.productId) {
    return
  }

  try {
    loading.value = true;
    await productAPI.removeRequirement(props.productId, requirement.id)
  } finally {
    loading.value = false;
    emit('remove')
  }
}
</script>

<template>
  <q-card>
    <q-card-actions>
      <div class="doc-card-title">
        لیست نیازمندی ها
      </div>
    </q-card-actions>
    <q-card-actions>
      <q-list bordered separator class="role-list full-width">
        <q-linear-progress v-if="loading"
                           indeterminate />
        <template v-else>
          <q-item v-for="(requirement, requirementIndex) in requirements"
                  :key="requirementIndex"
                  v-ripple
                  clickable
                  class="role-item"
          >
            <q-item-section>
              <q-item-label>
                {{ requirement.required_item.name }}
                -
                {{ requirement.quantity }}
                {{ requirement.unit }}
              </q-item-label>
              <q-item-label caption>
                {{ requirement.required_item_type_label }}
              </q-item-label>
            </q-item-section>
            <q-item-section v-if="editMode"
                            side>
              <div>
                <delete-btn :row="requirement"
                            :loading="loading"
                            :change-status-promise="removeRequirement"
                            :use-flag="false"
                />
              </div>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
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
