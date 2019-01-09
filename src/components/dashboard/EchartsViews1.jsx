/**
 * Created by hao.cheng on 2017/5/5.
 */
import React,{ Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import axios from "axios";
class EchartsViews extends Component{
    constructor(props){
        super(props);
        this.state={
            lineData:[]
        }
    }
    render(){
        const option = {
            grid: {
                top: '8%',
                left: '1%',
                right: '1%',
                bottom: '8%',
                containLabel: true,
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLine: { //坐标轴轴线相关设置。数学上的x轴
                    show: false,
                    lineStyle: {
                        color: '#233e64'
                    },
                },
                axisLabel: { //坐标轴刻度标签的相关设置
                    textStyle: {
                        color: '#818385',
                        margin:15,
                    },
                },
                axisTick: { show: false,},
                data: ['6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7'],
            }],
            yAxis: [{
                type: 'value',
                min: 0,
                max:140,
                splitNumber: 7,
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#BDD2FB'
                    }
                },
                axisLine: {show: false,},
                axisLabel: {
                    margin:20,
                    textStyle: {
                        color: '#818385',

                    },
                },
                axisTick: { show: false,},
            }],
            series: [{
                name: '月入网数',
                type: 'line',
                smooth: true, //是否平滑曲线显示
// 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
                symbolSize:0,

                lineStyle: {
                    normal: {
                        color:"#6D9FF9"
                    }
                },
                //区域填充样式
                areaStyle: {
                    normal: {
                        //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {offset:0, color:'rgba(212,230,255, 0.9)'},
                            {offset:0.7,color:'rgba(243,247,255, 0)'}
                        ], false),

                        shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
                        shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                    }
                },
                data: this.props.line
            }]
        };
        return(
            <ReactEcharts option ={option} style={{height:"220px", width:"100%"}} />
        )
    }
}
export default EchartsViews;