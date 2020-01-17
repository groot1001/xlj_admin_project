import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/accounts/company_info',
    // eslint-disable-next-line no-dupe-keys
    component: () => import('@/views/account/index'),
    hidden: true
    // type_nav: 'account',
    // meta: { title: '账户中心', icon: 'iconshezhi' }

  },
  {
    path: '/template_management',
    component: () => import('@/views/template_management/index'),
    hidden: true
  },
  {
    path: '/shop_decoration',
    component: () => import('@/views/shop_decoration/index'),
    hidden: true
  },
  {
    path: '/notice',
    component: () => import('@/views/notice/index'),
    hidden: true
  },

  // {
  //   path: '/dashboard',
  //   component: Layout,
  //   redirect: '/dashboard/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/dashboard/index'),
  //       name: '概览',
  //       meta: { title: '概览', icon: 'dashboard', noCache: true }
  //     }
  //   ]
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/profile',
    hidden: true,
    children: [
      {
        path: 'profile',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '简介', icon: 'user' }/** affix 代表优先启动页*/
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/fastentry',
    component: Layout,
    redirect: '/fastentry/releaseCourse',
    name: '快捷入口',
    meta: {
      title: '快捷入口',
      icon: 'iconfenxiang',
      roles: [5]
    },
    children: [
      {
        path: 'releaseCourse',
        component: () => import('@/views/fastentry/releaseCourse/index'),
        name: '发布课程',
        meta: { title: '发布课程', roles: [5, 6] }
      },
      {
        path: 'releaseHsun',
        component: () => import('@/views/fastentry/releaseHsun/index'),
        name: '发布资讯',
        meta: { title: '发布资讯', roles: [5, 7] }
      },
      {
        path: 'schoolProfile',
        component: () => import('@/views/fastentry/schoolProfile/index'),
        name: '机构简介',
        meta: { title: '机构简介', roles: [5] }
      }
      // ,
      // {
      //   path: 'pictureManangement',
      //   component: () => import('@/views/fastentry/pictureManangement/index'),
      //   name: '图片管理',
      //   meta: { title: '图片管理', role: ['admin', 'editor'] }
      // }

    ]
  },
  {
    path: '/courseManage',
    component: Layout,
    redirect: '/courseManage/conrseInfoManage',
    name: '课程管理',
    meta: {
      title: '课程管理',
      icon: 'iconrili',
      roles: [6]
    },
    children: [
      {
        path: 'releaseConrseInfo',
        component: () => import('@/views/fastentry/releaseCourse/index'),
        name: '发布课程信息',
        meta: { title: '发布课程信息', roles: [5, 6] }
      },
      {
        path: 'conrseInfoManage',
        component: () => import('@/views/courseManage/conrseInfoManage/index'),
        name: '课程信息管理',
        meta: { title: '课程信息管理', roles: [6] }
      }
      // ,
      // {
      //   path: 'addCourseClass',
      //   component: () => import('@/views/courseManage/addCourseClass/index'),
      //   name: '添加课程分类',
      //   meta: { title: '添加课程分类', roles: [6] }
      // },
      // {
      //   path: 'courseClassManage',
      //   component: () => import('@/views/courseManage/courseClassManage/index'),
      //   name: '课程分类管理',
      //   meta: { title: '课程分类管理', roles: [6] }
      // }

    ]
  },
  {
    path: '/infoManage',
    component: Layout,
    redirect: '/infoManage/infoList',
    name: '资讯管理',
    meta: {
      title: '资讯管理',
      icon: 'icondingdan', roles: [7]
    },
    children: [
      {
        path: 'releaseInfo',
        component: () => import('@/views/fastentry/releaseHsun/index'),
        name: '发布资讯2',
        meta: { title: '发布资讯', roles: [5, 7] }
      },
      {
        path: 'infoList',
        component: () => import('@/views/infoManage/infoList/index'),
        name: '资讯列表',
        meta: { title: '资讯列表', roles: [7] }
      }

    ]
  },
  {
    path: '/client',
    component: Layout,
    redirect: '/clientManage/clientOrder',
    name: '客户管理',
    meta: {
      title: '客户管理',
      icon: 'iconshequ', roles: [8]
    },
    children: [
      {
        path: 'clientOrder',
        component: () => import('@/views/clientManage/clientOrder/index'),
        name: '客户订单',
        meta: { title: '客户订单', roles: [8] }
      },
      {
        path: 'addOrder',
        component: () => import('@/views/clientManage/addOrder/index'),
        name: '添加订单',
        meta: { title: '添加订单', roles: [8] }
      },
      {
        path: 'instituteMsgInfo',
        component: () => import('@/views/clientManage/instituteMsgInfo/index'),
        name: '留言管理',
        meta: { title: '留言管理', roles: [8] }
      }
    ]
  },
  {
    path: '/teachers',
    component: Layout,
    redirect: '/teachersManage/teachersList',
    meta: {
      title: '师资管理',
      icon: 'iconfuzhi', roles: [9]
    },
    children: [
      {
        path: 'teachersList',
        component: () => import('@/views/teachersManage/index'),
        name: '师资管理',
        meta: {
          title: '师资管理', roles: [9]
        }
      }
    ]
  },
  {
    path: '/campus',
    component: Layout,
    redirect: '/campusManage/campusList',
    meta: {
      title: '校区管理',
      icon: 'iconshangquan', roles: [10]
    },
    children: [
      {
        path: 'campusList',
        component: () => import('@/views/campusManage/index'),
        name: '校区列表',
        meta: {
          title: '校区列表', roles: [10]
        }
      }
    ]
  },
  {
    path: '/accountManage',
    component: Layout,
    redirect: '/accountManage/accounList',
    meta: {
      title: '账号管理',
      icon: 'iconanquan', roles: [11]
    },
    children: [
      {
        path: 'accounList',
        component: () => import('@/views/accountManage/index'),
        name: '账号列表',
        meta: {
          title: '账号列表', roles: [11]
        }
      }
    ]
  },
  {
    path: '/accounts',
    component: Layout,
    redirect: '/accounts/company_info',
    hidden: true,
    type_nav: 'account',
    meta: { title: '账户中心', icon: 'iconshezhi', roles: [12, 17] },
    children: [
      {
        path: 'company_info',
        component: () => import('@/views/account/company_info/index'),
        name: '公司信息',
        type_nav: 'account',
        meta: {
          title: '公司信息', roles: [12]
        }
      },
      {
        path: 'uplaccountcode',
        component: () => import('@/views/account/uplAccountCode/index'),
        name: '修改密码',
        type_nav: 'account',
        meta: {
          title: '修改密码', roles: [17]
        }
      },
      {
        path: 'qualifications',
        component: () => import('@/views/account/qualifications/index'),
        name: '公司信息',
        type_nav: 'account',
        meta: {
          title: '资质证书', roles: [17]
        }
      }
    
    ]
  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'Page Permission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'Directive Permission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'Role Permission',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },
  /** when your routing map is too long, you can split it into small modules当路由图太长时，可以将其拆分为小模块。侧栏菜单**/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'Create Article', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'Article List', icon: 'list' }
  //     }
  //   ]
  // },

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'Tab', icon: 'tab' }
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Error Log', icon: 'bug' }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' }
  //     }
  //   ]
  // },

  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'Theme', icon: 'theme' }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
