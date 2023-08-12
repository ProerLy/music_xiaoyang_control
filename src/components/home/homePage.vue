<template>
    <el-container :direction="vertical">
        <el-header height="60px">
            <topNav />
        </el-header>
        <el-container :direction="horizontal" id="content">
            <!-- 左侧导航栏 -->
            <el-aside :width="!isShow ? '200px' : '65px'">
                <menuNav @collect="getcollect" />
            </el-aside>
            <!-- 右侧内容 -->
            <el-container :direction="vertical" id="contents">
                <el-main height="">
                    <el-card shadow="always" :body-style="{ padding: '20px' }">
                        <el-breadcrumb separator-class="el-icon-arrow-right" separator=">">
                            <el-breadcrumb-item :to="{ path: '/home/house' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item v-for="it in paths" :key="it.tabel">{{ it.tabel
                            }}</el-breadcrumb-item>
                        </el-breadcrumb>
                        <router-view v-slot="{ Component }">
                            <transition name="face">
                                <component :is="Component"></component>
                            </transition>
                        </router-view>
                    </el-card>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>
<script>
export default {
    name: 'homePage'
}
</script>
<script setup>
import { onMounted, watch, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import menuNav from '@/components/component/menuNav'
import topNav from '@/components/component/topNav'
const router = useRouter();
const route = useRoute();
// 判断是否以登录
const login = () => {
    if (!$cookies.get('user_info')) {
        ElMessage.error('暂无登录，将被强制退出后台系统！');
        setTimeout(() => {
            router.replace('/login');
        }, 2000);
    }
}
// 面包屑
let paths = reactive([{
    tabel: null,
    path: null
}])

let isShow = ref(false);
// 获取menu传递的值
const getcollect = (e) => {
    isShow.value = e;
}
// 页面加载完毕时进行登录验证
onMounted(() => {
    login();
    getBread(route.path);
})

// 获取bread
const getBread = (e) => {
    switch (e.split('/')[2]) {
        case 'usercontrol':
            paths[0] = {
                tabel: '用户管理',
                path: null
            }
            paths[1] = {
                tabel: '用户编辑',
                path: null
            }
            break;
        case 'allmusic':
            paths[0] = {
                tabel: '音乐管理',
                path: null
            }
            paths[1] = {
                tabel: '所有音乐',
                path: null
            }
            break;
        case 'type':
            paths[0] = {
                tabel: '音乐管理',
                path: null
            }
            paths[1] = {
                tabel: '类型',
                path: null
            }
            break;
        case 'toplist':
            paths[0] = {
                tabel: '音乐管理',
                path: null
            }
            paths[1] = {
                tabel: '排行榜',
                path: null
            }
            break;
        case 'carousel':
            paths[0] = {
                tabel: '音乐管理',
                path: null
            }
            paths[1] = {
                tabel: '轮播图',
                path: null
            }
            break;
        case 'recomment':
            paths[0] = {
                tabel: '音乐管理',
                path: null
            }
            paths[1] = {
                tabel: '每日推荐',
                path: null
            }
            break;
        case 'post':
            paths[0] = {
                tabel: '信息管理管理',
                path: null
            }
            paths[1] = {
                tabel: '评论管理',
                path: null
            }
            break;
        case 'msg':
            paths[0] = {
                tabel: '信息管理',
                path: null
            }
            paths[1] = {
                tabel: '系统信息管理',
                path: null
            }
            break;
        case 'datacontrol':
            paths[0] = {
                tabel: '数据统计',
                path: null
            }
            paths[1] = {
                tabel: '音乐统计',
                path: null
            }
            break;
        case 'house':
            paths[0] = {
                tabel: '欢迎页',
                path: null
            }
            paths.splice(1,1);
            break;
    }
}

watch(() => route.path, (e) => {
    getBread(e);
})
</script>
<style lang="less" scoped>
@h: 60px;

.el-container {
    height: 100%;

    .el-header {
        margin-bottom: 10px;
        height: @h;
    }

    #content {
        height: calc(100vh - @h - 10px);

        .el-breadcrumb {
            padding: 10px;
            background-color: #ffffff;
            border-bottom: 1px solid rgba(0, 0, 0, .2);
            margin-bottom: 10px;
        }

        .el-main {
            background-color: #ffffff;
        }
    }
}
</style>