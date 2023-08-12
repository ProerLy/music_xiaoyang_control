<template>
    <div id="main"></div>
</template>
<script>
export default {
    name: 'lineChart'
}
</script>
<script setup>
import { onMounted, toRefs, reactive } from 'vue'
// 引入基本模板
import * as echarts from 'echarts';
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
const props = defineProps(['xAxis', 'series', 'text']);
const { xAxis, series, text } = toRefs(props);
const echartOption = reactive({
    title: {
        text: text,
        subtext: '七语熙音乐馆',//副标题
        x: 'center',//x轴方向对齐方式
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        bottom: '0%',
        left: 'center'
    },
    xAxis: {
        type: 'category',
        data: xAxis,
        nameTextStyle: {
            color: '#fff',
        },
        axisTick: {
            show: false,
        },
        axisLabel: {
            show: true, // 是否显示刻度标签，默认显示
            interval: 0, // 坐标轴刻度标签的显示间隔，在类目轴中有效；默认会采用标签不重叠的策略间隔显示标签；可以设置成0强制显示所有标签；如果设置为1，表示『隔一个标签显示一个标签』，如果值为2，表示隔两个标签显示一个标签，以此类推。
            rotate: -30, // 刻度标签旋转的角度，在类目轴的类目标签显示不下的时候可以通过旋转防止标签之间重叠；旋转的角度从-90度到90度
            inside: false, // 刻度标签是否朝内，默认朝外
            margin: 13, // 刻度标签与轴线之间的距离
            formatter: '{value}', // 刻度标签的内容格式器
            // color: '#ccc'
        }
    },
    yAxis: {
        type: 'value',
        scale: true,
        min: 0,
        splitNumber: 10,
        boundaryGap: [0.2, 0.2],
        axisLabel: {
            margin: 14, // 刻度标签与轴线之间的距离
            // color: '#ccc'
        },
        splitLine: {
            // 网格线
            show: true,
            lineStyle: { //分割线
                color: "#6f747a70",
                width: 1,
                type: "dotted" //dotted：虚线 solid:实线
            }
        },
        axisLine: {
            // 轴线
            show: true,
        }
    },
    series: [
        {
            data: series,
            type: 'bar',
            stack: 'total',
            emphasis: {
                focus: 'series'
            },
            itemStyle: {
                color: 'red',
            }
        }
    ]
})

onMounted(() => {
    setTimeout(() => {
        // 初始化echarts
        let myChart = echarts.init(document.getElementById('main'), 'light');
        myChart.setOption(echartOption);
    }, 2000);
})
</script>

<style>
#main {
    width: 100%;
    height: 500px;
    margin: 0 auto;
}
</style>