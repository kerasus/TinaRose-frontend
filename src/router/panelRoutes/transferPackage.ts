import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'transfer-package',
    name: 'Panel.TransferPackage',
    meta: {
      pageCategory: 'حواله ها'
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: '',
        name: 'Panel.TransferPackage.List',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست'
            }
          ]
        },
        component: () => import('src/pages/panel/transferPackage/list.vue')
      },
      {
        path: 'create',
        name: 'Panel.TransferPackage.Create',
        meta: {
          breadCrumbs: [
            {
              label: 'پک حواله جدید'
            }
          ]
        },
        component: () => import('src/pages/panel/transferPackage/create.vue')
      },
      {
        path: ':id',
        name: 'Panel.TransferPackage.Show',
        meta: {
          breadCrumbs: [
            {
              label: 'مشاهده'
            }
          ]
        },
        component: () => import('src/pages/panel/transferPackage/show.vue')
      },
      {
        path: ':id/edit',
        name: 'Panel.TransferPackage.Edit',
        meta: {
          breadCrumbs: [
            {
              label: 'ویرایش'
            }
          ]
        },
        component: () => import('src/pages/panel/transferPackage/edit.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
