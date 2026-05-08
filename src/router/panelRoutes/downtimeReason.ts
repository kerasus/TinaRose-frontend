import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'downtime-reason',
    name: 'Panel.DowntimeReason',
    meta: {
      pageCategory: 'دلایل توقف'
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: '',
        name: 'Panel.DowntimeReason.List',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست'
            }
          ]
        },
        component: () => import('src/pages/panel/downtimeReason/list.vue')
      },
      {
        path: 'create',
        name: 'Panel.DowntimeReason.Create',
        meta: {
          breadCrumbs: [
            {
              label: 'جدید'
            }
          ]
        },
        component: () => import('src/pages/panel/downtimeReason/create.vue')
      },
      {
        path: ':id',
        name: 'Panel.DowntimeReason.Show',
        meta: {
          breadCrumbs: [
            {
              label: 'مشاهده'
            }
          ]
        },
        component: () => import('src/pages/panel/downtimeReason/show.vue')
      },
      {
        path: ':id/edit',
        name: 'Panel.DowntimeReason.Edit',
        meta: {
          breadCrumbs: [
            {
              label: 'ویرایش'
            }
          ]
        },
        component: () => import('src/pages/panel/downtimeReason/edit.vue')
      }
    ]
  }
]

export default routes
