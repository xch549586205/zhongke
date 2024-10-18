import { createRouter, createWebHistory } from 'vue-router'
import { h, resolveComponent } from 'vue'
export const routes = [
  {
    path: '/login',
    name: 'login',
    hide: true,
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/goodsMng',
    redirect: '/goodsMng/myGoods/onSale?page=1',
    props: true,
    name: '商品管理',
    children: [
      {
        path: '/goodsMng/myGoods',
        props: true,
        name: '我的商品',
        query: { page: 1 },
        redirect: '/goodsMng/myGoods/onSale?page=1',
        component: () => import('../views/goodsMng/myGoods/index.vue'),
        children: [
          {
            path: '/goodsMng/myGoods/onSale',
            name: '在售商品',
            query: { page: 1 },
            props: true,
            hide: true,
            component: () => import('../views/goodsMng/myGoods/onSale/index.vue')
          },
          {
            path: '/goodsMng/myGoods/onSale/goodsDetail',
            name: '添加商品',
            props: true,
            query: { id: '' },
            hide: true,
            component: () => import('../views/goodsMng/myGoods/onSale/goodsDetail/index.vue')
          },
          {
            path: '/goodsMng/myGoods/offShelf',
            hide: true,
            name: '下架商品',
            query: { page: 1 },
            component: () => import('../views/goodsMng/myGoods/onSale/index.vue')
          },
          {
            hide: true,
            path: '/goodsMng/myGoods/drafts',
            name: '草稿箱',
            query: { page: 1 },
            component: () => import('../views/goodsMng/myGoods/drafts/index.vue')
          }
        ]
      },
      {
        path: '/goodsMng/sku',
        name: '商品库存',
        query: { page: 1 },
        component: () => import('../views/goodsMng/sku/index.vue')
      },
      {
        path: '/goodsMng/goodsClassification',
        name: '商品分类',
        query: { page: 1 },
        component: () => import('../views/goodsMng/goodsClassification/index.vue')
      }
    ]
  },
  {
    path: '/enableMng',
    redirect: '/enableMng/banner',
    name: '赋能',
    children: [
      {
        path: '/enableMng/banner',
        name: 'banner管理',
        component: () => import('../views/enableMng/banner/index.vue')
      },
      {
        path: '/enableMng/promotion',
        name: '内容推广',
        component: { render: () => h(resolveComponent('router-view')) },
        children: [
          {
            path: '/enableMng/promotion',
            hide: true,
            name: '内容推广',
            component: () => import('../views/enableMng/promotion/index.vue')
          },
          {
            path: '/enableMng/promotion/categoryContent',
            name: '添加内容',
            hide: true,
            query: { categoryId: '' },
            component: () => import('@/views/enableMng/promotion/categoryContent/index.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/userMng',
    redirect: '/userMng/userList?page=1',
    name: '人员',
    children: [
      {
        path: '/userMng/userList',
        name: '人员管理',
        query: { page: 1 },
        component: () => import('../views/userMng/userList/index.vue')
      },
      {
        path: '/userMng/distributionList',
        name: '下级分销',
        query: { page: 1 },
        component: () => import('../views/userMng/userList/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
