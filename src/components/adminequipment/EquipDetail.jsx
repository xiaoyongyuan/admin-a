import React, { Component } from 'react';
import {post} from "../../axios/tools";
import {Form,Input,Radio,DatePicker,Icon,Row,Col} from 'antd';
import '../../style/yal/home.css';
const FormItem = Form.Item;

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
            cname:''
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
                    cname:res.data.cname
                })

                // this.props.form.setFieldsValue({
                //     ecode: res.data.ecode,
                //     lastheart:res.data.lastheart.time,
                //     lastonce:res.data.lastonce,
                //     lasttwice:res.data.lasttwice,
                //     cname:res.data.cname
                //
                // });
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
                            {/* 围界入侵 */}
                            {this.state.lastheart}
                        </Col>
                    </Row>
                    <Row className="equ_row">
                        <Col span={7} className="t_r">
                            最后一次报警时间：
                        </Col>
                        <Col span={10} className="t_l">
                            {/* 围界入侵 */}
                            {this.state.lastonce}
                        </Col>
                    </Row>
                    <Row className="equ_row">
                        <Col span={7} className="t_r">
                            最后二次报警时间：
                        </Col>
                        <Col span={10} className="t_l">
                            {/* 围界入侵 */}
                            {this.state.lasttwice}
                        </Col>
                    </Row>
                    <Row className="equ_row">
                        <Col span={7} className="t_r">
                            所属公司：
                        </Col>
                        <Col span={10} className="t_l">
                            {/* 围界入侵 */}
                            {this.state.cname}
                        </Col>
                    </Row>








                </div>
            </div>
        )
    }

}

export default ModaEquipDetail = Form.create({})(ModaEquipDetail);