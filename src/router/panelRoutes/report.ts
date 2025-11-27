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
        path: 'total-productions',
        name: 'Panel.Report.TotalProductions',
        meta: {
          breadCrumbs: [
            {
              label: 'تولیدات کلی'
            }
          ]
        },
        component: () => import('pages/panel/report/totalProductions.vue')
      },
      {
        path: 'user-productions',
        name: 'Panel.Report.UserProductions',
        meta: {
          breadCrumbs: [
            {
              label: 'تولیدات کارمندان'
            }
          ]
        },
        component: () => import('pages/panel/report/userProductions.vue')
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
