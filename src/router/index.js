import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/mainPage',
    name: 'main-page',
    component: require('@/components/MainPage').default
  },
  {
    path: '/',
    name: 'read-books',
    component: require('@/components/ReadBooks').default
  },
  {
    path: '/bookReader',
    name: 'bookReader',
    component: require('@/components/BookReader').default
  },
  {
    path: '/bookCreator',
    name: 'bookCreator',
    component: require('@/components/BookCreator').default
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes
})

export default router
