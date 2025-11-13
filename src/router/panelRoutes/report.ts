import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'reports',
    name: 'Panel.Report',
    meta: {
      pageCategory: 'گزارشات'
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: '',
        name: 'Panel.Report.Productions',
        meta: {
          breadCrumbs: [
            {
              label: 'تولیدات'
            }
          ]
        },
        component: () => import('src/pages/panel/report/productions.vue')
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
