<template>
    <el-transfer @change="update" element-loading-background="#ffffff" v-loading="loading.loading_content"
        v-model="dtls.value_0" filter-placeholder="音乐ID\歌名\歌手" style="text-align: left; display: inline-block" filterable
        :titles="['所有音乐', til]" :button-texts="['撤回', '添加']" :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}',
        }" :data="music_dtl.arr">
        <template #default="{ option }">
            <span>{{ option.label }}</span>
        </template>
        <template #right-footer>
            <el-button :disabled="loading.isChange" type="primary" class="transfer-footer" size="small"
                @click="ok">确定</el-button>
        </template>
    </el-transfer>
    <!-- 删除提示弹窗 -->
    <el-dialog style="text-align: left;" v-model="loading.change_dialog" title="提示" width="30%">
        <span>是否修改？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="loading.change_dialog = false">取消</el-button>
                <el-button type="primary" @click="change_ok">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
export default {
    name: 'listNav'
}
</script>
<script setup>
import { ref, reactive, watch, onMounted, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute } from 'vue-router'
import Qs from 'qs'
const route = useRoute();
const { proxy } = getCurrentInstance();
// 获取关键字
const pt = route.path.split('/')[2];
// 当前的标题
const til = ref('');
// 获取穿梭栏标题
const getTil = () => {
    if (pt == 'recomment') {
        // 获取每日推荐til
        til.value = '每日推荐';
    } else if (pt == 'toplist') {
        // 获取排行榜til
        getToplist_select();
    } else if (pt == 'carousel') {
        // 获取轮播图til
        til.value = '轮播图';
    } else {
        // 获取类型til
        getType_select();
    }
}

// 获取type select类型
const getType_select = () => {
    proxy.$axios.post('/get_table.php', Qs.stringify({
        table: 'music_type'
    }))
        .then((res) => {
            if (res.data.code == 1) {
                res.data.data.forEach(val => {
                    if (route.params.type == val.id) {
                        til.value = val.type_name;
                    }
                });
            }
        }).catch((err) => {
            console.log(err)
        })
}

// 获取toplist select类型
const getToplist_select = () => {
    proxy.$axios.post('/get_table.php', Qs.stringify({
        table: 'music_toplist'
    }))
        .then((res) => {
            if (res.data.code == 1) {
                res.data.data.forEach(val => {
                    if (route.params.type == val.id) {
                        til.value = val.type_name;
                    }
                });
            }
        }).catch((err) => {
            console.log(err)
        })
}

// 所有音乐数据
const music_dtl = reactive({
    arr: []
});

// 数据
const dtls = reactive({
    value_0: [],   // 索引
    value_1: [], // 备份索引，用于对比是否改变
    del: []     // 需要删除的数据
})

// 加载
const loading = reactive({
    loading_content: false,
    isChange: true,
    change_dialog: false
})

// 获取并显示所有数据
const generateData = () => {
    proxy.$axios.post('/get_table.php',
        Qs.stringify({
            table: 'music'
        })
    )
        .then((res) => {
            if (res.data.code == 1) {
                const dtl = res.data.data;
                music_dtl.arr = [];
                for (let i = 0; i < dtl.length; i++) {
                    music_dtl.arr.push({
                        key: dtl[i].id,
                        label: `${dtl[i].id}-${dtl[i].song_name}-${dtl[i].songer}`
                    })
                }
            }
        }).catch((err) => {
            console.log(err);
        })
}

// 获取每日推荐索引的方法
const recomments = () => {
    proxy.$axios.post('/get_table.php',
        Qs.stringify({
            table: 'view_music_recomment'
        })
    )
        .then((res) => {
            if (res.data.code == 1) {
                const dtl = res.data.data;
                dtls.value_0 = [];
                dtls.value_1 = [];
                if (dtl.length > 0) {
                    // 获取索引
                    for (let i = 0; i < dtl.length; i++) {
                        dtls.value_0.push(dtl[i].music_id);
                        dtls.value_1.push(dtl[i].music_id);
                    }
                }
            }
        }).catch((err) => {
            console.log(err);
        })
}

// 获取轮播图数据
const carousel = () => {
    proxy.$axios.post('/get_table.php',
        Qs.stringify({
            table: 'carousel'
        })
    )
        .then((res) => {
            if (res.data.code == 1) {
                const dtl = res.data.data;
                dtls.value_0 = [];
                dtls.value_1 = [];
                if (dtl.length > 0) {
                    // 获取索引
                    for (let i = 0; i < dtl.length; i++) {
                        dtls.value_0.push(dtl[i].music_id);
                        dtls.value_1.push(dtl[i].music_id);
                    }
                }
            }
        }).catch((err) => {
            console.log(err);
        })
}

// 获取类型索引的方法
const types = () => {
    proxy.$axios.post('/getMusic_type.php',
        Qs.stringify({
            type: route.params.type
        }))
        .then((res) => {
            if (res.data.code == 1) {
                const dtl = res.data.data;
                dtls.value_0 = [];
                dtls.value_1 = [];
                if (dtl.length > 0) {
                    // 获取索引
                    for (let i = 0; i < dtl.length; i++) {
                        dtls.value_0.push(dtl[i].music_id);
                        dtls.value_1.push(dtl[i].music_id);
                    }
                }
            }
        }).catch((err) => {
            console.log(err);
        })
}

