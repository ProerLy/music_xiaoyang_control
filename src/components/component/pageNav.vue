<template>
    <div id="page" v-show="total > 0">
        <p>
            <span>共查询{{ total }}条数据，</span>
            <el-select v-model="page_size" @change="toPage_size">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <span class="to">前往<el-input class="seacher" v-model.number="page" @blur="toPage" size="normal" />页
            </span>
        </p>
        <el-pagination @current-change="click" background layout="prev, pager, next" v-model:current-page="params.page"
            v-model:page-size="page_size" :total="total" />
    </div>
</template>
<script>
export default {
    name: 'pageNav'
}
</script>
<script setup>
import { toRefs, reactive, watch, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
const router = useRouter();
const route = useRoute();
const emit = defineEmits(['toSize'])
const props = defineProps({
    total: {
        type: Number,
        required: true
    },
    page_size: {
        type: Number,
        required: true
    }
})
const { total, page_size } = toRefs(props);
const options = reactive([
    {
        value: 5,
        label: '5条/页'
    },
    {
        value: 10,
        label: '10条/页'
    },
    {
        value: 15,
        label: '15条/页'
    }
])
// 传递的值
const params = reactive({
    limit: 0,
    page: 0
})

// 当前页
const page = ref();

// 获取默认值
const getnormal = () => {
    params.limit = parseInt(route.params.limit);
    params.page = params.limit ? params.limit / page_size.value + 1 : 1;
    page.value = params.page;
}

// 点击切换分页
const click = (n) => {
    params.limit = (n - 1) * page_size.value;
    if (route.path.split('/')[2] === 'allmusic') {
        router.push('/home/allmusic/' + route.params.search + '/' + params.limit);
    } else if (route.path.split('/')[2] === 'usercontrol') {
        router.push('/home/usercontrol/' + route.params.type + '/' + params.limit + '/' + route.params.search);
    } else if (route.path.split('/')[2] === 'post') {
        router.push('/home/post/' + route.params.search + '/' + params.limit);
    } else {
        router.push('/home/msg/' + route.params.search + '/' + params.limit);
    }
}

// 修改页量
const toPage_size = (e) => {
    emit('toSize', e);
}

// 修改页码
const toPage = () => {
    params.page = page.value;
    click(params.page)
}

// 监听路由变化
watch(() => route.path, (to) => {
    // 获取默认值
    getnormal();
})

// 页面渲染完毕
onMounted(() => {
    if (!!$cookies.get('user_info')) {
        // 获取默认值
        getnormal();
    }
})
</script>
<style scope lang="less">
#page {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 25px;

    p {

        .el-select {
            width: 100px;
        }

        .to {
            margin: 0 20px;

            .seacher {
                width: 50px;

                input {
                    text-align: center;
                }
            }
        }
    }
}
</style>