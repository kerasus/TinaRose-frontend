import BaseAPI from './BaseAPI'
import { type UserType } from './user'
import { type ColorType } from './color'
import { type FabricType } from './fabric'
import { type ProductType } from './product'
import { type ProductPartType } from './productPart'

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
  status: TransferStatusType | null;
  status_label: string | null;
  description: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TransferStatusType = 'pending' | 'approved' | 'rejected';

export const transferStatusOptions: { label: string, value: TransferStatusType }[] = [
  {
    label: 'تایید شده',
    value: 'approved'
  },
  {
    label: 'در انتظار تایید',
    value: 'pending'
  },
  {
    label: 'لغو شده',
    value: 'rejected'
  }
]

export type TransferItemType = {
  id: number | null;
  transfer_id: number | null;
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

export type TransferSummaryFilter = {
  role?: string;
  production_date?: string;
  product_part_id?: string;
}

export default class TransferAPI extends BaseAPI<TransferType> {
  constructor () {
    super('/transfers')
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
      status: null,
      status_label: null,
      description: null,
      approved_at: null,
      rejected_at: null,
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      approve: (transferId: number) => `${this.baseEndpoint}/${transferId}/approve`,
      reject: (transferId: number) => `${this.baseEndpoint}/${transferId}/reject`,
      items: (transferId: number) => `${this.baseEndpoint}/${transferId}/items`,
      itemById: (transferId: number, itemId: number) => `${this.baseEndpoint}/${transferId}/items/${itemId}`
    }
  }

  async addItem (transferId: number, itemDate: TransferItemType): Promise<void> {
    await this.getAxiosInstanceWithToken()
      .post(this.endpoints.items(transferId), itemDate)
  }

  async approve (transferId: number): Promise<{ message: string }> {
    const response = await this.getAxiosInstanceWithToken()
      .post(this.endpoints.approve(transferId))

    return response.data
  }

  async reject (transferId: number): Promise<{ message: string }> {
    const response = await this.getAxiosInstanceWithToken()
      .post(this.endpoints.reject(transferId))

    return response.data
  }

  async removeItem (transferId: number, itemId: number): Promise<void> {
    await this.getAxiosInstanceWithToken()
      .delete(this.endpoints.itemById(transferId, itemId))
  }
}
