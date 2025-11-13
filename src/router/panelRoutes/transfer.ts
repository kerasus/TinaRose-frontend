import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'transfers',
    name: 'Panel.Transfer',
    meta: {
      pageCategory: 'حواله ها'
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: '',
        name: 'Panel.Transfer.List',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست'
            }
          ]
        },
        component: () => import('src/pages/panel/transfer/list.vue')
      },
      {
        path: 'create',
        name: 'Panel.Transfer.Create',
        meta: {
          breadCrumbs: [
            {
              label: 'حواله جدید'
            }
          ]
        },
        component: () => import('src/pages/panel/transfer/create.vue')
      },
      {
        path: ':id',
        name: 'Panel.Transfer.Show',
        meta: {
          breadCrumbs: [
            {
              label: 'مشاهده'
            }
          ]
        },
        component: () => import('src/pages/panel/transfer/show.vue')
      }
      // {
      //   path: ':id/edit',
      //   name: 'Panel.Transfer.Edit',
      //   meta: {
      //     breadCrumbs: [
      //       {
      //         label: 'ویرایش',
      //       },
      //     ],
      //   },
      //   component: () => import('src/pages/panel/transfer/edit.vue'),
      // }
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
