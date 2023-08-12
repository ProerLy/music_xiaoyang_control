<template>
  <header>
    <span class="title">QYX Music</span>
    <span class="welcome">欢迎进入后台管理系统，{{ user_name }}</span>
    <div>
      <el-icon @click="out">
        <SwitchButton />
      </el-icon>
      <el-button type="success" size="mini" @click="select">
        切换账号
      </el-button>
    </div>
  </header>
</template>
<script>
export default {
  name: 'topNav'
}
</script>
<script setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { ref, onMounted, getCurrentInstance } from 'vue'
import Qs from 'qs'
// router
const router = useRouter();
const { proxy } = getCurrentInstance();
// 获取个人信息名称
const user_name = ref();
// 页面渲染完毕
onMounted(() => {
  // 获取用户数据
  getDtl();
})
// 获取用户数据
const getDtl = () => {
  if (!!$cookies.get('user_info')) {
    const params = Qs.stringify({
      token: $cookies.get('user_info').token
    })
    proxy.$axios.post('/getUser_info.php', params)
      .then((res) => {
        if (res.data.code == 1) {
          user_name.value = res.data.data[0].nick_name + '（' + res.data.data[0].type_name + '）';
        }
      }).catch((err) => {
        console.log(err);
      })
  }
}
// 退出
const out = () => {
  ElMessageBox.confirm(
    '确定退出后台管理系统吗？',
    {
      confirmButtonText: '退出',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '退出成功~',
      })
      setTimeout(() => {
        // 清除储存
        $cookies.remove('user_info');
        // 跳转登录页面
        router.replace('/login');
      }, 1500);
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消操作~',
      })
    })
}

// 切换账号
const select = () => {
  router.push('/login');
}
</script>
<style lang="less" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  border-bottom: 2px solid #ff0000;
  padding: 0 20px;

  .title {
    font-size: 30px;
    color: #ffffff;
    font-weight: bold;
  }

  .welcome {
    color: #ffffff;
    font-size: 15px;
  }

  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  div .el-icon {
    font-size: 30px;
    margin-right: 30px;
    color: red;
    border-radius: 100%;
  }

  div .el-icon:hover {
    box-shadow: 0 0 5px red;
  }
}
</style>