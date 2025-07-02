import userRoutes from './user';
import colorRoutes from './color';
import fabricRoutes from './fabric';
import productionRoutes from './production';
import productPartRoutes from './productPart';
import type { RouteRecordRaw } from 'vue-router';
import Authenticated from 'src/router/middleware/Authenticated';

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
      },
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Panel.Dashboard',
        meta: {
          pageCategory: 'داشبورد',
        },
        component: () => import('src/pages/panel/dashboard.vue'),
      },

      ...userRoutes,
      ...colorRoutes,
      ...fabricRoutes,
      ...productionRoutes,
      ...productPartRoutes,
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];
