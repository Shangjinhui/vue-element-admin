import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration NProgress配置

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist在白名单重定向中（就是不用登陆也能打开的，比如登录页）

router.beforeEach(async(to, from, next) => {
  // to是当前路由，别弄反了
  console.log('to,from', to, from)
  // start progress bar
  NProgress.start() // 浏览器顶部的载入动画

  // set page title
  document.title = getPageTitle(to.meta.title) // 设置页面名字

  // determine whether the user has logged in
  const hasToken = getToken() // cookie中获取token
  // -==============================================================================================================
  // 1先判断是否有token，没有则判断是否在登录白名单中（在：则next()可打开。不在则跳频道登录页并将重定向to.path拼到路径上，具体使用请看登录的js）
  // 2当有token时再判断是否路由是登陆页的，是的话跳到首页（防止重复打开登录页登录），不是的话在判断角色身份
  // 3
  // 4store.dispatch('user/getInfo')此操作可使再仓库那调用了获取userinfo的接口（具体请看该仓库）
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      console.log('用户身份', store.getters.roles)// 获取角色身份
      // determine whether the user has obtained his permission roles through getInfo确定用户是否已通过getInfo获得其权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      console.log(hasRoles)
      if (hasRoles) {
        // 有身份，说明处理过路由了
        next()
      } else {
        // 没身份，根据token获取身份，处理路由
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          // 仓库中的action=》generateRoutes是通过角色身份对路由进行的处理并赋值仓库数据permission_routes（用来循环生成菜单导航的，请看layout里的菜单导航）
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          console.log('处理后的动态路由，为什么不是全部因为仓库那generateRoutes resolve返回的就是这个，但经过了action仓库里的state.routes是全部的', accessRoutes)
          // console.log('addRoutes前',router)
          router.addRoutes(accessRoutes)// 将处理过的动态路由拼接到固定路由上---------------------------------------------------------------------
          // console.log('addRoutes后',router)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })// replace: true跳转后浏览器无退回按钮
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