// 获取排行榜索引的方法
const lists = () => {
    proxy.$axios.post('/getMusic_toplist.php',
        Qs.stringify({
            type: route.params.type
        }))
        .then((res) => {
            if (res.data.code == 1) {
                const dtl = res.data.data;
                dtls.value_0 = [];
                dtls.value_1 = [];
                if (dtl.length > 0) {
                    // 获取索引
                    for (let i = 0; i < dtl.length; i++) {
                        dtls.value_0.push(dtl[i].music_id);
                        dtls.value_1.push(dtl[i].music_id);
                    }
                }
            }
        }).catch((err) => {
            console.log(err);
        })
}

// 获取数据
const getAll = () => {
    loading.loading_content = true;
    setTimeout(() => {
        // 获取所有数据
        generateData();
        // 获取穿梭栏标题
        getTil();
        if (pt == 'recomment') {
            // 获取推荐索引
            recomments();
        } else if (pt == 'type') {
            // 获取类型索引
            types();
        } else if (pt == 'carousel') {
            // 获取轮播图索引
            carousel();
        } else {
            // 获取排行榜索引
            lists();
        }
        loading.loading_content = false;
    }, 1500);
}

// 监听穿梭栏变化
const update = (ary) => {
    let arys = [];
    dtls.value_1.forEach(val => {
        arys.push(val);
    });
    for (var i = 0; i < arys.length; i++) {
        for (var j = 0; j < ary.length; j++) {
            if (arys[i] == ary[j]) {
                arys.splice(i, 1);
                i--;
                break;
            }
        }
    }
    if (arys.length > 0) {
        dtls.del = arys;
    }
}

// 获取用户权限等级
const leavel = parseInt($cookies.get('user_info')?.leavel);
// 确定修改按钮
const ok = () => {
    if (leavel != 3 && leavel != 5) {
        ElMessage.warning('权限不足~');
        return;
    }
    if (pt == 'recomment') {
        if (dtls.value_0.length < 10) {
            ElMessage.warning('推荐音乐至少10首~');
            return;
        }
    }
    loading.change_dialog = true;
}

// 修改方法
const change_fun = (api, data) => {
    proxy.$axios.post('/' + api + '.php', data)
        .then((res) => {
            if (res.data.code == 0) {
                ElMessage.warning(res.data.msg);
                return;
            }
            ElMessage.success(res.data.msg);
            loading.change_dialog = false;
            // 重新加载
            getAll();
        }).catch((err) => {
            console.log(err);
        })
}

// 确认修改
const change_ok = () => {
    if (pt == 'recomment') {
        change_fun('change_recomment', Qs.stringify({
            idAry_1: dtls.del,
            idAry_2: dtls.value_0
        }))
    } else if (pt == 'toplist') {
        change_fun('change_toplist', Qs.stringify({
            toplis_id: route.params.type,
            idAry_1: dtls.del,
            idAry_2: dtls.value_0
        }))
    } else if (pt == 'type') {
        change_fun('change_type', Qs.stringify({
            type_id: route.params.type,
            idAry_1: dtls.del,
            idAry_2: dtls.value_0
        }))
    } else {
        change_fun('change_carousel', Qs.stringify({
            idAry_1: dtls.del,
            idAry_2: dtls.value_0
        }))
    }
}

// 监听每日推荐的索引变化
watch(() => dtls.value_0, (val) => {
    // 对比是否改变推荐数据
    let flag = true;
    /**
     * 如果可修改的数组长度大于0，且备份的数组的长度为0，则按钮默认为可点击状态
     */
    if (val.length > 0 && dtls.value_1.length == 0) {
        flag = false;
    } else {
        /** 判断备份的数组和可修改的数组谁的长度大，外部循环为大的数组，内部循环为小的数组，
         * 长度相同则 任意
         */
        if (val.length < dtls.value_1.length) {
            for (var i in dtls.value_1) {
                for (var j in val) {
                    if (dtls.value_1[i] != val[j]) {
                        flag = false;
                    } else {
                        flag = true;
                        break;
                    }
                }
                if (!flag) break;
            }
        } else {
            for (var i in val) {
                for (var j in dtls.value_1) {
                    if (dtls.value_1[j] != val[i]) {
                        flag = false;
                    } else {
                        flag = true;
                        break;
                    }
                }
                if (!flag) break;
            }
        }
    }
    // 如果flag为 false 则按钮为可点击状态，则为不可点击状态
    if (!flag)
        loading.isChange = false;
    else
        loading.isChange = true;
})

// 监听路由变化
watch(() => route.path, (val) => {
    // 更新数据
    getAll();
})

// 页面渲染完毕
onMounted(() => {
    if (!!$cookies.get('user_info')) {
        // 加载数据
        getAll();
    }
})
</script>
<style lang="less">
.el-transfer {
    --el-transfer-panel-width: auto;

    .transfer-footer {
        margin-left: 15px;
        padding: 6px 5px;
    }
}
</style>