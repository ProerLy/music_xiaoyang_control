<template>
    <el-container :direction="vertical">
        <el-header height="" id="card">
            <el-card shadow="hover" :body-style="{ padding: '10px', backgroundColor: '#409EFF' }"
                @click="$router.push('/home/usercontrol/0/0/null')">
                <div class="title">
                    <span>用户统计</span>
                    <el-tag type="success" size="normal">实时</el-tag>
                </div>
                <div class="data">{{ cardList.userTotal }}</div>
                <div class="t">
                    当前总用户数量
                </div>
            </el-card>
            <el-card shadow="hover" :body-style="{ padding: '10px', backgroundColor: '#E6A23C' }"
                @click="$router.push('/home/allmusic/null/0')">
                <div class="title">
                    <span>音乐统计</span>
                    <el-tag type="info" size="normal">实时</el-tag>
                </div>
                <div class="data">{{ cardList.musicTotal }}</div>
                <div class="t">
                    当前总音乐数量
                </div>
            </el-card>
            <el-card shadow="hover" :body-style="{ padding: '10px', backgroundColor: '#FF0000' }"
                @click="$router.push('/home/post/null/0')">
                <div class="title">
                    <span>评论统计</span>
                    <el-tag type="success" size="normal">实时</el-tag>
                </div>
                <div class="data">{{ cardList.postTotal }}</div>
                <div class="t">
                    当前总评论数量
                </div>
            </el-card>
            <el-card shadow="hover" :body-style="{ padding: '10px', backgroundColor: '#67C23A' }"
                @click="$router.push('/home/msg/null/0')">
                <div class="title">
                    <span>系统信息统计</span>
                    <el-tag type="warning" size="normal">实时</el-tag>
                </div>
                <div class="data">{{ cardList.msgTotal }}</div>
                <div class="t">
                    当前总系统信息数量
                </div>
            </el-card>
            <el-card shadow="hover" :body-style="{ padding: '10px', backgroundColor: '#909399' }"
                @click="$router.push('/home/datacontrol')">
                <div class="title">
                    <span>音乐听取统计</span>
                    <el-tag type="primary" size="normal">实时</el-tag>
                </div>
                <div class="data">{{ cardList.hearTotal }}</div>
                <div class="t">
                    当前总听取数量
                </div>
            </el-card>
        </el-header>
        <el-container :direction="horizontal">
            <el-main height="">
                <el-row :gutter="20">
                    <el-col :span="12" :offset="0">
                        <el-card shadow="hover">
                            <pieChart :series="cardList.sexData?.series" text="用户男女占比扇形图"></pieChart>
                        </el-card>
                    </el-col>
                    <el-col :span="12" :offset="0">
                        <el-card shadow="hover">
                            <lineChart :series="cardList.LineData?.series" :xAxis="cardList.LineData?.xAxis"
                                text="音乐类型占比柱形图"></lineChart>
                        </el-card>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    name: 'helloPage'
}
</script>
<script setup>
import { reactive, getCurrentInstance, onMounted } from 'vue'
import { ElMessage } from 'element-plus';
import pieChart from '@/components/component/pieChart'
import lineChart from '@/components/component/lineChart';
const { proxy } = getCurrentInstance();
// 页面渲染完毕后
onMounted(() => {
    getUserNum();
    getMusicNum();
    getSysNum();
    getHearNum();
    getPostNum();
    Pie();
    Line();
})
// 数据统计数据
const cardList = reactive({
    userTotal: 0,
    musicTotal: 0,
    msgTotal: 0,
    postTotal: 0,
    hearTotal: 0,
    sexData: null,
    LineData: null
})

// 获取当前用户总量
const getUserNum = async () => {
    const { data: res } = await proxy.$axios.get('/get_total.php?table=user');
    // console.log(res);
    if (res.code === 0) return ElMessage.error(res.msg);
    cardList.userTotal = res.data.total;
}

// 获取当前歌曲总量
const getMusicNum = async () => {
    const { data: res } = await proxy.$axios.get('/get_total.php?table=music');
    // console.log(res);
    if (res.code === 0) return ElMessage.error(res.msg);
    cardList.musicTotal = res.data.total;
}

// 获取当前系统消息总量
const getSysNum = async () => {
    const { data: res } = await proxy.$axios.get('/get_total.php?table=sys_msg');
    // console.log(res);
    if (res.code === 0) return ElMessage.error(res.msg);
    cardList.msgTotal = res.data.total;
}

// 获取当前系统消息总量
const getPostNum = async () => {
    const { data: res } = await proxy.$axios.get('/get_total.php?table=post');
    // console.log(res);
    if (res.code === 0) return ElMessage.error(res.msg);
    cardList.postTotal = res.data.total;
}

// 获取当前听取总量
const getHearNum = async () => {
    const { data: res } = await proxy.$axios.get('/get_total.php?table=music&key=hear');
    // console.log(res);
    if (res.code === 0) return ElMessage.error(res.msg);
    cardList.hearTotal = res.data.total;
}

// 获取柱状图数据
const Pie = async () => {
    const { data: res } = await proxy.$axios.get('/type_1.php');
    // console.log(res);
    if (res.code === 0) return ElMessage.error(res.msg);
    cardList.sexData = res.data;
}

// 获取柱状图数据
const Line = async () => {
    const { data: res } = await proxy.$axios.get('/type_2.php');
    // console.log(res);
    if (res.code === 0) return ElMessage.error(res.msg);
    cardList.LineData = res.data;
}
</script>
<style scoped lang="less">
#card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    --el-header-padding: 0px;
    --el-header-height: max-content;

    .el-card:hover {
        cursor: pointer;
    }

    .el-card {
        color: #fff;
        font-weight: bold;
        flex-grow: 1;
        margin: 0 5px;

        .title {
            font-size: 15px;
            display: flex;
            justify-content: space-between;
        }

        .data {
            text-align: center;
            font-size: 20px;
            margin: 5px 0;
        }

        .t {
            font-size: 15px;
        }
    }
}
</style>