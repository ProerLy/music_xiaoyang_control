<template>
  <div id="control">
    <!-- 音乐创建、查询 -->
    <div id="top_control">
      <el-button type="info" size="mini" @click="addMusicBtn">
        <el-icon>
          <Plus/>
        </el-icon>
        添加音乐
      </el-button>
      <!-- 搜索 -->
      <div class="search">
        <el-button v-if="$route.params.search != 'null'" type="success" size="mini"
                   @click="show_all">显示全部
        </el-button>
        <el-input v-model="search" clearable :prefix-icon="Search" placeholder="请输入歌手\歌名\歌曲ID">
          <template #append>
            <el-button @click="check(search)" style="background-color: #409EFF;" type="primary"
                       size="mini">
              <el-icon color="#ffffff">
                <Search/>
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
    </div>
    <!-- 内容区 -->
    <div id="content" element-loading-background="#ffffff" v-loading="loading.loading_content">
      <!-- 用户列表 -->
      <el-table border :data="music_all.arr" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60"/>
        <!-- 图片 -->
        <el-table-column prop="baner_img" width="80" label="图片">
          <template #default="scope">
            <el-image style="width: 50px;height: 50px;" :src="scope.row.baner_img" fit="fill"
                      :lazy="true"></el-image>
          </template>
        </el-table-column>
        <!-- 歌名 -->
        <el-table-column prop="song_name" label="歌名"/>
        <!-- 歌手 -->
        <el-table-column prop="songer" label="歌手"/>
        <!-- 音频链接 -->
        <el-table-column label="音频链接">
          <template #default="scope">
            <div class="audio">{{ scope.row.audio }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="time" width="70" label="时长"/>
        <!-- 歌词链接 -->
        <el-table-column label="歌词链接">
          <template #default="scope">
            <div class="lrc">{{ scope.row.lrc }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="controls(scope.$index)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页 -->
      <pageNav @toSize="getSize" :total="bot.total" :page_size="bot.page_size" :search="search"/>
    </div>
    <!-- 创建音乐、编辑音乐框 -->
    <el-dialog v-model="music_tal.isShow" draggable :title="music_tal.title">
      <el-form :model="music_table">
        <!-- 图片 -->
        <el-form-item label="音乐图片">
          <el-upload class="avatar-uploader" drag :show-file-list="false" :on-change="handleChange">
            <img v-if="music_table.baner_img" :src="music_table.baner_img" class="avatar"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
          <p>{{ err.err_1 }}</p>
        </el-form-item>
        <el-row>
          <el-col :span="10" :offset="0" v-if="music_tal.btnText == '添加'">
            <el-form-item label="音乐ID">
              <el-input @blur="checkSong_ID" type="text" :rules="[{ required: true }]" clearable
                        v-model="music_table.music_id" placeholder="请输入音乐ID"/>
              <p>{{ err.err_7 }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- 歌名 -->
          <el-col :span="10" :offset="0">
            <el-form-item label="歌名">
              <el-input @blur="checkSong_name" type="text" :rules="[{ required: true }]" clearable
                        v-model="music_table.song_name" placeholder="请输入歌名"/>
              <p>{{ err.err_2 }}</p>
            </el-form-item>
          </el-col>
          <!-- 音频 -->
          <el-col :span="10" :offset="2">
            <el-form-item label="音频链接">
              <el-input id="audio" @blur="checkAudio" type="url" :rules="[{ required: true }]" clearable
                        v-model="music_table.audio" placeholder="请输入音频链接"/>
              <p>{{ err.err_5 }}</p>
            </el-form-item>
          </el-col>
          <!-- 歌手 -->
          <el-col :span="10" :offset="0">
            <el-form-item label="歌手">
              <el-input @blur="checkSonger" type="text" :rules="[{ required: true }]" clearable
                        v-model="music_table.songer" placeholder="请输入歌手"/>
              <p>{{ err.err_3 }}</p>
            </el-form-item>
          </el-col>
          <!-- 歌词 -->
          <el-col :span="10" :offset="2">
            <el-form-item label="歌词链接">
              <el-input @blur="checkLrc" type="url" :rules="[{ required: true }]" clearable
                        v-model="music_table.lrc" placeholder="请输入歌词链接"/>
              <p>{{ err.err_4 }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 类型 -->
        <el-form-item label="类型" v-if="music_tal.btnText == '添加'">
          <el-checkbox-group @change="checkType" v-model="music_table.type">
            <el-checkbox border size="small" :label="it.id" v-for="it in types.arr" :key="it.id">{{
                it.label
              }}
            </el-checkbox>
          </el-checkbox-group>
          <p>{{ err.err_6 }}</p>
        </el-form-item>
        <!-- 排行榜 -->
        <el-form-item label="排行榜" v-if="music_tal.btnText == '添加'">
          <el-checkbox-group v-model="music_table.toplist">
            <el-checkbox border size="small" :label="it.id" v-for="it in toplist.arr" :key="it">{{
                it.label
              }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- 每日推荐 -->
        <el-form-item label="每日推荐" v-if="music_tal.btnText == '添加'">
          <el-radio-group v-model="music_table.recomment">
            <el-radio :label="true" size="small" border>是</el-radio>
            <el-radio :label="false" size="small" border>否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="info" size="mini" @click="music_tal.isShow = false">取消</el-button>
        <el-button type="primary" size="mini" @click="ok">{{ music_tal.btnText }}</el-button>
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
import {ref, reactive, watch, onMounted, getCurrentInstance} from 'vue';
import Qs from 'qs'
import {ElMessage} from 'element-plus';
import {Search, Plus} from '@element-plus/icons-vue'
import {useRoute, useRouter} from 'vue-router'
import pageNav from '@/components/component/pageNav'
import {base} from '@/func/index'

const router = useRouter();
const route = useRoute();
const {proxy} = getCurrentInstance();
// 获取用户权限等级
const leavel = parseInt($cookies.get('user_info')?.leavel);
// 音乐类型
const types = reactive({
  arr: []
});
// 获取音乐类型
const getType = () => {
  proxy.$axios.post('/get_table.php', Qs.stringify({
    table: 'music_type'
  }))
      .then((res) => {
        if (res.data.code == 1) {
          res.data.data.forEach(val => {
            types.arr.push({id: val.id, label: val.type_name});
          });
        }
      }).catch((err) => {
    console.log(err)
  })
}

// 音乐排行榜
const toplist = reactive({
  arr: []
})
// 获取音乐排行榜
const getList = () => {
  proxy.$axios.post('/get_table.php', Qs.stringify({
    table: 'music_toplist'
  }))
      .then((res) => {
        if (res.data.code == 1) {
          res.data.data.forEach(val => {
            toplist.arr.push({id: val.id, label: val.type_name});
          });
        }
      }).catch((err) => {
    console.log(err)
  })
}

// 底部分页的数据
const bot = reactive({
  total: 0,
  page_size: 5
})

// 所有音乐数据
const music_all = reactive({
  arr: []
})

// 加载
const loading = reactive({
  loading_content: false
})
// 获取音乐数据
const getMusic = (key, limit) => {
  loading.loading_content = true;
  setTimeout(() => {
    // 传递的数据
    let data = Qs.stringify({
      limit,
      page_size: bot.page_size
    })
    // 筛选
    if (!!key) {
      data = Qs.stringify({
        key,
        limit,
        page_size: bot.page_size
      })
    }
    // 发送请求
    proxy.$axios.post('/getMusic_all.php', data)
        .then((res) => {
          // console.log(res)
          if (res.data.code == 1) {
            music_all.arr = res.data.data;
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
  router.push('/home/allmusic/' + search.value + '/0');
}

// 展示全部音乐
const show_all = () => {
  search.value = '';
  router.push('/home/allmusic/null/0');
}

// 音乐添加、编辑栏信息
const music_table = reactive({
  music_id: '',
  song_name: '',
  songer: '',
  baner_img: '',
  audio: '',
  lrc: '',
  type: [],
  toplist: [],
  recomment: false,
  time: ''
})

// 是否开启添加、编辑音乐框
const music_tal = reactive({
  isShow: false,
  title: '',
  btnText: '',
  key: 0
});

// 错误信息
const err = reactive({
  err_1: '',
  err_2: '',
  err_3: '',
  err_4: '',
  err_5: '',
  err_6: '',
  err_7: ''
})
// 验证音乐信息的方法
const checkImg = () => {
  if (music_table.baner_img === '') {
    err.err_1 = '请选择图片~';
    return false;
  } else {
    err.err_1 = '';
    return true;
  }
}

const handleChange = (file) => {
  if (file.raw.type !== 'image/jpeg') {
    err.err_1 = '图片必须为image/jpeg格式~';
    return false;
  } else if (file.raw.size / 1024 / 1024 > 2) {
    err.err_1 = '图片大小不能超过2MB~';
    return false;
  }
  const raw = file.raw;
  // 转换base64格式
  base(raw, base => {
    music_table.baner_img = base;
  })
}

const checkSong_ID = () => {
  if (music_table.music_id === '') {
    err.err_7 = '请输入音乐ID~';
    return false;
  } else {
    err.err_7 = '';
    return true;
  }
}
const checkSong_name = () => {
  if (music_table.song_name === '') {
    err.err_2 = '请输入歌名~';
    return false;
  } else {
    err.err_2 = '';
    return true;
  }
}
const checkSonger = () => {
  if (music_table.songer === '') {
    err.err_3 = '请输入歌手~';
    return false;
  } else {
    err.err_3 = '';
    return true;
  }
}
const checkLrc = () => {
  if (music_table.lrc === '') {
    err.err_4 = '请输入歌词链接~';
    return false;
  } else if (music_table.lrc.indexOf('https') < 0) {
    err.err_4 = '请输入正确的歌词链接~';
    return false;
  } else {
    err.err_4 = '';
    return true;
  }
}
const checkAudio = () => {
  if (music_table.audio === '') {
    err.err_5 = '请输入音频链接~';
    return false;
  } else if (music_table.audio.indexOf('https') < 0) {
    err.err_5 = '请输入正确的音频链接~';
    return false;
  } else {
    err.err_5 = '';
    var audioElement = new Audio(music_table.audio);//audio也可获取视频的时长
    var duration;
    audioElement.addEventListener("loadedmetadata", function (_event) {
      duration = audioElement.duration;
      var mine = parseInt(duration / 60);
      var miao = Math.round(duration % 60);
      music_table.time = mine + ':' + miao;
    });
    return true;
  }
}
const checkType = () => {
  if (music_table.type.length <= 0) {
    err.err_6 = '请至少选择一种类型~';
    return false;
  } else {
    err.err_6 = '';
    return true;
  }
}
// 添加音乐
const addMusicBtn = () => {
  if (leavel != 3 && leavel != 5) {
    ElMessage.warning('权限不足~');
    return false;
  }
  // 修改框名
  music_tal.title = '音乐添加面板';
  // 修改按钮内容
  music_tal.btnText = '添加';
  // 打开面板
  music_tal.isShow = true;
}

// 编辑
const controls = (n) => {
  if (leavel != 3 && leavel != 5) {
    ElMessage.warning('权限不足~');
    return false;
  }
  // 修改框名
  music_tal.title = '音乐编辑面板';
  // 修改按钮内容
  music_tal.btnText = '保存';
  // 索引
  music_tal.key = n;
  // 打开面板
  music_tal.isShow = true;

  // 添加音乐添加、编辑栏信息
  music_table.music_id = music_all.arr[n].id;
  music_table.song_name = music_all.arr[n].song_name;
  music_table.songer = music_all.arr[n].songer;
  music_table.audio = music_all.arr[n].audio;
  music_table.lrc = music_all.arr[n].lrc;
  music_table.baner_img = music_all.arr[n].baner_img;
}

// 确定按钮
const ok = () => {
  const Img = checkImg();
  const Audio = checkAudio();
  const Songer = checkSonger();
  const Song_name = checkSong_name();
  const Lrc = checkLrc();
  if (music_tal.btnText === '保存') {
    if (!Img || !!err.err_1 || !Audio || !Songer || !Song_name || !Lrc) {
      return;
    }
    let flag = true;
    // 判断是否修改，修改则可修改信息
    for (var i in music_table) {
      if (i == 'type' || i == 'toplist' || i == 'recomment' || i == 'music_id' || i == 'time') {
        continue;
      }
      if (music_table[i] != music_all.arr[music_tal.key][i]) {
        flag = false;
        break;
      }
    }
    // 判断是否修改数据
    if (flag) {
      ElMessage.warning('您还没有修改如何数据呢~');
      return;
    }
    // 修改音乐
    proxy.$axios.post('/update_music_info.php', Qs.stringify({
      baner_img: music_table.baner_img,
      song_name: music_table.song_name,
      songer: music_table.songer,
      audio: music_table.audio,
      lrc: music_table.lrc,
      music_id: music_table.music_id,
      time: music_table.time
    }))
        .then((res) => {
          // console.log(res)
          if (res.data.code == 0) {
            ElMessage.warning(res.data.msg);
            return;
          }
          ElMessage.success(res.data.msg);
          // 关闭面板
          music_tal.isShow = false;
          // 加载数据
          getMusic(search.value, route.params.limit)
        }).catch((err) => {
      console.log(err);
    })
  } else {
    const Type = checkType();
    const ID = checkSong_ID();
    if (!Img || !!err.err_1 || !Audio || !Songer || !Song_name || !Lrc || !Type || !ID) {
      return;
    }
    // 添加音乐
    proxy.$axios.post('/add_music.php', Qs.stringify({
      baner_img: music_table.baner_img,
      song_name: music_table.song_name,
      songer: music_table.songer,
      audio: music_table.audio,
      lrc: music_table.lrc,
      id: music_table.music_id,
      type: music_table.type,
      toplist: music_table.toplist,
      recomment: music_table.recomment ? 1 : 0,
      time: music_table.music_id
    }))
        .then((res) => {
          // console.log(res)
          if (res.data.code == 0) {
            ElMessage.warning(res.data.msg);
            return;
          }
          ElMessage.success(res.data.msg);
          // 关闭面板
          music_tal.isShow = false;
          // 加载数据
          getMusic(search.value, route.params.limit)
        }).catch((err) => {
      console.log(err);
    })

  }
}

// 监听编辑、添加栏变化
watch(() => music_tal.isShow, (val) => {
  if (!val) {
    // 还原默认
    for (var i in music_table) {
      if (i === 'type' || i === 'toplist') {
        music_table[i] = [];
        continue;
      } else if (i === 'recomment') {
        music_table[i] = false;
        continue;
      }
      music_table[i] = '';
    }
    // 还原提示
    for (var i in err) {
      err[i] = '';
    }
  }
})

// 监听路由变化
watch(() => route.path, (val) => {
  // 跳转页面
  getMusic(search.value, route.params.limit)
})

// 获取分页子组件传递的值
const getSize = (e) => {
  bot.page_size = e;
  // 加载数据
  getMusic(search.value, route.params.limit)
}

// 页面渲染完毕
onMounted(() => {
  if (!!$cookies.get('user_info')) {
    // 获取音乐类型
    getType();
    // 获取排行榜
    getList();
    // 加载数据
    getMusic(search.value, route.params.limit)
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

  #content {

    .audio,
    .lrc {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
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

  .el-dialog {
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