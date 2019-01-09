/**
 * Created by hao.cheng on 2017/5/5.
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';
class Classifiedaccess extends React.Component{
    render(){
        const data = [{
            value: this.props.classifiedLAN,
            name:"局域网"
        }, {
            name:"树莓派",
            value: this.props.raspberry,
            selected: true
        }]
        const option = {
            title: {
                show: false,
            },
           tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend:{
                show:true,
                icon: "circle",
                data:["树莓派","局域网"],
                orient: 'vertical',
                x: 'right',
                y:'bottom'
            },
            series: [{
                name: '分类入网数',
                type: 'pie',
                hoverAnimation: false,
                avoidLabelOverlap: false,
                radius: [0, '74%'],
                label: {
                    normal: {
                        position: 'inner',
                        formatter: "{c}\n{b}",
                        fontSize: 14,
                        show:false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                color: ['#EFA121', '#FB7575'],
                data: data
            }]
        };
        return(
            <ReactEcharts
            option={option}
            style={{height: '167px', width: '100%'}}
            className={'react_for_echarts'}
        />
        )
    }
}

export default Classifiedaccess;