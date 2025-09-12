import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: 'row-material',
    name: 'Panel.RawMaterial',
    meta: {
      pageCategory: 'مواد اولیه',
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: '',
        name: 'Panel.RawMaterial.List',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست',
            },
          ],
        },
        component: () => import('src/pages/panel/rawMaterial/list.vue'),
      },
      {
        path: 'create',
        name: 'Panel.RawMaterial.Create',
        meta: {
          breadCrumbs: [
            {
              label: 'جدید',
            },
          ],
        },
        component: () => import('src/pages/panel/rawMaterial/create.vue'),
      },
      {
        path: ':id',
        name: 'Panel.RawMaterial.Show',
        meta: {
          breadCrumbs: [
            {
              label: 'مشاهده',
            },
          ],
        },
        component: () => import('src/pages/panel/rawMaterial/show.vue'),
      },
      {
        path: ':id/edit',
        name: 'Panel.RawMaterial.Edit',
        meta: {
          breadCrumbs: [
            {
              label: 'ویرایش',
            },
          ],
        },
        component: () => import('src/pages/panel/rawMaterial/edit.vue'),
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
