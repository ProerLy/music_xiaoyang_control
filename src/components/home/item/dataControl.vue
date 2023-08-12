<template>
    <div id="control" element-loading-background="#ffffff" v-loading="loading.loading_content">
        <pieChart :series="typeHear" text="音乐类型分布扇形图" />
    </div>
</template>
<script>
export default {
    name: 'dataControl'
}
</script>
<script setup>
import { onMounted, reactive, getCurrentInstance } from 'vue'
import pieChart from '@/components/component/pieChart'
import Qs from 'qs'
const { proxy } = getCurrentInstance();
// 加载
const loading = reactive({
    loading_content: true
})

const typeHear = reactive([]);

// 获取音乐排行榜
const getList = () => {
    setTimeout(() => {
        proxy.$axios.post('/get_table.php', Qs.stringify({
            table: 'music_type'
        }))
            .then((res) => {
                if (res.data.code == 1) {
                    res.data.data.forEach((val, index) => {
                        typeHear.push({
                            name: val.type_name,
                            value: val.hear
                        });
                    });
                    loading.loading_content = false;
                }
            }).catch((err) => {
                console.log(err)
            })
    }, 1500);

}

// 页面加载完毕
onMounted(() => {
    getList();
})
</script>
<style lang="less" scoped></style>