<template>
    <div id="control">
        <!-- 创建、查询 -->
        <div id="top_control">
            <!-- 创建 -->
            <el-button type="info" size="default" @click="add.add_dialog = true"><el-icon>
                    <ChatLineRound />
                </el-icon>发布新通知</el-button>
            <!-- 搜索 -->
            <div class="search">
                <el-button v-if="$route.params.search != 'null'" type="success" size="mini"
                    @click="show_all">显示全部</el-button>
                <el-tooltip content="请输入评论ID或内容" placement="bottom" effect="dark">
                    <el-input v-model="search" clearable :prefix-icon="Search" placeholder="请输入ID或内容">
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
            <!-- 信息列表 -->
            <el-table border :data="msg.arr" stripe style="width: 100%">
                <el-table-column type="index" label="序号" width="60px" />
                <!-- 内容 -->
                <el-table-column label="内容">
                    <template #default="scope">
                        <div>{{ scope.row.content }}</div>
                    </template>
                </el-table-column>
                <!-- 时间 -->
                <el-table-column prop="create_time" label="发布时间" />
                <!-- 操作 -->
                <el-table-column label="操作" width="90">
                    <template #default="scope">
                        <el-button type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
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
        <!-- 发布框 -->
        <el-dialog v-model="add.add_dialog" title="新建通知" width="30%">
            <el-input v-model="add.content" placeholder="请输入内容" clearable></el-input>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="add.add_dialog = false">取消</el-button>
                    <el-button type="primary" @click="add_ok(add.content)">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'msgPage'
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

// 所有信息数据
const msg = reactive({
    arr: []
})

// 加载
const loading = reactive({
    loading_content: false
})
// 获取音乐数据
const getMsg = (key, limit, page_size) => {
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
        proxy.$axios.post('/get_sys_msg.php', data)
            .then((res) => {
                // console.log(res)
                if (res.data.code == 1) {
                    msg.arr = res.data.data;
                    bot.total = res.data.total;
                    loading.loading_content = false;
                }
            }).catch((err) => {
                console.log(err)
            })
    }, 1500);
}

// 新建通知数据
const add = reactive({
    add_dialog: false,
    content: null
})
// 新建通知
const add_ok = (key) => {
    if (!key) {
        ElMessage.warning('请输入内容~');
        return;
    }
    proxy.$axios.post('/insert_sys_msg.php', Qs.stringify({ content: key }))
        .then((res) => {
            if (res.data.code == 1) {
                ElMessage.success(res.data.msg);
                add.add_dialog = false;
                // 重新获取数据
                getMsg(search.value, route.params.limit, bot.page_size);
            } else {
                ElMessage.warning(res.data.msg);
            }
        }).catch((err) => {
            console.log(err)
        })
}

// 监听add_dialog
watch(() => add.add_dialog, (key) => {
    add.content = null;
})

// 搜索
const search = ref(route.params.search == 'null' ? '' : route.params.search);
// 搜索方法
const check = (key) => {
    if (!key) {
        ElMessage.warning('请输入搜索内容~');
        return false;
    }
    router.push('/home/msg/' + search.value + '/' + route.params.limit);
}

// 展示全部音乐
const show_all = () => {
    search.value = '';
    router.push('/home/msg/null/0');
}

// 删除所需数据
const delDtl = reactive({
    del_dialog: false,
    msg_id: null
});
// 删除评论
const del = (n) => {
    if (leavel != 2 && leavel != 5) {
        ElMessage.warning('权限不足~');
        return false;
    }
    delDtl.del_dialog = true;
    delDtl.msg_id = n;
}

// 确定删除
const del_ok = () => {
    del_msg(delDtl.msg_id)
}

// 删除评论的方法
const del_msg = (msg_id) => {
    proxy.$axios.post('/delet_sys_msg.php', Qs.stringify({
        id: msg_id
    }))
        .then((res) => {
            // console.log(res)
            if (res.data.code == 1) {
                // 成功提示
                ElMessage.success(res.data.msg);
                // 初始化
                delDtl.msg_id = null;
                delDtl.del_dialog = false;
                // 获取评论数据
                getMsg(search.value, route.params.limit, bot.page_size);
            }
        }).catch((err) => {
            console.log(err);
        })
}

// 监听路由变化
watch(() => route.path, (val) => {
    // 获取评论数据
    getMsg(search.value, route.params.limit, bot.page_size);
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
        getMsg(search.value, route.params.limit, bot.page_size);
    }
})
</script>
<style lang="less" scoped>
#control {
    #top_control {
        height: 10%;
        border-bottom: 1px solid rgba(0, 0, 0, .3);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;

        .search {
            display: flex;
        }
    }
}
</style>
