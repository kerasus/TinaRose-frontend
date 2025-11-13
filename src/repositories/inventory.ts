import BaseAPI from './BaseAPI'
import { type UserType } from './user'
import type { ListType } from './BaseAPI'
import type { AxiosResponse } from 'axios'
import type { ColorType } from 'src/repositories/color'
import type { ProductType } from 'src/repositories/product'
import type { RawMaterialType } from 'src/repositories/rawMaterial'
import type { ProductPartType } from 'src/repositories/productPart'

export type InventoryType = {
  id: number | null;
  user: UserType | null;
  user_id: number | null;
  type: inventoryTypeType | null;
  items: InventoryItemType[];
  name: string | null;
  is_locked: boolean | null;
  has_pending_transfers: boolean | null;
  has_open_inventory_count: boolean | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type InventoryItemType = {
  id: number | null;
  inventory_id: number | null;
  item_id: number | null;
  item: ProductPartType | ProductType | RawMaterialType | null;
  item_type: 'App\\Models\\Product' | 'App\\Models\\ProductPart' | 'App\\Models\\RawMaterial' | null;
  type: inventoryTypeType | null;
  color_id: number | null;
  color: ColorType | null;
  quantity: number | null;
  initial_stock: number | null;
  current_stock: number | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type inventoryTypeType = 'fabric_cutter' |'coloring_worker' |'molding_worker' |'assembler' |'central_warehouse'

export type InitializeResponseType = {
  'message': string,
  'created': string[],
  'already_exist': string[],
  'total_created': number,
  'total_existing': number
}

export const inventoryTypeOptions = [
  {
    label: 'برش کاری',
    value: 'fabric_cutter'
  },
  {
    label: 'رنگ کاری',
    value: 'coloring_worker'
  },
  {
    label: 'اتو کاری',
    value: 'molding_worker'
  },
  {
    label: 'مونتاژ کاری',
    value: 'assembler'
  },
  {
    label: 'مرکزی',
    value: 'central_warehouse'
  }
]

export default class InventoryAPI extends BaseAPI<InventoryType> {
  constructor () {
    super('/inventories')
    this.defaultObject = {
      id: null,
      user_id: null,
      user: null,
      type: null,
      name: null,
      items: [],
      is_locked: null,
      has_pending_transfers: null,
      has_open_inventory_count: null,
      description: null,
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      items: (inventoryId: number) => `${this.baseEndpoint}/${inventoryId}/items`,
      destroy: (inventoryId: number, inventoryItemId: number) => `${this.baseEndpoint}/${inventoryId}/items/${inventoryItemId}/destroy`,
      initialize: () => `${this.baseEndpoint}/initialize`
    }
  }

  async getItems (inventoryId: number): Promise<ListType<InventoryItemType>> {
    const response = await this.getAxiosInstanceWithToken()
      .get(this.endpoints.items(inventoryId))

    return {
      data: response.data.data,
      from: response.data.from,
      to: response.data.to,
      current_page: response.data.current_page,
      per_page: response.data.per_page,
      total: response.data.total
    }
  }

  async initializeInventories (): Promise<InitializeResponseType> {
    const response: AxiosResponse<InitializeResponseType> = await this.getAxiosInstanceWithToken()
      .post(this.endpoints.initialize())

    return response.data
  }

  async destroyInventoryItem (inventoryId: number, inventoryItemId: number): Promise<{ message: string }> {
    const response = await this.getAxiosInstanceWithToken()
      .delete(this.endpoints.destroy(inventoryId, inventoryItemId))

    return response.data
  }
}
