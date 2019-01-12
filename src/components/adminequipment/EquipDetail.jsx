import React, { Component } from 'react';
import {post} from "../../axios/tools";
import {Form,Row,Col} from 'antd';
import '../../style/yal/home.css';

let vis=false;
class ModaEquipDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            visible:props.visible || false,
            form:false,
            ecode:'',
            lastheart:'',
            lastonce:'',
            lasttwice:'',
            cname:'',
            temp:'',
            hardware:'',
            software:'',
            cid:'',
            login:'',
            upgrade:''
        };
    }
    componentDidMount() {
        this.setState({
            code: this.props.code,
        },()=>{
            this.requestdata()
        })

    }
    componentWillReceiveProps(nextProps){
        console.log("componentWillReceiveProps")

        if( nextProps.visible != vis){
            vis=nextProps.visible;

            if(nextProps.visible){
                console.log("nextProps", nextProps);
                // return;
                vis=nextProps.visible;
                this.setState({
                    code: nextProps.code,
                },()=>{
                    this.requestdata()
                })

            }
        }

    }


    requestdata=() => {//取数据
            post({url:"/api/equipment/getoneforadmin ",data:{code:this.state.code} }, (res)=>{
                this.setState({
                    ecode:res.data.ecode,
                    lastheart:res.data.lastheart.time,
                    lastonce:res.data.lastonce,
                    lasttwice:res.data.lasttwice,
                    cname:res.data.cname,
                    temp:res.data.lastheart.temp,
                    hardware:res.data.login.version,
                    software:res.data.software,
                    comid:res.data.cid,
                    upgrade:res.data.upgrade.time

                })
            })

    }
    render() {
        return(
            <div style={{backgroundColor:"#fff",padding:"1%"}}>
                <div className="box-padding">
                    {/*<p> <Icon type="bars" /> 设备信息</p>*/}
                    <Row className="equ_row">
                        <Col span={7} className="t_r">
                            设备编号：
                        </Col>
                        <Col span={10} className="t_l">
                            {this.state.ecode}
                        </Col>
                    </Row>
                    <Row className="equ_row">
                        <Col span={7} className="t_r">
                            最后一次心跳时间：
                        </Col>
                        <Col span={10} className="t_l">
                            {this.state.lastheart}
                        </Col>
                    </Row>
                    <Row className="equ_row">
                        <Col span={7} className="t_r">
                            最后一次报警时间：
                        </Col>
                        <Col span={10} className="t_l">
                            {this.state.lastonce}
                        </Col>
                    </Row>
                    <Row className="equ_row">
                        <Col span={7} className="t_r">
                            最后二次报警时间：
                        </Col>
                        <Col span={10} className="t_l">
                            {this.state.lasttwice}
                        </Col>
                    </Row>
                    <Row className="equ_row">
                        <Col span={7} className="t_r">
                            所属公司：
                        </Col>
                        <Col span={10} className="t_l">
                            {this.state.cname}
                        </Col>
                    </Row>
                    <Row className="equ_row">
                        <Col span={7} className="t_r">
                            温度：
                        </Col>
                        <Col span={10} className="t_l">
                            <div>
                                {this.state.temp < 55
                                    ? <div>{this.state.temp}℃</div>
                                    :<div style={{ color:'#f00' }}><div>{this.state.temp}℃</div></div>
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row className="equ_row">
                        <Col span={7} className="t_r">
                            硬件版本：
                        </Col>
                        <Col span={10} className="t_l">
                            {this.state.hardware}
                        </Col>
                    </Row>
                    <Row className="equ_row">
                        <Col span={7} className="t_r">
                            软件版本：
                        </Col>
                        <Col span={10} className="t_l">
                            {this.state.software}
                        </Col>
                    </Row>
                    <Row className="equ_row">
                        <Col span={7} className="t_r">
                            最后一次升级时间：
                        </Col>
                        <Col span={10} className="t_l">
                            {this.state.upgrade}
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default ModaEquipDetail = Form.create({})(ModaEquipDetail);