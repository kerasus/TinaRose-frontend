<template>
  <entity-index
    ref="entityIndexRef"
    :value="inputs"
    :title="label"
    :api="api"
    :table="table"
    :table-keys="tableKeys"
    :create-route-name="createRouteName"
    :show-route-name="showRouteName"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="false"
    :show-search-button="true"
    :row-key="itemIdentifyKey"
  >
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'name'">
        <span :style="{ backgroundColor: inputData.props.row.color_hex, width: '10px', height:'10px', display: 'inline-block', marginLeft: '5px' }" />
        {{ inputData.props.row.name }}
      </template>
      <template v-else-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <delete-btn :row="inputData.props.row"
                      :api="colorAPI"
                      :use-flag="false"
                      @change="afterRemove"
          />
          <q-btn
            color="primary"
            flat
            icon="visibility"
            :to="{ name: showRouteName, params: { id: inputData.props.row.id } }"
          />
        </div>
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { EntityIndex } from 'quasar-crud';
import { useDate } from 'src/composables/Date';
import DeleteBtn from 'src/components/controls/deleteBtn.vue';
import ProductAPI , { type ProductType } from 'src/repositories/product';

const $q = useQuasar();
const dateManager = useDate();
const colorAPI = new ProductAPI();

const api = ref(colorAPI.endpoints.base);
const label = ref('محصولات');
const createRouteName = ref('Panel.Product.Create');
const showRouteName = ref('Panel.Product.Show');
const itemIdentifyKey = ref('id');

const tableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page',
});

const table = ref({
  columns: [
    {
      name: 'name',
      required: true,
      label: 'نام',
      align: 'left',
      field: (row: ProductType) => row.name,
    },
    {
      name: 'code',
      required: true,
      label: 'کد',
      align: 'left',
      field: (row: ProductType) => row.code,
    },
    {
      name: 'initial_stock',
      required: true,
      label: 'موجودی اولیه',
      align: 'left',
      field: (row: ProductType) => row.initial_stock,
    },
    {
      name: 'created_at',
      required: true,
      label: 'زمان ایجاد',
      align: 'left',
      field: (row: ProductType) =>
        row.created_at ? dateManager.miladiToShamsi(row.created_at, 'YYYY-MM-DDThh:mm:ss', 'hh:mm:ss jYYYY/jMM/jDD') : '-',
    },
    {
      name: 'actions',
      required: true,
      label: 'عملیات',
      align: 'left',
      field: () => '',
    },
  ],
});

const inputs = ref([
  {
    type: 'hidden',
    name: 'sortation_field',
    value: 'created_at'
  },
  {
    type: 'hidden',
    name: 'sortation_order',
    value: 'asc'
  },
  {
    type: 'input',
    name: 'name',
    label: 'نام',
    placeholder: ' ',
    col: 'col-md-3 col-12',
  },
  {
    type: 'input',
    name: 'code',
    label: 'کد',
    placeholder: ' ',
    col: 'col-md-3 col-12',
  },
]);
const entityIndexRef = ref();

function afterRemove () {
  entityIndexRef.value.reload()
  $q.notify({
    message: 'حذف با موفقیت انجام شد.',
    type: 'positive'
  })
}
</script>
