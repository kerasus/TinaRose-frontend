<template>
  <entity-index
    :value="inputs"
    :title="label"
    :api="api"
    :table="table"
    :table-keys="tableKeys"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="false"
    :show-search-button="true"
    :row-key="itemIdentifyKey"
  />
  <q-separator class="q-my-md" />
  <div class="flex justify-center items-center">
    <q-btn color="primary" label="backup" :loading="exportCSVLoading" @click="exportCSV" />
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { EntityIndex } from 'quasar-crud';
import { userRoleOptions } from 'src/repositories/user';
import ProductionAPI from 'src/repositories/production';
import { FormBuilderAssist } from 'quasar-form-builder';
import FormBuilderSelectUser from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectUser.vue';
import FormBuilderSelectColor from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectColor.vue';
import FormBuilderSelectFabric from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectFabric.vue';
import FormBuilderSelectProductPart from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectProductPart.vue';

const productionAPI = new ProductionAPI();

const formBuilderSelectUserComponent = shallowRef(FormBuilderSelectUser);
const formBuilderSelectColorComponent = shallowRef(FormBuilderSelectColor);
const formBuilderSelectFabricComponent = shallowRef(FormBuilderSelectFabric);
const formBuilderSelectProductPartComponent = shallowRef(FormBuilderSelectProductPart);

const exportCSVLoading = ref(false);
const api = ref(productionAPI.endpoints.summary);
const label = ref('گزارش تولیدات');
const itemIdentifyKey = ref('id');

const tableKeys = ref({
  data: '',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page',
});

const table = ref({
  columns: [
    {
      name: 'product_part',
      required: true,
      label: 'زیر محصول',
      align: 'left',
      field: (row: any) => row.product_part_name,
    },
    {
      name: 'color_name',
      required: true,
      label: 'رنگ',
      align: 'left',
      field: (row: any) => row.color_name ? row.color_name : '-',
    },
    {
      name: 'fabric_name',
      required: true,
      label: 'پارچه',
      align: 'left',
      field: (row: any) => row.fabric_name ? row.fabric_name : '-',
    },
    {
      name: 'total_bunch',
      required: true,
      label: 'تعداد دسته',
      align: 'left',
      field: (row: any) => row.total_bunch,
    },
    {
      name: 'total_petals',
      required: true,
      label: 'تعداد کل',
      align: 'left',
      field: (row: any) => row.total_petals,
    }
  ],
});
const inputs = ref([
  {
    type: 'select',
    name: 'role',
    label: 'نقش',
    placeholder: ' ',
    options: userRoleOptions.filter(item=>item.value !== 'Manager' && item.value !== 'Accountant'),
    col: 'col-md-4 col-12'
  },
  {
    type: 'date',
    name: 'production_date',
    outsideLabel: 'تاریخ تولید',
    clearable: true,
    col: 'col-md-4 col-12'
  },
  {
    type: formBuilderSelectProductPartComponent,
    name: 'product_part_id',
    col: 'col-md-4 col-12'
  },
  {
    type: formBuilderSelectUserComponent,
    name: 'user_id',
    col: 'col-md-4 col-12'
  },
  {
    type: formBuilderSelectFabricComponent,
    name: 'fabric_id',
    col: 'col-md-4 col-12'
  },
  {
    type: formBuilderSelectColorComponent,
    name: 'color_id',
    col: 'col-md-4 col-12'
  }
]);

async function exportCSV() {
  exportCSVLoading.value = true;
  const filter = FormBuilderAssist.getFormData(inputs.value)
  try {
    const exportResult = await productionAPI.summaryExport(filter)
    const url = window.URL.createObjectURL(exportResult.blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', exportResult.filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    exportCSVLoading.value = false;
  }
}
</script>
