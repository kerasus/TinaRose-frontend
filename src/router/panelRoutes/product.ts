import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: 'product',
    name: 'Panel.Product',
    meta: {
      pageCategory: 'محصول',
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: '',
        name: 'Panel.Product.List',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست',
            },
          ],
        },
        component: () => import('src/pages/panel/product/list.vue'),
      },
      {
        path: 'create',
        name: 'Panel.Product.Create',
        meta: {
          breadCrumbs: [
            {
              label: 'جدید',
            },
          ],
        },
        component: () => import('src/pages/panel/product/create.vue'),
      },
      {
        path: ':id',
        name: 'Panel.Product.Show',
        meta: {
          breadCrumbs: [
            {
              label: 'مشاهده',
            },
          ],
        },
        component: () => import('src/pages/panel/product/show.vue'),
      },
      {
        path: ':id/edit',
        name: 'Panel.Product.Edit',
        meta: {
          breadCrumbs: [
            {
              label: 'ویرایش',
            },
          ],
        },
        component: () => import('src/pages/panel/product/edit.vue'),
      }
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
