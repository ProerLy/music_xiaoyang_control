<template>
    <div id="control">
        <!-- 用户创建、查询 -->
        <div id="top_control">
            <el-button type="info" size="mini" @click="addUserBtn">
                <el-icon>
                    <Plus />
                </el-icon>
                创建用户
            </el-button>
            <!-- 创建用户框 -->
            <el-dialog v-model="dialog.isAddUser" draggable title="创建新的用户">
                <el-form v-loading="loading.adduser" :model="userForm">
                    <el-form-item label="用户类型">
                        <el-radio-group v-model="userForm.user_type_id">
                            <el-radio :label="1">普通用户</el-radio>
                            <el-radio :label="2">版主</el-radio>
                            <el-radio :label="3">音乐管理员</el-radio>
                            <el-radio :label="4">用户管理员</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-row>
                        <el-col :span="10" :offset="0">
                            <!-- 用户头像 -->
                            <el-form-item label="用户头像">
                                <el-upload class="avatar-uploader" drag :show-file-list="false"
                                    :before-upload="beforeAvatarUpload">
                                    <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
                                    <el-icon v-else class="avatar-uploader-icon">
                                        <Plus />
                                    </el-icon>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                        <el-col :span="14" :offset="0">
                            <el-row>
                                <el-col :span="11" :offset="0">
                                    <el-form-item label="账号" label-width="54px" :rules="[{ required: true }]">
                                        <!-- 账号 -->
                                        <el-input clearable @blur="checkId_1()" v-model="userForm.mobile"
                                            placeholder="请输入账号"></el-input>
                                        <p>{{ err.err_1 }}</p>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11" :offset="2">
                                    <el-form-item label="密码" :rules="[{ required: true }]">
                                        <!-- 密码 -->
                                        <el-input type="password" @blur="checkPass_1()" clearable
                                            v-model="userForm.password" placeholder="请输入密码"></el-input>
                                        <p>{{ err.err_2 }}</p>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11" :offset="0" class="infos">
                                    <el-form-item label="用户名">
                                        <!-- 用户名 -->
                                        <el-input clearable v-model="userForm.nick_name" placeholder="请输入用户名"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11" :offset="2" class="infos">
                                    <el-form-item label="性别" label-width="50px">
                                        <!-- 性别 -->
                                        <el-radio-group v-model="userForm.gender">
                                            <el-radio label="1">女</el-radio>
                                            <el-radio label="2">男</el-radio>
                                            <el-radio label="3">隐藏</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11" class="infos">
                                    <el-form-item label="省市区" label-width="54px">
                                        <!--默认使用-->
                                        <!-- <elui-china-area-dht @change="onChange"></elui-china-area-dht> -->
                                        <!--带isall参数和leave参数示例-->
                                        <elui-china-area-dht isall :leave="3" @change="onChange"
                                            placeholder="请选择省市区"></elui-china-area-dht>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11" :offset="2" class="infos">
                                    <el-form-item label="街道" label-width="50px">
                                        <el-input clearable v-model="userForm.street" placeholder="请输入街道"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11" class="infos">
                                    <el-form-item label="生日" label-width="54px">
                                        <el-date-picker v-model="userForm.birth" type="date" placeholder="YYYY年MM月DD日"
                                            format="YYYY年MM月DD日" value-format="YYYY年MM月DD日" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-form-item label="个性签名">
                        <!-- 个性签名 -->
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" maxlength="300" show-word-limit
                            clearable v-model="userForm.introduce" placeholder="说点什么吧..."></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button type="info" size="mini" @click="dialog.isAddUser = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="addUser">创建</el-button>
                </template>
            </el-dialog>
            <!-- 筛选 -->
            <el-select @change="select(params.type)" v-model="params.type">
                <el-option label="所有用户" value="0" />
                <el-option :label="it.label" :value="it.id" v-for="it in user_type.arr" :key="it.id" />
            </el-select>
            <!-- 搜索 -->
            <div class="search">
                <el-button v-if="$route.params.search != 'null'" type="success" size="mini"
                    @click="show_all">显示全部</el-button>
                <el-tooltip content="请输入用户ID编码\用户名称\用户账号" placement="bottom" effect="dark">
                    <el-input v-model="search" clearable :prefix-icon="Search" placeholder="请输入用户ID编码\用户名称\用户账号">
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
            <!-- 用户列表 -->
            <el-table border :data="userInfo.arr" stripe style="width: 100%">
                <el-table-column type="expand" label="明细" width="60">
                    <template #default="scope">
                        <el-form size="normal">
                            <el-form-item label="账号ID">
                                <span>{{ scope.row.mobile }}</span>
                            </el-form-item>
                            <el-form-item label="性别">
                                <span v-if="scope.row.gender == 2">
                                    男
                                </span>
                                <span v-else-if="scope.row.gender == 1">
                                    女
                                </span>
                                <span v-else>
                                    隐藏
                                </span>
                            </el-form-item>
                            <el-form-item label="出生日期">
                                <span>{{ scope.row.birth }}</span>
                            </el-form-item>
                            <el-form-item label="地址">
                                <span>{{ scope.row.province + scope.row.city + scope.row.area + scope.row.street }}</span>
                            </el-form-item>
                            <el-form-item label="个性签名">
                                <span>{{ scope.row.introduce }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column label="头像">
                    <template #default="scope">
                        <el-image :src="scope.row.avatar" fit="fill" style="width: 50px; height: 50px;"
                            :lazy="true"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="nick_name" label="用户名" />
                <el-table-column label="用户类型">
                    <template #default="scope">
                        <el-tag v-if="scope.row.ut_id == 1" type="info">普通用户</el-tag>
                        <el-tag v-else-if="scope.row.ut_id == 2" type="success">版主</el-tag>
                        <el-tag v-else-if="scope.row.ut_id == 3" type="pramary">音乐管理员</el-tag>
                        <el-tag v-else-if="scope.row.ut_id == 4" type="warning">用户管理员</el-tag>
                        <el-tag v-else type="error">超级管理员</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="creat_time" label="注册时间" />
                <el-table-column label="状态">
                    <template #default="scope">
                        <el-tag v-if="scope.row.is_login == 1" type="success">在线</el-tag>
                        <el-tag v-else type="info">离线</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="登录权限">
                    <template #default="scope">
                        <el-tag v-if="scope.row.is_allow == 1" type="success">允许</el-tag>
                        <el-tag v-else type="info">禁用{{ scope.row.no_allow_time }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="评论权限">
                    <template #default="scope">
                        <el-tag v-if="scope.row.is_speack == 1" type="success">允许</el-tag>
                        <el-tag v-else type="info">禁用{{ scope.row.no_speack_time }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="管理权限">
                    <template #default="scope">
                        <el-tag v-if="scope.row.leavel == 5" type="danger">等级五</el-tag>
                        <el-tag v-else-if="scope.row.leavel == 4" type="warning">等级四</el-tag>
                        <el-tag v-else-if="scope.row.leavel == 3" type="primary">等级三</el-tag>
                        <el-tag v-else-if="scope.row.leavel == 2" type="success">等级二</el-tag>
                        <el-tag v-else type="info">等级一</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="90">
                    <template #default="scope">
                        <el-button type="primary" size="mini" @click="controls(scope.$index)">管理</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 用户控制框 -->
            <el-dialog v-model="dialog.isControl" draggable title="控制用户面板">
                <!-- 用户状态 -->
                <div class="cloose">
                    <div style="display: flex;">
                        权限管理：
                        <div>
                            <div>
                                状态管理：<el-switch style="--el-switch-on-color: #13ce66;" v-model="userControlInfo.is_login"
                                    class="mb-2" active-text="在线" inactive-text="离线" />
                            </div>
                            <div>
                                登录权限：<el-switch style="--el-switch-on-color: #13ce66;" v-model="userControlInfo.is_allow"
                                    class="mb-2" active-text="允许" inactive-text="禁止" />
                                解封时间：<el-date-picker @change="check_time(userControlInfo.no_allow_time, 1)"
                                    v-model="userControlInfo.no_allow_time" :disabled="userControlInfo.is_allow"
                                    type="datetime" placeholder="Pick a Date" format="YYYY年MM月DD日 hh:mm:ss"
                                    value-format="YYYY-MM-DD hh:mm:ss" />
                            </div>
                            <div>
                                评论权限：<el-switch style="--el-switch-on-color: #13ce66;" v-model="userControlInfo.is_speack"
                                    class="mb-2" active-text="允许" inactive-text="禁止" />
                                解封时间：<el-date-picker @change="check_time(userControlInfo.no_speack_time, 0)"
                                    v-model="userControlInfo.no_speack_time" :disabled="userControlInfo.is_speack"
                                    type="datetime" placeholder="Pick a Date" format="YYYY年MM月DD日 hh:mm:ss"
                                    value-format="YYYY-MM-DD hh:mm:ss" />
                            </div>
                            <div style="font-size: 10px; color: red;">
                                注：如时间未填则视为无期限
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 用户类型 -->
                <div class="cloose">
                    用户类型：<el-radio-group v-model="userControlInfo.ut_id">
                        <el-radio label="1">普通用户</el-radio>
                        <el-radio label="2">版主</el-radio>
                        <el-radio label="3">音乐管理员</el-radio>
                        <el-radio label="4">用户管理员</el-radio>
                    </el-radio-group>
                </div>
                <template #footer>
                    <el-button type="info" size="mini" @click="dialog.isControl = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="okControl">确定</el-button>
                </template>
            </el-dialog>
            <!-- 底部分页 -->
            <pageNav @toSize="getSize" :total="params.total" :page_size="params.page_size" />
        </div>
    </div>
</template>
<script>
export default {
    name: 'userControl'
}
</script>
<script setup>
import { ref, reactive, watch, onMounted, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Plus } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import Qs from 'qs'
import pageNav from '@/components/component/pageNav'
import { base } from '@/func/index'
// 引入elui-china-area-dht
import { EluiChinaAreaDht } from 'elui-china-area-dht'
const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();

// 当前用户权限
const leavel = ref($cookies.get('user_info')?.leavel);

// 用户列表
const userInfo = reactive({
    arr: []
});

// 加载
const loading = reactive({
    loading_content: false,
    adduser: false
})

// 页面的传值
const params = reactive({
    type: route.params.type,      // 类型
    page_size: 5, // 一页的数量
    total: 0      // 总条目数
})

// 用户类型
const user_type = reactive({
    arr: []
})
// 获取用户类型
const getUser_type = () => {
    proxy.$axios.post('/get_table.php', Qs.stringify({
        table: 'user_type'
    }))
        .then((res) => {
            if (res.data.code == 1) {
                res.data.data.forEach(val => {
                    user_type.arr.push({ id: val.id, label: val.type_name })
                });
            }
        }).catch((err) => {
            console.log(err);
        })
}

// 获取用户列表的方法
const getUser = (key, key_1) => {
    loading.loading_content = true;
    params.type = route.params.type;
    setTimeout(() => {
        let data = Qs.stringify({
            type: key,
            limit: route.params.limit,
            page_size: params.page_size
        })
        if (!!key_1) {
            data = Qs.stringify({
                key: key_1,
                limit: route.params.limit,
                page_size: params.page_size
            })
        }
        proxy.$axios.post('/getUser_info.php', data)
            .then((res) => {
                // console.log(res)
                if (res.status == 200 && res.data.code == 1) {
                    userInfo.arr = [];
                    res.data.data.forEach(val => {
                        userInfo.arr.push(val);
                    });
                    // 总条目数
                    params.total = res.data.total;
                    loading.loading_content = false;
                }
            }).catch((err) => {
                console.log(err);
            })
    }, 1500);
}

// 是否开启创建用户,修改用户对话框
const dialog = reactive({
    isAddUser: false,
    isControl: false
})

// 还原创建用户框的初始值
const toStart = (val) => {
    if (!val) {
        for (var i in userForm) {
            if (i === 'user_type_id') {
                userForm[i] = 1;
                continue;
            } else if (i === 'code') {
                userForm[i] = false;
                continue;
            } else if (i === 'gender') {
                userForm[i] = '3';
                continue;
            }
            userForm[i] = '';
        }
        for (var i in err) {
            err[i] = '';
        }
    }
}

// 监听是否开启创建框
watch(() => dialog.isAddUser, (isAddUserVal) => {
    // 还原创建用户框的初始值
    toStart(isAddUserVal);
})

// 创建用户的信息
const userForm = reactive({
    nick_name: '',
    avatar: '',
    mobile: '',
    password: '',
    gender: '3',
    birth: '',
    province: '',
    city: '',
    area: '',
    street: '',
    introduce: '',
    user_type_id: 1,
    code: false
})

// 用户头像上传
const beforeAvatarUpload = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('头像必须为image/jpeg格式!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像大小不能超过2MB!')
        return false
    }
    // 转换base64
    base(rawFile, data => {
        userForm.avatar = data;
    })
}

// 获取地址
const chinaData = new EluiChinaAreaDht.ChinaArea().chinaAreaflat;
// 覆盖区县
const onChange = (e) => {
    // 省
    const province = chinaData[e[0]]
    // 市
    const city = chinaData[e[1]]
    // 区
    const area = chinaData[e[2]]
    userForm.province = province.label;
    userForm.city = city.label;
    userForm.area = area.label;
}

// 错误提示
const err = reactive({
    err_1: '',
    err_2: '',
    err_3: ''
})

// 账号、密码验证
const checkId_1 = () => {
    if (userForm.mobile === '') {
        err.err_1 = '账号不能为空~';
        return false;
    } else if (!(/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(userForm.mobile))) {
        err.err_1 = '请输入正确的手机号~';
        return false;
    }
    else {
        err.err_1 = '';
        return true;
    }

}
const checkPass_1 = () => {
    if (userForm.password === '') {
        err.err_2 = '密码不能为空~';
        return false;
    } else if (!(/(?=^.{6,16}$)(?=(?:.*?\d){1})(?=.*[a-z])(?=(?:.*?[A-Z]){1})(?=(?:.*?[`·~!@#$%^&*()_+}{|:;'",<.>/?\=\[\]\-\\]){1})(?!.*\s)[0-9a-zA-Z`·~!@#$%^&*()_+}{|:;'",<.>/?\=\[\]\-\\]*$/.test(userForm.password))) {
        err.err_2 = '密码长度 6-16 位，包含至少一个特殊字符，一个数字，一个大写字母和一个小写字母~';
        return false;
    }
    else {
        err.err_2 = '';
        return true;
    }

}

// 添加用户按钮
const addUserBtn = () => {
    // 判断权限是否满足
    if (leavel.value < 4) {
        ElMessage.warning('权限不足~');
        return false;
    }
    // 开启创建框
    dialog.isAddUser = true;
}

// 创建用户的方法
const addUser = () => {
    // 添加用户
    const isId = checkId_1();
    const isPass = checkPass_1();
    if (!isId || !isPass)
        return false;
    loading.adduser = true;
    // 注册用户
    setTimeout(() => {
        const data = Qs.stringify({
            nick_name: userForm.nick_name ? userForm.nick_name : '用户名',
            mobile: userForm.mobile,
            password: userForm.password,
            avatar: userForm.avatar,
            gender: userForm.gender,
            birth: userForm.birth,
            province: userForm.province,
            city: userForm.city,
            area: userForm.area,
            street: userForm.street,
            introduce: userForm.introduce,
            user_type_id: userForm.user_type_id
        })
        proxy.$axios.post('/setUser_info.php', data)
            .then((res) => {
                if (res.data.code == 0) {
                    ElMessage.warning('账号已存在~');
                    loading.adduser = false;
                    return false;
                }
                ElMessage.success('创建成功~');
                loading.adduser = false;
                dialog.isAddUser = false;
                // 重新加载
                getUser(route.params.type);
            }).catch((err) => {
                loading.adduser = false;
                console.log(err);
            })
    }, 1500);
}

// 搜索用户输入框
let search = ref(route.params.search == 'null' ? '' : route.params.search);
// 搜索方法
const check = (key) => {
    if (!key) {
        ElMessage.warning('请输入搜索内容~');
        return false;
    }
    router.push('/home/usercontrol/0/0/' + search.value);
}

// 展示全部音乐
const show_all = () => {
    search.value = '';
    router.push('/home/usercontrol/' + route.params.type + '/0' + '/null');
}

// 用户控制的信息
const userControlInfo = reactive({
    is_login: false,
    is_allow: false,
    is_speack: false,
    no_allow_time: null,
    no_speack_time: null,
    ut_id: 1,
    u_id: 0
})
// 控制
const controls = (n) => {
    // 判断权限是否满足
    if (leavel.value < 4 || userInfo.arr[n].leavel >= leavel.value) {
        ElMessage.warning('权限不足~');
        return false;
    }
    // 打开控制面板
    dialog.isControl = true;
    // 获取银行卡在面板初始值
    userControlInfo.is_login = parseInt(userInfo.arr[n].is_login) ? true : false;
    userControlInfo.is_allow = parseInt(userInfo.arr[n].is_allow) ? true : false;
    userControlInfo.is_speack = parseInt(userInfo.arr[n].is_speack) ? true : false;
    userControlInfo.no_allow_time = userInfo.arr[n].no_allow_time;
    userControlInfo.no_speack_time = userInfo.arr[n].no_speack_time;
    userControlInfo.ut_id = userInfo.arr[n].ut_id;
    userControlInfo.u_id = userInfo.arr[n].user_id;
}

// 确定更改控制的方法
const okControl = () => {
    // 修改用户状态和权限
    const data = Qs.stringify({
        control: userControlInfo.control ? 1 : 0,
        user_type_id: userControlInfo.ut_id,
        id: userControlInfo.u_id,
        is_allow: userControlInfo.is_allow,
        is_login: userControlInfo.is_login,
        is_speack: userControlInfo.is_speack,
        no_allow_time: userControlInfo.no_allow_time,
        no_speack_time: userControlInfo.no_speack_time
    })
    proxy.$axios.post('/update_control.php', data)
        .then((res) => {
            // console.log(res)
            if (res.data.code == 1) {
                ElMessage.success('修改成功~');
                // 关闭控制面板
                dialog.isControl = false;
                // 重新加载
                getUser(route.params.type);
            }
        }).catch((err) => {
            console.log(err);
        })
}

// 监听日期变化
const check_time = (key, index) => {
    // 获取当前时间戳
    const time = Date.now();
    // 获取选择时间戳
    const t = Date.parse(key);
    if (time > t) {
        ElMessage.warning('时间不能小于当前时间');
        if (index == 1) {
            userControlInfo.no_allow_time = null;
        } else {
            userControlInfo.no_speack_time = null;
        }
    }
}

// 监听控制面板
watch(() => [userControlInfo.is_allow, userControlInfo.is_speack], (key) => {
    if (key[0]) {
        userControlInfo.no_allow_time = null;
    }
    if (key[1]) {
        userControlInfo.no_speack_time = null;
    }
})

// 下拉框的值发生改变时触发
const select = (val) => {
    search.value = '';
    // 跳转页面
    router.push('/home/usercontrol/' + val + '/0' + '/null');
}

// 监听路由变化
watch(() => route.path, (to) => {
    // 重新加载
    getUser(route.params.type, search.value);
})

// 获取分页子组件传递的值
const getSize = (e)=>{
    params.page_size = e;
    // 重新加载
    getUser(route.params.type, search.value);
}

// 页面加载完毕
onMounted(() => {
    if (!!$cookies.get('user_info')) {
        // 获取用户类型
        getUser_type();
        // 默认获取用户信息
        getUser(route.params.type, search.value);
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

        .infos {
            margin-bottom: 10px;
        }

        .el-form-item {
            margin-bottom: 5px;
        }

        .el-form-item p {
            width: 100%;
            height: 22px;
            color: red;
            font-size: 10px;
            margin-top: -5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .node {
        color: red;
        font-size: 10px;
    }

    .avatar-uploader .avatar {
        width: 180px;
        height: 180px;
        display: block;
        margin-top: -20px;
        margin-left: -14px;
    }

    :deep(.el-upload-dragger) {
        width: 180px;
        height: 180px;
        padding: 40px 14px;
        padding-top: 20px;
    }

    :deep(.el-icon.avatar-uploader-icon) {
        width: 180px;
        height: 180px;
        margin-top: -20px;
        margin-left: -14px;
    }

    .avatar-uploader {
        width: 180px;
        height: 180px;
    }
}
</style>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 180px;
    height: 180px;
    text-align: center;
}
</style>