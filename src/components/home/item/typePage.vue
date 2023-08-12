<template>
    <div id="control">
        <header>
            <el-select v-model="value" class="m-2" size="large">
                <el-option v-for="item in type_list.arr" :key="item?.id" :label="item?.label" :value="item?.id" />
            </el-select>
        </header>
        <listNav />
    </div>
</template>
<script>
export default {
    name: 'typePage'
}
</script>
<script setup>
import listNav from '@/components/component/listNav'
import { useRouter, useRoute } from 'vue-router';
import { ref, reactive, watch, getCurrentInstance, onMounted } from 'vue'
import Qs from 'qs'
const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();
// 下拉框值
let value = ref(route.params.type);
// 音乐排行榜
const type_list = reactive({
    arr: []
})
// 获取音乐类型
const getList = () => {
    proxy.$axios.post('/get_table.php', Qs.stringify({
        table: 'music_type'
    }))
        .then((res) => {
            if (res.data.code == 1) {
                res.data.data.forEach(val => {
                    type_list.arr.push({ id: val.id, label: val.type_name });
                });
            }
        }).catch((err) => {
            console.log(err)
        })
}
// 监听value值的变化
watch(() => value.value, (val) => {
    router.push('/home/type/' + val);
})

// 页面加载完毕
onMounted(() => {
    if (!!$cookies.get('user_info')) {
        // 获取天花板列表
        getList();
    }
})
</script>
<style lang="less" scoped>
#control {
    text-align: center;

    header {
        padding: 10px;
        border-bottom: 1px rgba(0, 0, 0, .1) solid;
        margin-bottom: 10px;
    }
}
</style>