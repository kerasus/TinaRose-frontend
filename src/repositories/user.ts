import BaseAPI, { type ListType } from './BaseAPI'
import type { AxiosResponse } from 'axios'

export type WorkerRoleType = 'molding' | 'coloring' | 'fabric-cutter' | 'assembler'
export type UserRolesForPathType = 'manager' | 'product-manager' | 'accountant' | 'molding' | 'coloring' | 'fabric-cutter' | 'middle' | 'assembler' | 'warehouse-keeper'
export type UserRolesType = 'Manager' | 'SalesManager' | 'ProductManager' | 'Accountant' | 'MoldingWorker' | 'ColoringWorker' | 'FabricCutter' | 'MiddleWorker' | 'Assembler' | 'WarehouseKeeper'

export const userRoleOptions = [
  { label: 'مدیر', value: 'Manager', roleForPath: 'manager' },
  { label: 'مدیر فروش', value: 'SalesManager', roleForPath: 'Sales-manager' },
  { label: 'مدیر محصول', value: 'ProductManager', roleForPath: 'product-manager' },
  { label: 'حسابدار', value: 'Accountant', roleForPath: 'accountant' },
  { label: 'وسط کار', value: 'MiddleWorker', roleForPath: 'middle' },
  { label: 'انباردار', value: 'WarehouseKeeper', roleForPath: 'warehouse-keeper' },
  { label: 'برش کار', value: 'FabricCutter', roleForPath: 'fabric-cutter' },
  { label: 'رنگ کار', value: 'ColoringWorker', roleForPath: 'coloring' },
  { label: 'اتو کار', value: 'MoldingWorker', roleForPath: 'molding' },
  { label: 'مونتاژ کار', value: 'Assembler', roleForPath: 'assembler' }
]

export type RoleType = {
  id: number | null;
  name: string | null;
  label: string | null;
  guard_name: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type UserOptionRoleType = {
  id: number
  name: string
}

export type UserOptionType = {
  id: number
  firstname: string | null
  lastname: string | null
  employee_code: string | null
  roles: UserOptionRoleType[]
}

export type UserType = {
  id: number | null;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  username: string | null;
  employee_code: string | null;
  mobile: string | null;
  roles_list: string[];
  roles: RoleType[];
  email_verified_at: string | null;
  mobile_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export function getUserRoleLabel (roleName: string): string {
  const targetRole = userRoleOptions.find((item)=>item.value === roleName)
  if (targetRole) {
    return targetRole.label
  }

  return roleName
}

export function getUserRolesForPathLabel (roleName: UserRolesForPathType): string {
  const targetRole = userRoleOptions.find((item)=>item.roleForPath === roleName)
  if (targetRole) {
    return targetRole.label
  }

  return roleName
}

export function userRolesToUserRolesForPath (roleName: UserRolesType): UserRolesForPathType | null {
  const targetRole = userRoleOptions.find((item)=>item.value === roleName)
  if (targetRole) {
    return targetRole.roleForPath as UserRolesForPathType
  }

  return null
}

export default class UserAPI extends BaseAPI<UserType> {
  constructor () {
    super('/users')
    this.defaultObject = {
      id: null,
      firstname: null,
      lastname: null,
      email: null,
      username: null,
      employee_code: null,
      mobile: null,
      roles: [],
      roles_list: [],
      email_verified_at: null,
      mobile_verified_at: null,
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      options: `${this.baseEndpoint}/light`,
      basic: (id: number) => `${this.baseEndpoint}/${id}/basic`,
      assignRole: (userId: number) => `${this.baseEndpoint}/${userId}/assign-role`,
      removeRole: (userId: number) => `${this.baseEndpoint}/${userId}/remove-role`,
      resetPassword: (userId: number) => `${this.baseEndpoint}/${userId}/reset-password`
    }
  }

  async lightIndex (filters: any = { length: 10 }): Promise<ListType<UserOptionType>> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.options, { params: filters })
    return response.data as ListType<UserOptionType>
  }

  async getBasic (id: number): Promise<UserOptionType> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.basic(id))
    return response.data as UserOptionType
  }

  async assignRole (userId: number, role: string): Promise<{ message: string, data: { user: UserType }}> {
    try {
      const response: AxiosResponse<{ message: string, data: { user: UserType }}> = await this.getAxiosInstanceWithToken()
        .post(this.endpoints.assignRole(userId), { role })
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('An unknown error occurred on updateBalance')
      }
    }
  }

  async removeRole (userId: number, role: string): Promise<{ message: string, data: { user: UserType }}> {
    try {
      const response: AxiosResponse<{ message: string, data: { user: UserType }}> = await this.getAxiosInstanceWithToken()
        .post(this.endpoints.removeRole(userId), { role })
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('An unknown error occurred on updateBalance')
      }
    }
  }

}
