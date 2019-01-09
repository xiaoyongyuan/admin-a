/**
 * Created by hao.cheng on 2017/5/5.
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';
class Onlineeq extends React.Component{
    render(){
        var data = [];
        for(var i=1 ;i<=60;i++ ){
            if (i<=20) {
                data.push({
                    value: this.props.equipmentcount,
                    name: '在线设备数'
                })
            }
            if(i>30&&i<=60){
                data.push({
                    value: 1,
                    name: 'aaa'
                })}
            if(i>30&&i<=60){
                data.push({
                    value:1,
                    name: 'bbcc'
                })
            }

        }
        const option = {
            title: {
                text: (this.props.equipmentcount/this.props.equipmentEtotal).toFixed(2)+"%",
                x: 'center',
                y: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    color: '#000000',
                    fontSize: 20
                }
            },
            series: [{
                name: '在线设备',
                type: 'pie',
                radius: ['70%', '90%'],
                center: ['50%', '50%'],
                clockwise: false,
                data: data,
                color: [
                    '#FF9208',
                    '#fff',
                    "#CFCFCF",
                ],
                hoverAnimation: false,
                legendHoverLink: false,
                label: {
                    normal: {
                        show:false,
                    },
                    emphasis:{
                        show:false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: 4,
                        borderColor: '#ffffff',
                    },
                    emphasis: {
                        borderWidth: 0,
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            },

            ],

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
export default Onlineeq;