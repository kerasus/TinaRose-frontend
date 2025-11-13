import userRoutes from './user'
import colorRoutes from './color'
import fabricRoutes from './fabric'
import reportRoutes from './report'
import productRoutes from './product'
import TransferRoutes from './transfer'
import inventoryRoutes from './inventory'
import productionRoutes from './production'
import rawMaterialRoutes from './rawMaterial'
import productPartRoutes from './productPart'
import type { RouteRecordRaw } from 'vue-router'
import inventoryCountRoutes from './inventoryCount'
import TransferPackageRoutes from './transferPackage'
import Authenticated from 'src/router/middleware/Authenticated'

export const index: RouteRecordRaw[] = [
  {
    path: 'panel',
    meta: {
      middleware: [Authenticated],
      layoutConfig: {
        // layoutHeader: false,
        // layoutLeftDrawer: false,
        // layoutRightDrawer: false,
        // layoutFooter: false
      }
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Panel.Dashboard',
        meta: {
          pageCategory: 'داشبورد'
        },
        component: () => import('src/pages/panel/dashboard.vue')
      },
      {
        path: 'staff-dashboard',
        name: 'Panel.WorkerDashboard',
        meta: {
          pageCategory: 'داشبورد'
        },
        component: () => import('src/pages/panel/workerDashboard.vue')
      },

      ...userRoutes,
      ...colorRoutes,
      ...fabricRoutes,
      ...reportRoutes,
      ...productRoutes,
      ...TransferRoutes,
      ...inventoryRoutes,
      ...productionRoutes,
      ...rawMaterialRoutes,
      ...productPartRoutes,
      ...inventoryCountRoutes,
      ...TransferPackageRoutes
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]
