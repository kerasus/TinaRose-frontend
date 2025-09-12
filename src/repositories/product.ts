import BaseAPI from './BaseAPI';
import { type RawMaterialType } from './rawMaterial';

export type RequiredItemTypeType = 'App\\Models\\ProductPart' | 'App\\Models\\RawMaterial';

export type ProductRequirementType = {
  id: number;
  product_id: number;
  required_item: ProductType | RawMaterialType;
  required_item_type: RequiredItemTypeType;
  required_item_type_label: string;
  required_item_id: number;
  quantity: number;
  unit: string;
  created_at: string | null;
  updated_at: string | null;
};

export type ProductType = {
  id: number | null;
  name: string | null;
  unit_large: string | null;
  unit_small: string | null;
  conversion_rate: number | null;
  initial_stock: number | null;
  current_stock: number | null;
  requirements: ProductRequirementType[];
  created_at: string | null;
  updated_at: string | null;
};

export type AddRequirementFormType = {
  required_item_type: 'App\\Models\\ProductPart' | 'App\\Models\\RawMaterial';
  required_item_id: number;
  quantity: number;
  unit: string;
};

export default class ProductAPI extends BaseAPI<ProductType> {
  constructor() {
    super('/products');
    this.defaultObject = {
      id: null,
      name: null,
      unit_large: null,
      unit_small: null,
      conversion_rate: null,
      initial_stock: null,
      current_stock: null,
      requirements: [],
      created_at: null,
      updated_at: null
    };

    this.endpoints = {
      ...this.endpoints,
      requirements: (productId: number) => `${this.baseEndpoint}/${productId}/requirements`,
      requirementAction: (productId: number, requirementId: number) => `${this.baseEndpoint}/${productId}/requirements/${requirementId}`
    }
  }

  async addRequirement(productId: number, data: AddRequirementFormType): Promise<void> {
    await this.getAxiosInstanceWithToken().post(this.endpoints.requirements(productId), data);
  }

  async removeRequirement(productId: number, requirementId: number): Promise<void> {
    await this.getAxiosInstanceWithToken().delete(this.endpoints.requirementAction(productId, requirementId));
  }

  getRequiredItemTypeLabel (itemType: RequiredItemTypeType): string {
    if (itemType === 'App\\Models\\ProductPart') {
      return 'زیر محصول'
    }
    if (itemType === 'App\\Models\\RawMaterial') {
      return 'مواد اولیه'
    }

    return '-'
  }

  override getNormalizedItem(item: ProductType) {
    item.requirements.forEach(r=>{
      r.required_item_type_label = this.getRequiredItemTypeLabel(r.required_item_type)
    })
    return item;
  }
}
