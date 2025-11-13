import { shallowRef } from 'vue'
import FormBuilderSelectColor from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectColor.vue'
import FormBuilderSelectFabric from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectFabric.vue'
import FormBuilderSelectProduct from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectProduct.vue'
import FormBuilderSelectProductPart from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectProductPart.vue'

const FormBuilderSelectColorComponent = shallowRef(FormBuilderSelectColor)
const FormBuilderSelectFabricComponent = shallowRef(FormBuilderSelectFabric)
const FormBuilderSelectProductComponent = shallowRef(FormBuilderSelectProduct)
const FormBuilderSelectProductPartComponent = shallowRef(FormBuilderSelectProductPart)

export type WorkerRoleType = 'molding' | 'coloring' | 'fabric-cutter' | 'assembler'

export default (workerType: WorkerRoleType) => {

  const hiddenInputs: any = [
    {
      type: 'hidden',
      name: 'id',
      responseKey: 'id'
    },
    {
      type: 'hidden',
      name: 'user_id',
      responseKey: 'user_id'
    }
  ]
  const productPartInput = {
    type: FormBuilderSelectProductPartComponent,
    name: 'product_part_id',
    responseKey: 'product_part_id',
    col: 'col-md-6 col-12'
  }
  const fabricCutterInputs = [
    productPartInput,
    {
      type: FormBuilderSelectFabricComponent,
      name: 'fabric_id',
      responseKey: 'fabric_id',
      col: 'col-md-6 col-12'
    }
  ]
  const coloringWorkerInputs = [
    productPartInput,
    {
      type: FormBuilderSelectColorComponent,
      name: 'color_id',
      responseKey: 'color_id',
      col: 'col-md-6 col-12'
    }
  ]
  const moldingWorkerInputs = [
    productPartInput,
    {
      type: FormBuilderSelectColorComponent,
      name: 'color_id',
      responseKey: 'color_id',
      col: 'col-md-6 col-12'
    }
  ]
  const assemblerInputs = [
    {
      type: FormBuilderSelectProductComponent,
      name: 'product_id',
      responseKey: 'product_id',
      col: 'col-md-6 col-12'
    },
    {
      type: FormBuilderSelectColorComponent,
      name: 'color_id',
      responseKey: 'color_id',
      col: 'col-md-6 col-12'
    }
  ]

  let finalInputs = hiddenInputs

  if (workerType === 'fabric-cutter') {
    finalInputs = finalInputs.concat(fabricCutterInputs)
  }
  if (workerType === 'coloring') {
    finalInputs = finalInputs.concat(coloringWorkerInputs)
  }
  if (workerType === 'molding') {
    finalInputs = finalInputs.concat(moldingWorkerInputs)
  }
  if (workerType === 'assembler') {
    finalInputs = finalInputs.concat(assemblerInputs)
  }

  return [
    ...finalInputs,
    {
      type: 'date',
      name: 'production_date',
      responseKey: 'production_date',
      outsideLabel: 'تاریخ',
      placeholder: ' ',
      col: 'col-md-6 col-12'
    },
    {
      type: 'input',
      name: 'bunch_count',
      responseKey: 'bunch_count',
      label: 'تعداد',
      placeholder: ' ',
      inputType: 'number',
      col: 'col-md-6 col-12'
    },
    {
      type: 'input',
      name: 'description',
      responseKey: 'description',
      label: 'توضیحات',
      placeholder: ' ',
      col: 'col-12'
    }
  ]
}
