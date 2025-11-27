import BaseAPI, { ListType } from './BaseAPI'
import { type UserType } from './user'
import { type ColorType } from './color'
import { type FabricType } from './fabric'
import { type ProductType } from './product'
import { type ProductPartType } from './productPart'
import type { AxiosResponse } from 'axios'

export type ProductionType = {
  id: number | null;
  user: UserType | null;
  user_id: number | null;
  product: ProductType | null;
  product_part: ProductPartType | null;
  product_part_id: number | null;
  fabric: FabricType | null;
  fabric_id: number | null;
  color: ColorType | null;
  color_id: number | null;
  production_date: string | null;
  bunch_count: number | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ProductionSummaryFilter = {
  role?: string;
  production_date?: string;
  product_part_id?: string;
}

export interface SummaryType {
  product_part_name: string;
  color_name: string;
  fabric_name: string;
  total_bunch: number;
  total_petals: number;
}

export interface UserSummaryType extends SummaryType {
  user_id: number;
  employee_code: string;
  firstname: string;
  lastname: string;
  username: number;
}

export default class ProductionAPI extends BaseAPI<ProductionType> {
  constructor () {
    super('/productions')
    this.defaultObject = {
      id: null,
      user: null,
      user_id: null,
      product: null,
      product_part: null,
      product_part_id: null,
      fabric: null,
      fabric_id: null,
      color: null,
      color_id: null,
      production_date: null,
      bunch_count: null,
      description: null,
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      summary: `${this.baseEndpoint}/summary`,
      userSummary: `${this.baseEndpoint}/user-summary`,
      summaryExport: `${this.baseEndpoint}/summary-export`,
      userSummaryExport: `${this.baseEndpoint}/user-summary-export`
    }
  }

  async summary (filter: ProductionSummaryFilter): Promise<ListType<SummaryType>> {
    try {
      const response: AxiosResponse<ListType<SummaryType>> =
        await this.getAxiosInstanceWithToken()
          .get(this.endpoints.summary, { params: filter })
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('An unknown error occurred on updateBalance')
      }
    }
  }

  async userSummary (filter: ProductionSummaryFilter): Promise<ListType<UserSummaryType>> {
    try {
      const response: AxiosResponse<ListType<UserSummaryType>> =
        await this.getAxiosInstanceWithToken()
          .get(this.endpoints.userSummary, { params: filter })
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('An unknown error occurred on updateBalance')
      }
    }
  }

  async summaryExport (filter: ProductionSummaryFilter): Promise<{ blob: Blob, filename: string}> {
    let filename = 'گزارش-تولید-' + new Date().toISOString().slice(0, 10) + '.csv'
    return this.export(this.endpoints.summaryExport, filter, filename)
  }

  async userSummaryExport (filter: ProductionSummaryFilter): Promise<{ blob: Blob, filename: string}> {
    let filename = 'گزارش-تولید-کاربر' + new Date().toISOString().slice(0, 10) + '.csv'
    return this.export(this.endpoints.userSummaryExport, filter, filename)
  }

  private async export (endpoint: string, filter: ProductionSummaryFilter, defaultFailName: string) {
    try {
      const response = await this.getAxiosInstanceWithToken().get(endpoint, {
        params: filter,
        responseType: 'blob'
      })
      const contentDisposition = response.headers['content-disposition']
      let filename = defaultFailName

      if (contentDisposition) {
        const parts = contentDisposition.split(';')
        for (const part of parts) {
          const trimmedPart = part.trim()
          if (trimmedPart.startsWith('filename=')) {
            filename = trimmedPart.substring(9).replace(/"/g, '')
            break
          }
          if (trimmedPart.startsWith('filename*=')) {
            filename = decodeURIComponent(trimmedPart.substring(10).split("''")[1])
            break
          }
        }
      }

      return {
        blob: new Blob([response.data], { type: 'text/csv;charset=utf-8;' }),
        filename
      }

    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('An unknown error occurred on updateBalance')
      }
    }
  }
}
