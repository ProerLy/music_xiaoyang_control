<template>
    <div id="myChart"></div>
</template>
<script>
export default {
    name: 'pieChart'
}
</script>
<script setup>
import { onMounted, reactive, toRefs } from 'vue'
import { LegendComponent } from 'echarts/components'
// 引入基本模板
let echarts = require('echarts/lib/echarts');
echarts.use([LegendComponent]);
// 引入饼状图组件
require('echarts/lib/chart/pie');
// 引入提示框和title组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
const props = defineProps(['series', 'text']);
const { series, text } = toRefs(props);
const echartsOption = reactive({	// echarts选项，所有绘图数据和样式都在这里设置
    title: {
        text: text,//主标题
        subtext: '七语熙音乐馆',//副标题
        x: 'center',//x轴方向对齐方式
    },
    legend: {   // 底部图标样式
        bottom: '0%',
        left: 'center'
    },
    tooltip: {   //鼠标放到图上的数据展示样式
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    series: [{  //series中加入每个bar的数据
        name: '男女占比',
        type: 'pie',
        radius: '60%',  // 大小
        data: series,
        center: ['50%', '50%'], // 位置
        itemStyle: {    // 样式
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                label: {
                    fontSize: '30',
                    fontWeight: 'bold'
                }
            }
        }
    }],
})
onMounted(() => {
    setTimeout(() => {
        let myChart = echarts.init(document.getElementById('myChart'), 'light')	// 初始化echarts, theme为light
        myChart.setOption(echartsOption)	// echarts设置选项
    }, 2000);
}) 
</script>

<style>
#myChart {
    width: 100%;
    height: 500px;
    margin: 0 auto;
}
</style>
