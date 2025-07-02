import BaseAPI from './BaseAPI';
import { type UserType } from './user';
import { type ColorType } from './color';
import { type FabricType } from './fabric';
import { type ProductPartType } from './productPart';
import type { AxiosResponse } from 'axios';

export type ProductionType = {
  id: number | null;
  user: UserType | null;
  user_id: number | null;
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

export default class ProductionAPI extends BaseAPI<ProductionType> {
  constructor() {
    super('/productions');
    this.defaultObject = {
      id: null,
      user: null,
      user_id: null,
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
    };
    this.endpoints = {
      ...this.endpoints,
      summary: `${this.baseEndpoint}/summary`,
      summaryExport: `${this.baseEndpoint}/summary-export`
    }
  }

  async summary(filter: ProductionSummaryFilter): Promise<{ message: string, data: { user: ProductionType }}> {
    try {
      const response: AxiosResponse<{ message: string, data: { user: ProductionType }}> = await this.getAxiosInstanceWithToken()
        .get(this.endpoints.summary, { params: filter });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred on updateBalance');
      }
    }
  }

  async summaryExport(filter: ProductionSummaryFilter): Promise<{ blob: Blob, filename: string}> {
    try {
      const response = await this.getAxiosInstanceWithToken().get(this.endpoints.summaryExport, {
        params: filter,
        responseType: 'blob'
      });
      // const contentDisposition = response.headers['content-disposition'];
      const filename = 'گزارش-تولید.xlsx';

      // if (contentDisposition) {
      //   const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      //   if (fileNameMatch.length > 1) {
      //     filename = fileNameMatch[1];
      //   }
      // }

      return {
        blob: new Blob([response.data]),
        filename
      }

    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred on updateBalance');
      }
    }
  }

}
