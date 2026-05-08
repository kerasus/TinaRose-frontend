import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'equipment',
    name: 'Panel.Equipment',
    meta: {
      pageCategory: 'تجهیزات'
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: '',
        name: 'Panel.Equipment.List',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست'
            }
          ]
        },
        component: () => import('src/pages/panel/equipment/list.vue')
      },
      {
        path: 'create',
        name: 'Panel.Equipment.Create',
        meta: {
          breadCrumbs: [
            {
              label: 'جدید'
            }
          ]
        },
        component: () => import('src/pages/panel/equipment/create.vue')
      },
      {
        path: ':id',
        name: 'Panel.Equipment.Show',
        meta: {
          breadCrumbs: [
            {
              label: 'مشاهده'
            }
          ]
        },
        component: () => import('src/pages/panel/equipment/show.vue')
      },
      {
        path: ':id/edit',
        name: 'Panel.Equipment.Edit',
        meta: {
          breadCrumbs: [
            {
              label: 'ویرایش'
            }
          ]
        },
        component: () => import('src/pages/panel/equipment/edit.vue')
      }
    ]
  }
]

export default routes
