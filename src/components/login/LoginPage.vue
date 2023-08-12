<template>
    <div id="login">
        <div v-loading="loading" element-loading-text="验证中..." element-loading-background="rgba(255, 255, 255, 0.8)"
            id="login_box">
            <!-- 验证结果 -->
            <div :class="sear ? 'back_1' : 'back'" id="search">
                <div style="color: green;" class="center" v-if="isPass">
                    <el-icon size="30px">
                        <SuccessFilled />
                    </el-icon><span>登陆成功~</span>
                </div>
                <div style="color: red;" v-else class="center">
                    <el-icon size="30px">
                        <CircleCloseFilled />
                    </el-icon><span>账号不存在或者密码错误~</span>
                </div>
            </div>
            <!-- 验证表单 -->
            <div :class="sear ? 'face_1' : 'face'" id="form">
                <el-form :model="ruleForm" ref="ruleForms" :rules="rules">
                    <h2><span>QYX Control</span><span>Login</span></h2>
                    <el-form-item label="账号" prop="mobile">
                        <el-input @keydown.enter="submitForm" v-model="ruleForm.mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input @keydown.enter="submitForm" type="password" v-model="ruleForm.password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'LoginPage'
}
</script>
<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Qs from 'qs'
const { proxy, ctx } = getCurrentInstance();
// 路由
const router = useRouter();
const ruleForm = reactive({
    mobile: '13203263545',
    password: '21354214Ly#'
})

// 页面加载完毕获取用户信息
onMounted(() => {
    if (!!$cookies.get('user')) {
        ruleForm.mobile = $cookies.get('user').mobile;
        ruleForm.password = $cookies.get('user').password;
    }
})

// 规则
const rules = reactive({
    mobile: [
        { required: true, message: '账号不能为空', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' }
    ]
})

// 开启验证
let sear = ref(false);
// 验证是否通过
let isPass = ref(false);
// 加载
let loading = ref(false);
// 验证账号
const submitForm = () => {
    ctx.$refs.ruleForms.validate((voild) => {
        if (voild) {
            loading.value = true;
            setTimeout(() => {
                proxy.$axios.post('/login_control.php', Qs.stringify(ruleForm))
                    .then((res) => {
                        // console.log(res)
                        if (res.data.code == 0) {
                            ElMessage.warning(res.data.msg);
                            // 关闭加载
                            loading.value = false;
                            return;
                        }
                        ElMessage.success('登陆成功~');
                        // 关闭加载
                        loading.value = false;
                        // 验证
                        sear.value = true;
                        isPass.value = true;
                        // 判断cookies是否存在，存在则删除
                        if ($cookies.isKey('user_info')) {
                            $cookies.remove('user_info')
                        }
                        // 储存cookies
                        $cookies.set('user_info', { token: res.data.data.token, leavel: res.data.data.leavel }, { expires: 1 });
                        // 修改在线状态
                        setTimeout(() => {
                            router.replace('home/house');
                        }, 2000);
                    }).catch((err) => {
                        console.log(err);
                        ElMessage.error('系统错误，请及时联系管理员~');
                        // 关闭加载
                        loading.value = false;
                    })
            }, 2000);
        }
    })
}
</script>
<style lang="less" scope>
#login {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    

    #login_box {
        width: 450px;
        height: 240px;
        position: relative;
        border-radius: 10px;
        overflow: hidden;

        #form {
            height: 100%;
            width: 100%;
            position: absolute;
            padding: 20px;
            background-color: #ffffff;
            backface-visibility: hidden;
            transform-style: preserve-3d;
            transition: transform 1s;

            h2 {
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
            }

            .el-button {
                margin: 0 auto;
                width: 30%;
            }
        }

        #search {
            height: 100%;
            width: 100%;
            position: absolute;
            backface-visibility: hidden;
            transform-style: preserve-3d;
            transition: transform 1s;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #ffffff;

            .center {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
        }
    }

}

.face {
    transform: rotateY(0deg);
}

.back {
    transform: rotateY(-180deg);
}

.face_1 {
    transform: rotateY(180deg);
}

.back_1 {
    transform: rotateY(0deg);
}
</style>