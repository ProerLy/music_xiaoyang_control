import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
// 引入ELMessage
import { ElMessage } from 'element-plus'

const routes = [
    {
        path: '/login',
        name: 'LoginPage',
        component: () => import('@/components/login/LoginPage.vue'),
        meta: {
            title: '登录',
            transition: 'into'
        }
    },
    {
        path: '/home',
        name: 'homePage',
        component: () => import('@/components/home/homePage.vue'),
        redirect: '/home/house',
        meta: {
            transition: 'into'
        },
        children: [
            {
                path: 'usercontrol/:type/:limit/:search',
                name: 'userControl',
                component: () => import('@/components/home/item/userControl.vue'),
                meta: {
                    title: '用户管理'
                }
            },
            {
                path: 'house',
                name: 'helloPage',
                component: () => import('@/components/home/item/helloPage.vue'),
                meta: {
                    title: '欢迎页'
                }
            },
            {
                path: 'allmusic/:search/:limit',
                name: 'allMusic',
                component: () => import('@/components/home/item/allMusic.vue'),
                meta: {
                    title: '所有音乐'
                }
            },
            {
                path: 'recomment',
                name: 'recommentPage',
                component: () => import('@/components/home/item/recommentPage.vue'),
                meta: {
                    title: '每日推荐'
                }
            },
            {
                path: 'type/:type',
                name: 'type',
                component: () => import('@/components/home/item/typePage.vue'),
                meta: {
                    title: '类型'
                }
            },
            {
                path: 'toplist/:type',
                name: 'topList',
                component: () => import('@/components/home/item/topList.vue'),
                meta: {
                    title: '排行榜'
                }
            },
            {
                path: 'carousel',
                name: 'carouselPage',
                component: () => import('@/components/home/item/carouselPage.vue'),
                meta: {
                    title: '轮播图'
                }
            },
            {
                path: 'post/:search/:limit',
                name: 'postPage',
                component: () => import('@/components/home/item/postPage.vue'),
                meta: {
                    title: '评论管理'
                }
            },
            {
                path: 'msg/:search/:limit',
                name: 'msgPage',
                component: () => import('@/components/home/item/msgPage.vue'),
                meta: {
                    title: '系统消息管理'
                }
            },
            {
                path: 'datacontrol',
                name: 'dataControl',
                component: () => import('@/components/home/item/dataControl.vue'),
                meta: {
                    title: '数据统计'
                }
            }
        ]
    },
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/:pathMatch(.*)',
        name: 'errorPage',
        component: () => import('@/components/errorPage')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
});
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    // 获取本地token
    const token = $cookies.get('user_info')?.token;
    if (!token) {
        ElMessage.error('请登录~');
        setTimeout(() => {
            next('/login');
        }, 1000);
    } else {
        window.document.title = to.meta.title
        next()
    }
})
export default router;

