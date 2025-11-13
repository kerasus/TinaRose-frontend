import BaseAPI from './BaseAPI'
import { type ColorType } from './color'
import { type FabricType } from './fabric'
import { type ProductType } from './product'
import { type ProductPartType } from './productPart'

export type TransferPackageType = {
  id: number | null;
  items: TransferPackageItemType[];
  name: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TransferPackageItemType = {
  id: number | null;
  transfer_package_id: number | null;
  item: ProductPartType | ProductType | FabricType | null;
  color_id: number | null;
  color: ColorType | null;
  item_id: number | null;
  item_type: 'App\\Models\\Product' | 'App\\Models\\ProductPart' | 'App\\Models\\RawMaterial' | null;
  quantity: number | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export default class TransferPackageAPI extends BaseAPI<TransferPackageType> {
  constructor () {
    super('/transfer-packages')
    this.defaultObject = {
      id: null,
      name: null,
      description: null,
      items: [],
      created_at: null,
      updated_at: null
    }
  }
}
