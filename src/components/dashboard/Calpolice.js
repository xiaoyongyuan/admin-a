/**
 * Created by hao.cheng on 2017/5/5.
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';
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
            y2: 1,
            colorStops: [{
                offset: 0,
                color: '#18CBFF'
            }, {
                offset: 1,
                color: '#ede0ff'
            }]
        };
        const option = {
            title: {
                textStyle: {
                    color: '#000000',
                    fontSize: 20,
                    fontWeight: 'bold'
                },
                left: 'center',
                bottom: '3%'
            },
        
            series: [{
                type: 'pie',
                hoverAnimation: false,
                radius: ['70%', '70%'],
                startAngle: 225,
                labelLine: {
                    show: false
                },
                data: [{
                    value: rate * 70,
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: (rate/alarmNumber).toFixed(2) + '%',
                            textStyle: {
                                color: '#000000',
                                fontSize: 15
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: linear_color,
                            borderWidth: 20
                        }
                    }
                }, {
                    value: alarmNumber - rate * alarmNumber,
                    itemStyle: {
                        normal: {
                            borderColor: 'rgba(250,250,250,1)',
                            borderWidth: 5
                        }
                    }
                }, {
                    value: alarmNumber,
                    itemStyle: {
                        normal: {
                            color: "rgba(0,0,0,0)"
                        }
                    }
                }]
            }]
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