import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: 'inventories',
    name: 'Panel.Inventory',
    meta: {
      pageCategory: 'حواله ها',
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: '',
        name: 'Panel.Inventory.List',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست',
            },
          ],
        },
        component: () => import('src/pages/panel/inventory/list.vue'),
      },
      {
        path: ':id',
        name: 'Panel.Inventory.Show',
        meta: {
          breadCrumbs: [
            {
              label: 'مشاهده',
            },
          ],
        },
        component: () => import('src/pages/panel/inventory/show.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
