import BaseAPI from './BaseAPI'
import type { FabricType } from 'src/repositories/fabric'

export type RequiredItemTypeType = 'App\\Models\\Fabric';

export type ProductParRequirementType = {
  id: number;
  product_id: number;
  required_item: FabricType;
  required_item_type: RequiredItemTypeType;
  required_item_type_label: string;
  required_item_id: number;
  quantity: number;
  unit: string;
  created_at: string | null;
  updated_at: string | null;
};

export type ProductPartType = {
  id: number | null;
  name: string | null;
  code: string | null;
  count_per_bunch: number | null;
  requirements: ProductParRequirementType[];
  created_at: string | null;
  updated_at: string | null;
};

export type AddRequirementFormType = {
  required_item_type: 'App\\Models\\Fabric';
  required_item_id: number;
  quantity: number;
  unit: string;
};

export default class ProductPartAPI extends BaseAPI<ProductPartType> {
  constructor () {
    super('/product-parts')
    this.defaultObject = {
      id: null,
      name: null,
      code: null,
      count_per_bunch: null,
      requirements: [],
      created_at: null,
      updated_at: null
    }

    this.endpoints = {
      ...this.endpoints,
      requirements: (productPartId: number) => `${this.baseEndpoint}/${productPartId}/requirements`,
      requirementAction: (productPartId: number, requirementId: number) => `${this.baseEndpoint}/${productPartId}/requirements/${requirementId}`
    }
  }

  async addRequirement (productPartId: number, data: AddRequirementFormType): Promise<void> {
    await this.getAxiosInstanceWithToken().post(this.endpoints.requirements(productPartId), data)
  }

  async removeRequirement (productId: number, requirementId: number): Promise<void> {
    await this.getAxiosInstanceWithToken().delete(this.endpoints.requirementAction(productId, requirementId))
  }

  getRequiredItemTypeLabel (itemType: RequiredItemTypeType): string {
    if (itemType === 'App\\Models\\Fabric') {
      return 'پارچه'
    }

    return '-'
  }

  override getNormalizedItem (item: ProductPartType) {
    if (!item.requirements) {
      return item
    }
    item.requirements.forEach((r)=>{
      r.required_item_type_label = this.getRequiredItemTypeLabel(r.required_item_type)
    })
    return item
  }

}
