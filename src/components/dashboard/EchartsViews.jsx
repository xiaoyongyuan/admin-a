/**
 * Created by hao.cheng on 2017/5/5.
 */
import React,{ Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

class EchartsViews extends Component{
    render(){
        const optionDatas = {
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
                        margin: 15,
                    },
                },
                axisTick: {show: false,},
                data: this.props.times,
            }],
            yAxis: [{
                type: 'value',
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#BDD2FB'
                    }
                },
                axisLine: {show: false,},
                axisLabel: {
                    margin: 20,
                    textStyle: {
                        color: '#818385',

                    },
                },
                axisTick: {show: false,},
            }],
           /* dataZoom: [{
                type: 'inside',
                start: 0,
                end: 40
            }, {
                start: 0,
                end: 30,
                //handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],*/
            series: [{
                name: '月入网数',
                type: 'line',
                smooth: true, //是否平滑曲线显示
// 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
                symbolSize: 0,

                lineStyle: {
                    normal: {
                        color: "#6D9FF9"
                    }
                },
                //区域填充样式
                areaStyle: {
                    normal: {
                        //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {offset: 0, color: 'rgba(212,230,255, 0.9)'},
                            {offset: 0.7, color: 'rgba(243,247,255, 0)'}
                        ], false),

                        shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
                        shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                    }
                },
                data: this.props.line
            }]
        };
        return(
            <ReactEcharts
                option={optionDatas}
                style={{height:"220px", width:"100%"}}
                className={'react_for_echarts'}
            />
        )
    }
}
export default EchartsViews;