import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      children: [
        { path: '/index', name: 'Index', component: () => import('@/views/Index.vue') },
        { path: '/manage', name: 'manage', component: () => import('@/views/resourceManage/manage.vue') },
        { path: '/addResource', name: 'addResource', component: () => import('@/views/resourceManage/addResource.vue') },
        { path: '/resDigital', name: 'resDigital', component: () => import('@/views/resourceManage/resDigital.vue') },
        { path: '/sort', name: 'sort', component: () => import('@/views/sort.vue') },
        { path: '/advert', name: 'advert', component: () => import('@/views/advert/advert.vue') },
        { path: '/digital', name: 'digital', component: () => import('@/views/digitalData.vue') },
        { path: '/userInfor', name: 'userInfor', component: () => import('@/views/userInfor.vue') },
        { path: '/report', name: 'report', component: () => import('@/views/report.vue') }
      ]
    },
    { path: '/watchWin', name: 'watchWin', component: () => import('@/views/watchWin.vue') },
    { path: '/login', name: 'login', component: () => import('@/views/login.vue') },
    { path: '/test', name: 'test', component: () => import('@/views/test.vue') }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to, from)
  /* eslint-disable */
  var checkStorage = sessionStorage.getItem('user')
  if (checkStorage == null) {
    // 判断store.gettes.idLogin === false
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
    return
  } else {
    next()
    return
  }
})

export default router
