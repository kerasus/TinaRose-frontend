import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'correspondence',
    name: 'Panel.Correspondence',
    meta: {
      pageCategory: 'مکاتبات'
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: '',
        name: 'Panel.Correspondence.List',
        meta: {
          breadCrumbs: [{ label: 'نامه‌ها' }]
        },
        component: () => import('src/pages/panel/correspondence/list.vue')
      },
      {
        path: 'inbox',
        name: 'Panel.Correspondence.Inbox',
        meta: {
          breadCrumbs: [{ label: 'صندوق ورودی' }]
        },
        component: () => import('src/pages/panel/correspondence/inbox.vue')
      },
      {
        path: 'assignments',
        name: 'Panel.Correspondence.Assignments',
        meta: {
          breadCrumbs: [{ label: 'کارتابل ارجاع‌ها' }]
        },
        component: () => import('src/pages/panel/correspondence/assignments.vue')
      },
      {
        path: 'create',
        name: 'Panel.Correspondence.Create',
        meta: {
          breadCrumbs: [{ label: 'ایجاد پیش‌نویس' }]
        },
        component: () => import('src/pages/panel/correspondence/create.vue')
      },
      {
        path: ':id',
        name: 'Panel.Correspondence.Show',
        meta: {
          breadCrumbs: [{ label: 'جزئیات نامه' }]
        },
        component: () => import('src/pages/panel/correspondence/show.vue')
      }
    ]
  }
]

export default routes
