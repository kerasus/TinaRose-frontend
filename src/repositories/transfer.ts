import BaseAPI from './BaseAPI';
import { type UserType } from './user';
import { type FabricType } from './fabric';
import { type ProductType } from './product';
import { type ProductPartType } from './productPart';

export type TransferType = {
  id: number | null;
  from_user_id: number | null;
  from_user: UserType | null;
  to_user_id: number | null;
  to_user: UserType | null;
  from_inventory_id: number | null;
  to_inventory_id: number | null;
  items: TransferItemType[];
  transfer_date: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TransferItemType = {
  id: number | null;
  transfer_id: number | null;
  item: ProductPartType | ProductType | FabricType | null;
  item_id: number | null;
  item_type: 'App\\Models\\Product' | 'App\\Models\\ProductPart' | 'App\\Models\\RawMaterial' | null;
  quantity: number | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TransferSummaryFilter = {
  role?: string;
  production_date?: string;
  product_part_id?: string;
}

export default class TransferAPI extends BaseAPI<TransferType> {
  constructor() {
    super('/transfers');
    this.defaultObject = {
      id: null,
      from_user_id: null,
      from_user: null,
      to_user_id: null,
      to_user: null,
      from_inventory_id: null,
      to_inventory_id: null,
      items: [],
      transfer_date: null,
      description: null,
      created_at: null,
      updated_at: null
    };
    this.endpoints = {
      ...this.endpoints,
      items: (transferId: number) => `${this.baseEndpoint}/${transferId}/items`,
      itemById: (transferId: number, itemId: number) => `${this.baseEndpoint}/${transferId}/items/${itemId}`
    }
  }

  async addItem(transferId: number, itemDate: TransferItemType): Promise<void> {
    await this.getAxiosInstanceWithToken()
      .post(this.endpoints.items(transferId), itemDate);
  }

  async removeItem(transferId: number, itemId: number): Promise<void> {
    await this.getAxiosInstanceWithToken()
      .delete(this.endpoints.itemById(transferId, itemId));
  }
}
