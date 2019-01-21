/**
 * Created by hao.cheng on 2017/5/5.
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';
var dataStyle = {
    normal: {
        label: {
            show: false
        },
        labelLine: {
            show: false
        }
    }
};
var placeHolderStyle = {
    normal: {
        color: 'rgba(240,240,240,0.4)',//未完成的圆环的颜色
        label: {
            show: false
        },
        labelLine: {
            show: false
        }
    },
    emphasis: {
        color: 'rgba(240,240,240,0.4)',//未完成的圆环的颜色
    }
};
class Calpolice extends React.Component{
    render(){
        if(rate!==0 && alarmNumber!==0){
            var rate =this.props.falseNumber;
            var alarmNumber=this.props.alarmNumber;
        }
        const linear_color = {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1
        };
        const option = {
            title: {
                text: (rate/alarmNumber*100).toFixed(2)+"%",
                x: 'center',
                y: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    color: '#EF5545',
                    fontSize: 20
                }
            },
            color: ['#18CBFF'],
            tooltip: {
                show: false,
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                show: false,
                itemGap: 12,
                data: ['01', '02']
            },
            toolbox: {
                show: false,
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: false
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            series: [{
                name: 'Line 1',
                type: 'pie',
                clockWise: false,
                radius: [50, 60],
                itemStyle: dataStyle,
                hoverAnimation: false,

                data: [{
                    value: rate,
                    name: '01'
                }, {
                    value: alarmNumber,
                    name: 'invisible',
                    itemStyle: placeHolderStyle
                }

                ]
            }, {
                name: 'Line 2',
                type: 'pie',
                animation: false,
                clockWise: false,
                radius: [50, 50],
                itemStyle: dataStyle,
                hoverAnimation: false,
                tooltip: {
                    show: false
                },
                data: [{
                    value: 100,
                    name: '02',
                    itemStyle: {
                        emphasis: {
                            color: '#313443'
                        }
                    }
                }, {
                    value: 0,
                    name: 'invisible',
                    itemStyle: placeHolderStyle
                }

                ]
            },


            ]
        };
        return(
            <ReactEcharts
                option={option}
                style={{height: '136px', width: '100%'}}
                className={'react_for_echarts'}
            />
        )
    }
}

export default Calpolice;