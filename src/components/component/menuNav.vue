<template>
    <el-menu router text-color="#ffffff" active-text-color="#FFD04B" background-color="#1E1E1E" mode="vertical"
        :default-active="decodeURI($route.path)" class="el-menu-vertical-demo" :collapse="isShow" :collapse-transition="false">
        <el-menu-item style="display: flex; justify-content: center;" @click="toCollect">
            <el-icon>
                <Coin />
            </el-icon>
        </el-menu-item>
        <el-sub-menu index="0">
            <template #title><el-icon>
                    <HomeFilled />
                </el-icon><span>首页</span></template>
            <el-menu-item index="/home/house">
                <template #title>
                    <el-icon>
                        <House />
                    </el-icon>
                    <span>欢迎页</span>
                </template>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="1">
            <template #title><el-icon>
                    <Avatar />
                </el-icon><span>用户管理</span></template>
            <el-menu-item @click="$router.push('/home/usercontrol/0/0/null')"
                :index="'/home/usercontrol/' + $route.params.type + '/' + $route.params.limit + '/' + $route.params.search">
                <template #title>
                    <el-icon>
                        <User />
                    </el-icon>
                    <span>用户编辑</span>
                </template>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
            <template #title><el-icon>
                    <Headset />
                </el-icon><span>音乐管理</span></template>
            <el-menu-item @click="$router.push('/home/allmusic/' + null + '/0')"
                :index="'/home/allmusic/' + $route.params.search + '/' + $route.params.limit">
                <template #title>
                    <el-icon>
                        <Grid />
                    </el-icon>
                    <span>所有音乐</span>
                </template>
            </el-menu-item>
            <el-menu-item @click="$router.push('/home/type/1')" :index="'/home/type/' + $route.params.type">
                <template #title>
                    <el-icon>
                        <Menu />
                    </el-icon>
                    <span>类型</span>
                </template>
            </el-menu-item>
            <el-menu-item @click="$router.push('/home/toplist/1')" :index="'/home/toplist/' + $route.params.type">
                <template #title>
                    <el-icon>
                        <Histogram />
                    </el-icon>
                    <span>排行榜</span>
                </template>
            </el-menu-item>
            <el-menu-item index="/home/carousel">
                <template #title>
                    <el-icon>
                        <SwitchFilled />
                    </el-icon>
                    <span>轮播图</span>
                </template>
            </el-menu-item>
            <el-menu-item index="/home/recomment">
                <template #title>
                    <el-icon>
                        <Sunny />
                    </el-icon>
                    <span>每日推荐</span>
                </template>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
            <template #title><el-icon>
                    <Comment />
                </el-icon><span>信息管理</span></template>
            <el-menu-item @click="$router.push('/home/post/' + null + '/0')"
                :index="'/home/post/' + $route.params.search + '/' + $route.params.limit">
                <template #title>
                    <el-icon>
                        <ChatLineRound />
                    </el-icon>
                    <span>评论管理</span>
                </template>
            </el-menu-item>
            <el-menu-item @click="$router.push('/home/msg/' + null + '/0')"
                :index="'/home/msg/' + $route.params.search + '/' + $route.params.limit">
                <template #title>
                    <el-icon>
                        <ChatDotRound />
                    </el-icon>
                    <span>系统信息管理</span>
                </template>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="4">
            <template #title><el-icon>
                    <DataAnalysis />
                </el-icon><span>数据统计</span></template>
            <el-menu-item index="/home/datacontrol">
                <template #title>
                    <el-icon>
                        <DataLine />
                    </el-icon>
                    <span>音乐统计</span>
                </template>
            </el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>
<script>
export default {
    name: 'menuNav',
    data() {
        return {
            isShow: false
        }
    },
    methods:{
        toCollect(){
            this.isShow = !this.isShow;
            this.$emit('collect', this.isShow);
        }
    }
}
</script>
<style lang="less" scoped>
.el-menu {
    height: 100%;
}
</style>