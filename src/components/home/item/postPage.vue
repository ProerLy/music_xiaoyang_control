<template>
    <div id="control">
        <!-- 评论查询 -->
        <div id="top_control">
            <!-- 搜索 -->
            <div class="search">
                <el-button v-if="$route.params.search != 'null'" type="success" size="mini"
                    @click="show_all">显示全部</el-button>
                <el-tooltip content="请输入评论ID\音乐ID\发布人ID\发布人" placement="bottom" effect="dark">
                    <el-input v-model="search" clearable :prefix-icon="Search" placeholder="请输入评论ID\音乐ID\发布人ID\发布人">
                        <template #append>
                            <el-button @click="check(search)" style="background-color: #409EFF;" type="primary"
                                size="mini"><el-icon color="#ffffff">
                                    <Search />
                                </el-icon></el-button>
                        </template>
                    </el-input>
                </el-tooltip>
            </div>
        </div>
        <!-- 内容区 -->
        <div id="content" element-loading-background="#ffffff" v-loading="loading.loading_content">
            <!-- 评论列表 -->
            <el-table border :data="post_all.arr" stripe style="width: 100%">
                <el-table-column type="expand" label="查看回复" width="90">
                    <template #default="scope">
                        <el-table :data="scope.row.commit" :border="childBorder">
                            <el-table-column label="回复人名" prop="nick_name" />
                            <el-table-column label="回复内容" prop="content" />
                            <el-table-column label="回复时间" prop="commit_time" />
                            <el-table-column label="操作" width="90">
                                <template #default="scope">
                                    <el-button type="danger" size="mini"
                                        @click="delCommit(scope.row.commit_id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="序号" width="60" />
                <!-- 发布人 -->
                <el-table-column prop="post.nick_name" label="发布人" />
                <!-- 内容 -->
                <el-table-column label="内容">
                    <template #default="scope">
                        <div>{{ scope.row.post.content }}</div>
                    </template>
                </el-table-column>
                <!-- 时间 -->
                <el-table-column prop="post.create_time" label="发布时间" />
                <!-- 操作 -->
                <el-table-column label="操作" width="90">
                    <template #default="scope">
                        <el-button type="danger" size="mini" @click="del(scope.row.post.post_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 底部分页 -->
            <pageNav @toSize="getSize" :total="bot.total" :page_size="bot.page_size" :search="search" />
        </div>
        <!-- 删除提示弹窗 -->
        <el-dialog v-model="delDtl.del_dialog" title="提示" width="30%">
            <span>此操作不可逆，是否删除？</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="delDtl.del_dialog = false">取消</el-button>
                    <el-button type="primary" @click="del_ok">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'musicControl'
}
</script>
<script setup>
import { ref, reactive, watch, onMounted, getCurrentInstance } from 'vue';
import Qs from 'qs'
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import pageNav from '@/components/component/pageNav'
const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();
// 获取用户权限等级
const leavel = parseInt($cookies.get('user_info')?.leavel);

// 底部分页的数据
const bot = reactive({
    total: 0,
    page_size: 5
})

// 所有音乐数据
const post_all = reactive({
    arr: []
})

// 加载
const loading = reactive({
    loading_content: false
})
// 获取音乐数据
const getPost = (key, limit, page_size) => {
    loading.loading_content = true;
    setTimeout(() => {
        // 传递的数据
        let data = Qs.stringify({
            limit,
            page_size
        })
        // 筛选
        if (!!key) {
            data = Qs.stringify({
                key,
                limit,
                page_size
            })
        }
        // 发送请求
        proxy.$axios.post('/get_post_all.php', data)
            .then((res) => {
                // console.log(res)
                if (res.data.code == 1) {
                    post_all.arr = res.data.data;
                    bot.total = res.data.total;
                    loading.loading_content = false;
                }
            }).catch((err) => {
                console.log(err)
            })
    }, 1500);
}

// 搜索
const search = ref(route.params.search == 'null' ? '' : route.params.search);
// 搜索方法
const check = (key) => {
    if (!key) {
        ElMessage.warning('请输入搜索内容~');
        return false;
    }
    router.push('/home/post/' + search.value + '/' + route.params.limit);
}

// 展示全部音乐
const show_all = () => {
    search.value = '';
    router.push('/home/post/null/0');
}

// 删除所需数据
const delDtl = reactive({
    del_dialog: false,
    post_id: null,
    commit_id: null
});
// 删除评论
const del = (n) => {
    if (leavel != 2 && leavel != 5) {
        ElMessage.warning('权限不足~');
        return false;
    }
    delDtl.del_dialog = true;
    delDtl.post_id = n;
}

// 删除回复
const delCommit = (n) => {
    if (leavel != 3 && leavel != 5) {
        ElMessage.warning('权限不足~');
        return false;
    }
    delDtl.del_dialog = true;
    delDtl.commit_id = n;
}

// 确定删除
const del_ok = () => {
    del_post(delDtl.post_id, delDtl.commit_id)
}

// 删除评论的方法
const del_post = (post_id, commit_id) => {
    let data = Qs.stringify({
        post_id
    })
    if (!!commit_id) {
        data = Qs.stringify({
            commit_id
        })
    }
    proxy.$axios.post('/delet_post.php', data)
        .then((res) => {
            // console.log(res)
            if (res.data.code == 1) {
                // 成功提示
                ElMessage.success(res.data.msg);
                // 初始化
                delDtl.post_id = null;
                delDtl.commit_id = null;
                delDtl.del_dialog = false;
                // 获取评论数据
                getPost(search.value, route.params.limit, bot.page_size);
            }
        }).catch((err) => {
            console.log(err);
        })
}

// 监听路由变化
watch(() => route.path, (val) => {
    // 获取评论数据
    getPost(search.value, route.params.limit, bot.page_size);
})

// 获取分页子组件传递的值
const getSize = (e)=>{
    bot.page_size = e;
    // 获取评论数据
    getPost(search.value, route.params.limit, bot.page_size);
}

// 页面渲染完毕
onMounted(() => {
    if (!!$cookies.get('user_info')) {
        // 获取评论数据
        getPost(search.value, route.params.limit, bot.page_size);
    }
})
</script>
<style lang="less" scoped>
#control {
    #top_control {
        height: 10%;
        border-bottom: 1px solid rgba(0, 0, 0, .3);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 20px;

        .search {
            display: flex;
        }
    }
}
</style>
